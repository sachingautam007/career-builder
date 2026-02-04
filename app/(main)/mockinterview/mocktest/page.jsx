import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Quiz from "../_components/quiz";

const MockTest = () => {
  return (
    <div className="container mx-auto space-y-4 py-4">
      <Link href="/mockinterview">
        <Button variant="link" className="gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" />
          Back to Mock Interviews
        </Button>
      </Link>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-6xl font-bold gradient-ti">
            Mock Interviews
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-1 mb-4">
          Prepare for your technical interviews with personalized mock tests.
        </p>
        {/* Mock test content goes here */}
      </div>
      <Quiz />

    </div>
  );
};
export default MockTest;