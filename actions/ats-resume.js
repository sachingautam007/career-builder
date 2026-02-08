"use server";

import { z } from "zod";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2); //if request is exausted use this Temporary
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const LEVEL_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 80,
};

const MAX_RAW_TEXT = 15_000;
const MAX_PROMPT_CHARS = 6_000;
const MAX_PREVIEW_DECODED = 5 * 1024 * 1024; // 5MB decoded payload
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const scanSchema = z
  .object({
    title: z.string().max(120).optional(),
    rawText: z
      .string()
      .min(200, "Resume text is too short. Please provide at least 200 characters.")
      .max(MAX_RAW_TEXT, "Resume text is too long (15k limit)."),
    fileName: z.string().optional(),
    wordCount: z.number().optional(),
    filePreview: z.string().optional(),
  })
  .strict();

function mapLevel(score) {
  if (score < LEVEL_THRESHOLDS.LOW) return "LOW";
  if (score < LEVEL_THRESHOLDS.MEDIUM) return "MEDIUM";
  return "HIGH";
}

function sanitizeScore(val) {
  const n = Number(val);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

function sanitizePreview(dataUrl) {
  if (!dataUrl) return null;
  return assertPdfPreview(dataUrl);
}

function assertPdfPreview(dataUrl) {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:application\/pdf;base64,(.+)$/i);
  if (!match) return null;

  const base64 = match[1];
  let bytes;
  try {
    bytes = Buffer.from(base64, "base64");
  } catch (_) {
    return null;
  }

  if (!bytes || !bytes.length || bytes.length > MAX_PREVIEW_DECODED) return null;
  const header = bytes.subarray(0, 5).toString("ascii");
  if (header !== "%PDF-") return null;
  return dataUrl;
}

function validatePayload(payload) {
  if (
    payload == null ||
    typeof payload.overallScore === "undefined" ||
    Number.isNaN(Number(payload.overallScore))
  ) {
    throw new Error("Model did not return a score");
  }

  const safe = {
    overallScore: sanitizeScore(payload?.overallScore ?? 0),
    level:
      payload?.level === "LOW" || payload?.level === "MEDIUM" || payload?.level === "HIGH"
        ? payload.level
        : undefined,
    breakdown: {
      tone: {
        score: sanitizeScore(payload?.breakdown?.tone?.score ?? 0),
        description: payload?.breakdown?.tone?.description || "No description provided",
      },
      content: {
        score: sanitizeScore(payload?.breakdown?.content?.score ?? 0),
        description: payload?.breakdown?.content?.description || "No description provided",
      },
      structure: {
        score: sanitizeScore(payload?.breakdown?.structure?.score ?? 0),
        description: payload?.breakdown?.structure?.description || "No description provided",
      },
      skills: {
        score: sanitizeScore(payload?.breakdown?.skills?.score ?? 0),
        description: payload?.breakdown?.skills?.description || "No description provided",
      },
    },
    feedback: Array.isArray(payload?.feedback)
      ? payload.feedback.filter(Boolean).slice(0, 12)
      : [],
    keywords: sanitizeKeywords(payload?.keywords ?? payload?.keywordsList),
    avoidKeywords: sanitizeModelAvoidKeywords(payload?.avoidKeywords ?? payload?.avoid),
  };

  safe.level = safe.level || mapLevel(safe.overallScore);
  return safe;
}

function sanitizeModelAvoidKeywords(list) {
  if (!Array.isArray(list)) return [];
  const cleaned = [];
  const seen = new Set();
  for (const item of list) {
    if (typeof item !== "string") continue;
    const word = item.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(word);
    if (cleaned.length >= 12) break;
  }
  return cleaned;
}

function parseModelJson(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty model response");
  }

  const cleaned = raw
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();

  const attempts = [
    cleaned,
    cleaned.match(/\{[\s\S]*\}/)?.[0],
    cleaned.replace(/,\s*([}\]])/g, "$1"), // strip trailing commas
    cleaned.replace(/'/g, '"'), // single to double
  ];

  for (const candidate of attempts) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch (_) {
      // try next
    }
  }

  throw new Error("Model response was not valid JSON");
}

function resumePrompt({ rawText, user, title }) {
  return `
You are an ATS and resume optimization expert.
Evaluate the following resume text (best-practice rubric, no job description matching).
Return ONLY valid JSON matching this schema:
{
  "overallScore": number 0-100,
  "level": "LOW" | "MEDIUM" | "HIGH",
  "breakdown": {
    "tone": { "score": number, "description": string },
    "content": { "score": number, "description": string },
    "structure": { "score": number, "description": string },
    "skills": { "score": number, "description": string }
  },
  "feedback": string[] // concrete improvements, max 12
}
Scoring guidelines:
- Tone/Style: clarity, professionalism, action verbs, concision.
- Content: quantified achievements, relevance to tech/industry, seniority fit.
- Structure: sections, ordering, readability, bullets, contact info.
- Skills: hard skills presence, modern tools, consistency, duplication.
Map overallScore to levels: <50 LOW, 50-79 MEDIUM, 80-100 HIGH.
Candidate context:
- Industry: ${user.industry ?? "unknown"}
- Experience (years): ${user.experience ?? "n/a"}
- Skills: ${user.skills?.join(", ") ?? "not provided"}
- Title hint: ${title || "not provided"}
Resume text to analyze:
"""${rawText}"""
`;
}

async function enforceRateLimit(userId) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentCount = await db.resume.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });

  if (recentCount >= RATE_LIMIT_MAX) {
    const err = new Error("Too many scans, try again in 5 minutes.");
    err.code = 429;
    throw err;
  }
}

export async function scanResume({
  title,
  rawText,
  fileName,
  wordCount,
  filePreview,
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const input = scanSchema.parse({ title, rawText, fileName, wordCount, filePreview });

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  await enforceRateLimit(user.id);

  const prompt = resumePrompt({
    rawText: input.rawText.slice(0, MAX_PROMPT_CHARS),
    user,
    title: input.title,
  });

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const responseText = result.response.text().trim();
    const parsed = parseModelJson(responseText);

    const safe = validatePayload(parsed);
    const role = input.title || input.fileName;

    // Generate keywords/avoid lists using the rawText (server-side).
    const [generatedKeywords, generatedAvoid] = await Promise.all([
      safe.keywords?.length
        ? safe.keywords
        : generateKeywordsFromModel({ rawText: input.rawText.slice(0, MAX_PROMPT_CHARS), role }).catch(() =>
            fallbackKeywords(role)
          ),
      safe.avoidKeywords?.length
        ? safe.avoidKeywords
        : generateAvoidKeywordsFromModel({ rawText: input.rawText.slice(0, MAX_PROMPT_CHARS), role }).catch(() =>
            fallbackAvoidKeywords(input.rawText)
          ),
    ]);

    const resume = await db.resume.create({
      data: {
        title: input.title || input.fileName || "Untitled resume",
        sourceType: "UPLOAD",
        fileName: input.fileName,
        wordCount: input.wordCount,
        rawText: input.rawText,
        content: sanitizePreview(input.filePreview),
        overallScore: safe.overallScore,
        level: safe.level,
        breakdown: safe.breakdown,
        feedback: safe.feedback,
        keywords: generatedKeywords?.length ? generatedKeywords.slice(0, 25) : fallbackKeywords(role),
        avoidKeywords: generatedAvoid?.length ? generatedAvoid.slice(0, 12) : fallbackAvoidKeywords(input.rawText),
        userId: user.id,
      },
    });

    return resume;
  } catch (error) {
    console.error("Error scanning resume:", error?.message);
    const err = new Error(
      error?.code === 429 || /too many scans/i.test(error?.message || "")
        ? "Too many scans, try again in 5 minutes."
        : "Failed to scan resume"
    );
    err.code = error?.code;
    throw err;
  }
}

// --- Keyword generation (role-focused, 20-25 items) ---
async function generateKeywordsFromModel({ rawText, role }) {
  const prompt = `
Act as a resume optimization AI. Given the resume text and target role/title, return ONLY JSON:
{ "keywords": string[] }
Rules:
- 20 to 25 keywords, short phrases (1-3 words), comma free.
- Prioritize skills, tools, and responsibilities aligned to the role.
- No generic soft skills ("hardworking", "team player") and no duplicates.
- Do not include words already overused in the resume unless they are core to the role.
- Return only JSON, no comments.
Role: ${role || "unspecified"}
Resume:
"""${rawText.slice(0, 5000)}"""
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const parsed = parseModelJson(result.response.text().trim());
  return sanitizeKeywords(parsed?.keywords);
}

function sanitizeKeywords(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const cleaned = [];
  for (const item of list) {
    if (!item || typeof item !== "string") continue;
    const word = item.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(word);
    if (cleaned.length >= 25) break;
  }
  return cleaned.slice(0, 25);
}

function fallbackKeywords(role) {
  const roleWords = getRoleKeywords(role);
  const base = [
    "impact",
    "ownership",
    "scalable",
    "secure",
    "reliable",
    "automated",
    "optimized",
    "delivered",
    "mentored",
    "collaborated",
    "measured",
  ];
  const unique = [];
  const seen = new Set();
  for (const word of [...roleWords, ...base]) {
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(word);
    if (unique.length >= 25) break;
  }
  return unique.slice(0, 25);
}

export async function getKeywordsForResume(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: { id, userId: user.id },
    select: { rawText: true, title: true, fileName: true, keywords: true },
  });

  if (!resume?.rawText) return fallbackKeywords(resume?.title || resume?.fileName);

  // Return cached when available
  if (Array.isArray(resume.keywords) && resume.keywords.length) return resume.keywords;

  const role = resume.title || resume.fileName;
  try {
    const keywords = await generateKeywordsFromModel({
      rawText: resume.rawText,
      role,
    });
    const finalKeywords = keywords.length ? keywords : fallbackKeywords(role);

    await db.resume.update({
      where: { id },
      data: { keywords: finalKeywords },
    });

    return finalKeywords;
  } catch (err) {
    // Gracefully fall back on rate limits or other errors
    if (String(err?.message || "").includes("429")) {
      return fallbackKeywords(role);
    }
    console.error("Keyword generation failed", err?.message);
    return fallbackKeywords(role);
  }
}

// ----- Avoid keywords (phrases to remove/replace) -----
async function generateAvoidKeywordsFromModel({ rawText, role }) {
  const prompt = `
Act as an ATS/resume expert. Find cliche, vague, or outdated phrases that appear in the resume text.
Return ONLY JSON:
{ "avoid": string[] }
Rules:
- 5 to 12 items.
- Each item must be a phrase that actually appears in the resume text.
- Focus on cliches like "responsible for", "team player", vague verbs, or empty buzzwords.
- No commentary, no extra fields.
Role: ${role || "unspecified"}
Resume:
"""${rawText.slice(0, 5000)}"""
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const parsed = parseModelJson(result.response.text().trim());
  return sanitizeAvoidKeywords(parsed?.avoid, rawText);
}

function sanitizeAvoidKeywords(list, rawText) {
  if (!Array.isArray(list)) return [];
  const lower = (rawText || "").toLowerCase();
  const seen = new Set();
  const cleaned = [];
  for (const phrase of list) {
    if (typeof phrase !== "string") continue;
    const p = phrase.trim();
    if (!p) continue;
    // Split overly long phrases into smaller, ATS-friendly chunks.
    const parts = splitLongPhrase(p);
    for (const part of parts) {
      const key = part.toLowerCase();
      if (!lower.includes(key)) continue; // ensure it exists in resume
      if (seen.has(key)) continue;
      seen.add(key);
      cleaned.push(part);
      if (cleaned.length >= 12) break;
    }
    if (cleaned.length >= 12) break;
  }
  return cleaned;
}

function splitLongPhrase(phrase) {
  const MAX_LEN = 45;
  if (phrase.length <= MAX_LEN) return [phrase];

  // Split on space nearest to midpoint
  const mid = Math.floor(phrase.length / 2);
  let splitIdx = phrase.indexOf(" ", mid);
  if (splitIdx === -1 || splitIdx > mid + 15) {
    splitIdx = phrase.lastIndexOf(" ", mid);
  }
  if (splitIdx === -1) return [phrase]; // no spaces

  const first = phrase.slice(0, splitIdx).trim();
  const second = phrase.slice(splitIdx + 1).trim();
  return [first, second].filter(Boolean);
}

function fallbackAvoidKeywords(rawText) {
  const lower = (rawText || "").toLowerCase();
  const candidates = [
    "responsible for",
    "hardworking",
    "team player",
    "self-starter",
    "synergy",
    "detail oriented",
    "references available",
    "go-getter",
    "dynamic",
    "works well under pressure",
  ];
  return candidates.filter((c) => lower.includes(c));
}

export async function getAvoidKeywordsForResume(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: { id, userId: user.id },
    select: { rawText: true, title: true, fileName: true, avoidKeywords: true },
  });

  if (!resume?.rawText) return [];

  if (Array.isArray(resume.avoidKeywords) && resume.avoidKeywords.length) {
    return resume.avoidKeywords;
  }

  const role = resume.title || resume.fileName;
  try {
    const avoid = await generateAvoidKeywordsFromModel({
      rawText: resume.rawText,
      role,
    });
    const finalAvoid = avoid.length ? avoid : fallbackAvoidKeywords(resume.rawText);

    await db.resume.update({
      where: { id },
      data: { avoidKeywords: finalAvoid },
    });

    return finalAvoid;
  } catch (err) {
    // Gracefully fall back on rate limits or other errors
    if (String(err?.message || "").includes("429")) {
      return fallbackAvoidKeywords(resume.rawText);
    }
    console.error("Avoid keyword generation failed", err?.message);
    return fallbackAvoidKeywords(resume.rawText);
  }
}

function getRoleKeywords(role = "") {
  const key = (role || "").toLowerCase();
  const map = [
    {
      match: ["software", "engineer", "developer"],
      words: [
        "typescript",
        "react",
        "node.js",
        "api",
        "unit tests",
        "performance",
        "observability",
        "ci/cd",
        "architecture",
      ],
    },
    {
      match: ["frontend", "ui"],
      words: [
        "accessibility",
        "design system",
        "responsive",
        "tailwind",
        "a11y",
        "cross-browser",
        "web vitals",
        "component library",
      ],
    },
    {
      match: ["backend"],
      words: ["microservices", "postgres", "caching", "queues", "observability", "apis", "scalability", "latency"],
    },
    {
      match: ["product"],
      words: ["roadmap", "experiments", "impact", "stakeholder", "kpi", "prioritized", "hypotheses"],
    },
    {
      match: ["data", "analyst", "science"],
      words: ["python", "sql", "dashboards", "experimentation", "modeling", "etl", "feature store", "airflow"],
    },
    {
      match: ["devops", "sre"],
      words: ["ci/cd", "terraform", "kubernetes", "uptime", "incident", "runbooks", "monitoring", "on-call"],
    },
    {
      match: ["qa", "quality", "tester"],
      words: ["automation", "regression", "selenium", "cypress", "test cases", "coverage", "defect rate"],
    },
    {
      match: ["design", "ux"],
      words: ["wireframes", "prototypes", "usability", "figma", "handoff", "user research", "heuristics"],
    },
    { match: ["marketing"], words: ["campaign", "conversion", "seo", "copy", "funnel", "retention", "cta"] },
    { match: ["sales"], words: ["pipeline", "prospecting", "closing", "quota", "crm", "negotiated", "win rate"] },
  ];

  for (const entry of map) {
    if (entry.match.some((m) => key.includes(m))) return entry.words;
  }

  return (role || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

export async function getResumes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  return db.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      fileName: true,
      overallScore: true,
      level: true,
      createdAt: true,
      sourceType: true,
    },
  });
}

export async function getResume(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  return db.resume.findFirst({
    where: { id, userId: user.id },
  });
}

export async function deleteResume(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Only delete resumes owned by the current user
  return db.resume.deleteMany({
    where: { id, userId: user.id },
  });
}
