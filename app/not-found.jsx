import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grid-background">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <p className="text-xl mb-8 text-gray-600">Page Not Found Due to wrong routing</p>
      <Link href="/">
        <Button className="hover:bg-purple-400">Back to Home</Button>
      </Link>
    </div>
  );
}