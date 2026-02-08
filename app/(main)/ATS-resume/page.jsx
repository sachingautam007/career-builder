export const revalidate = 0;
export const dynamic = "force-dynamic";

import { getResumes } from "@/actions/ats-resume";
import AtsScanner from "./_components/ats-scanner";
import HistoryList from "./_components/history-list";

export default async function ATSresume() {
  const resumes = await getResumes();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-5xl md:text-6xl font-bold gradient-ti">
          Smart ATS Resume Scanner
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload or paste your resume, to get instant ATS scoring and actionable feedback.
        </p>
      </div>

      <AtsScanner />

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-cyan-300">History</h2>
        <HistoryList resumes={resumes} />
      </div>
    </div>
  );
}
