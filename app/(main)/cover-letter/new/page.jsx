import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Application Letters
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="text-6xl font-bold gradient-title">Create Application Letters</h1>
          <p className="text-muted-foreground">
            Generate industry specific application letter for your job application
          </p>
        </div>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}