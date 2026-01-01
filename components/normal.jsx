import { TypeOutline } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
const NormalSection = () => {
  return (
     <section className="w-full pt-36 md:pt-48 pb-10">
    <div>
      <div>
        <h1>
            Helping Students
            <br />
            To Build There Career
        </h1>
        <p>
            This is a student mentor website where you can 
            get guidance and also you can prepare for company.
        </p>
      </div>
      <div>
        <Link href="/industry-insights">
        <Button size="lg" className="px-8">
            Start today
        </Button>
        </Link>
      </div>
      <div>
        <div>
            
        </div>
      </div>
    </div>
  </section>
  );
};

export default NormalSection;
