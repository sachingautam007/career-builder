import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import EditCoverLetterWrapper from "../_components/edit-cover-letter-wrapper";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Application Letters
          </Button>
        </Link>

        <h1 className="text-6xl font-bold gradient-title mb-6">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>

      <EditCoverLetterWrapper content={coverLetter?.content} id={id} />
    </div>
  );
}