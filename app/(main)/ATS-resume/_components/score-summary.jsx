"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const levelMeta = {
  LOW: { color: "#f97316", label: "Needs work" },
  MEDIUM: { color: "#eab308", label: "Good start" },
  HIGH: { color: "#22c55e", label: "Strong" },
};

const toneMeta = (score) => {
  if (score >= 70) return { color: "bg-emerald-100 text-emerald-700", label: "Strong" };
  if (score >= 50) return { color: "bg-amber-100 text-amber-700", label: "Good start" };
  return { color: "bg-rose-100 text-rose-700", label: "Needs work" };
};

export default function ScoreSummary({ resume }) {
  if (!resume) return null;
  const meta = levelMeta[resume.level] || levelMeta.MEDIUM;
  const breakdown = resume.breakdown || {};

  const metrics = [
    { key: "tone", label: "Tone & Style", score: breakdown.tone?.score ?? 0, desc: breakdown.tone?.description },
    { key: "content", label: "Content", score: breakdown.content?.score ?? 0, desc: breakdown.content?.description },
    { key: "structure", label: "Structure", score: breakdown.structure?.score ?? 0, desc: breakdown.structure?.description },
    { key: "skills", label: "Skills", score: breakdown.skills?.score ?? 0, desc: breakdown.skills?.description },
  ];

  const radialData = [
    {
      name: "Overall",
      value: resume.overallScore ?? 0,
      fill: meta.color,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-500 via-cyan-100 to-cyan-300">
        <CardHeader className="border-b bg-gradient-to-r from-rose-300 via-amber-50 to-cyan-300 px-4 py-5">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-4xl font-bold text-cyan-900">
              Resume Review
            </CardTitle>

            <Badge className="bg-white text-slate-700 border border-slate-200 shadow-sm">
              {meta.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center gap-8">
          <div className="h-64 w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background fill={meta.color} />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-4xl font-bold fill-slate-800"
                >
                  {Math.round(resume.overallScore)}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-slate-800"
                >
                  ATS score / 100
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full max-w-2xl space-y-3">
            {metrics.map((m) => {
              const tag = toneMeta(m.score);
              const width = `${Math.min(100, Math.max(0, m.score))}%`;
              return (
                <div
                  key={m.key}
                  className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{m.label}</span>
                      <Badge className={`${tag.color} border-0`}>{tag.label}</Badge>
                    </div>
                    <span className="font-semibold text-slate-700">{Math.round(m.score)}/100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width, backgroundColor: meta.color }}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    {m.desc || "No description provided"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-500 via-cyan-100 to-cyan-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-bold text-cyan-900">
            ATS Score – {Math.round(resume.overallScore)}/100
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-slate-600 text-sm">
          <p className="mb-4">Your resume was scanned by ATS machine, here is some Summary points you need to change:</p>
          <ul className="space-y-2">
            {resume.feedback?.length ? (
              resume.feedback.slice(0, 4).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-lg bg-white/70 border border-emerald-100 px-3 py-2"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No suggestions were returned.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
