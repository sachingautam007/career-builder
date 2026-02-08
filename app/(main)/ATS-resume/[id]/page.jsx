export const revalidate = 0;
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getResume, getKeywordsForResume, getAvoidKeywordsForResume } from "@/actions/ats-resume";
import ScoreSummary from "../_components/score-summary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export default async function ViewATSresume({ params }) {
  const { id } = await params;
  const resume = await getResume(id);
  const keywords = (await getKeywordsForResume(id)) ?? [];
  const removeKeywords = (await getAvoidKeywordsForResume(id)) ?? [];

  if (!resume) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not found</CardTitle>
          <CardDescription>This resume scan does not exist.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isPdf = resume.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div className="min-h-screen bg-gradient-to-br
from-purple-400
via-blue-200
to-cyan-500 py-10 rounded-3xl">
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="flex items-center justify-between">
          <Link href="/ATS-resume" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg">
            <ArrowLeft className="h-4 w-4" />
            Back to scans
          </Link>
          <Badge variant="secondary" className="uppercase tracking-wide">
            {resume.level}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="relative border-0 shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.12),transparent_25%)]" />
            <CardHeader className="relative">
              <CardTitle className="text-bold text-cyan-300 text-lg text-2xl">
                {resume.title || resume.fileName || "Resume review"}
              </CardTitle>
              <CardDescription className="text-slate-200">
                Scanned on {format(new Date(resume.createdAt), "PPP p")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-white border-white/10">
                  {resume.sourceType}
                </Badge>
                {resume.fileName && (
                  <Badge className="bg-white/10 text-white border-white/10">
                    {resume.fileName}
                  </Badge>
                )}
                {resume.wordCount ? (
                  <Badge className="bg-white/10 text-white border-white/10">
                    {resume.wordCount} words
                  </Badge>
                ) : null}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200">Overall ATS score</span>
                  <span className="text-3xl font-bold text-white">
                    {Math.round(resume.overallScore)}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-300"
                    style={{ width: `${Math.min(100, Math.max(0, resume.overallScore))}%` }}
                  />
                </div>
                <p className="text-sm text-slate-200/80">
                  Your resume was analyzed for ATS readiness, please check the decription where to imporve.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
                <p className="text-sm font-semibold text-white">Highlights</p>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    Saved on the latest scan with detailed category scores.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                    Review tone, content, structure, and skills below.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-rose-300" />
                    Use the suggestions to boost your next version.
                  </li>
                </ul>
              </div>

              {resume.content ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">Uploaded file preview</p>
                    {resume.fileName && (
                      <Badge className="bg-white/10 text-white border-white/10">
                        {resume.fileName}
                      </Badge>
                    )}
                  </div>
                  <div className="bg-slate-900">
                    <object
                      data={resume.content}
                      type={isPdf ? "application/pdf" : undefined}
                      className="w-full h-[520px]"
                    >
                      <p className="p-4 text-slate-200 text-sm">
                        Unable to render the file preview.{" "}
                        <a href={resume.content} className="underline">
                          Download instead
                        </a>
                        .
                      </p>
                    </object>
                  </div>
                  <p className="px-4 py-3 text-xs text-slate-300/80 border-t border-white/10">
                    This preview is generated from the uploaded file. If you are uploaded a PDF or DOCX, its
                    all page shows here for quick reference.
                  </p>
                </div>
              ) : null}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div>
                  <p className="text-lg font-semibold text-fuchsia-100">Keywords to be Remove</p>
                  <p className="text-xs text-slate-300/80">
                    Remove this Keywords and sentences that are affecting to your ATS score.
                  </p>
                </div>
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {removeKeywords.length ? (
                      removeKeywords.map((word) => (
                        <Badge
                          key={word}
                          className="bg-rose-100 text-rose-800 border border-rose-200 whitespace-normal break-words"
                        >
                          {word}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-300/80">No weak phrases detected.</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div>
                  <p className="text-lg font-semibold text-fuchsia-100">Useful Keywords</p>
                  <p className="text-xs text-slate-300/80">
                    Use these role-focused and ATS friendly keywords to strengthen your Resume.
                  </p>
                </div>
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {keywords.map((word) => (
                      <Badge
                        key={word}
                        className="bg-cyan-400 text-emerald-800 border border-emerald-200 whitespace-normal break-words"
                      >
                        {word}
                      </Badge>
                    ))}
                  </div>
              </div>

            </CardContent>
          </Card>

          <ScoreSummary resume={resume} />
        </div>
      </div>
    </div>
  );
}

function buildRemoveKeywords(text) {
  // Fallback only; primary list now comes from the server action.
  return [];
}
