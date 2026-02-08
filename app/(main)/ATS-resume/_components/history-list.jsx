"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { deleteResume } from "@/actions/ats-resume";
import { toast } from "sonner";

const levelColor = {
  LOW: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-emerald-100 text-emerald-700",
};

export default function HistoryList({ resumes }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      toast.success("Deleted");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  if (!resumes?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No scans yet</CardTitle>
          <CardDescription>Scan a resume to see it appear here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <Card key={resume.id} className="group relative">
          <CardHeader className="flex flex-row justify-between items-start space-y-0">
            <div>
              <CardTitle className="text-xl gradient-sac">
                {resume.title || resume.fileName || "Untitled resume"}
              </CardTitle>
              <CardDescription className="space-x-2">
                <span>{format(new Date(resume.createdAt), "PPP")}</span>
                <Badge variant="secondary">{resume.sourceType}</Badge>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={levelColor[resume.level] || ""}>
                {resume.level}
              </Badge>
              <span className="font-semibold">{Math.round(resume.overallScore)}</span>
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/ATS-resume/${resume.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(resume.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
