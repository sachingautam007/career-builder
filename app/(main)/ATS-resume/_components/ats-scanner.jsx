"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { atsScanSchema } from "@/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { scanResume } from "@/actions/ats-resume";
import { toast } from "sonner";
import { Loader2, UploadCloud, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function AtsScanner() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(atsScanSchema),
    defaultValues: {
      inputMode: "PASTE",
      resumeText: "",
      title: "",
      filePreview: "",
    },
  });

  const {
    fn: scanFn,
    loading: scanning,
    data: scanned,
    setData: setScanned,
  } = useFetch(scanResume);

  useEffect(() => {
    if (scanned) {
      toast.success("Resume scanned");
      // Redirect to the dedicated resume page, like cover-letter flow.
      router.push(`/ATS-resume/${scanned.id}`);
      setScanned(undefined);
    }
  }, [scanned, router, setScanned]);

  const onSubmit = async (values) => {
    try {
      await scanFn({
        title: values.title || undefined,
        rawText: values.resumeText,
        sourceType: "UPLOAD",
        fileName: values.fileMeta?.fileName,
        wordCount: values.fileMeta?.wordCount,
        filePreview: values.filePreview,
      });
    } catch (err) {
      // useFetch already toasts
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File too large (max 10MB)");
      return;
    }

    const extension = file.name.toLowerCase().split(".").pop();
    const previewUrl =
      file.type === "application/pdf" ? await fileToDataUrl(file) : undefined;

    try {
      if (extension === "txt") {
        const text = await file.text();
        await applyExtractedText(text, file, previewUrl);
      } else if (extension === "pdf") {
        const text = await extractPdf(file);
        await applyExtractedText(text, file, previewUrl);
      } else if (extension === "docx") {
        const text = await extractDocx(file);
        await applyExtractedText(text, file, previewUrl);
      } else {
        toast.error("Unsupported file type. Use pdf, docx, or txt.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to read file");
    }
  };

  const applyExtractedText = async (text, file, previewUrl) => {
    if (!text || text.trim().length < 50) {
      toast.error("No readable text found. This PDF looks like an image; OCR may have failed.");
      return;
    }
    setValue("inputMode", "UPLOAD");
    setValue("resumeText", text);
    setValue("fileMeta", {
      fileName: file.name,
      wordCount: text.split(/\s+/).filter(Boolean).length,
    });
    if (previewUrl) {
      setValue("filePreview", previewUrl);
    }
    toast.success("File is Uploaded!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl text-bold text-cyan-300">Scan your resume</CardTitle>
        <CardDescription>
          Paste text or upload a pdf/docx/txt file. We'll score and save it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("inputMode")} />
          <div className="space-y-2 text-lg">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept=".pdf,.docx,.txt"
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload file
              </Button>
            </div>
            <Label htmlFor="resumeText" className="text-2xl text-bold text-cyan-300 mt-2">Preview / Edit</Label>
            <Textarea
              id="resumeText"
              className="min-h-[220px]"
              placeholder="Your extracted text will appear here..."
              {...register("resumeText")}
            />
            {errors.resumeText && (
              <p className="text-sm text-red-500">
                {errors.resumeText.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={scanning}>
              {scanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Scan Resume
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

async function extractPdf(file) {
  // 1) Try text layer
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const maxPages = Math.min(pdf.numPages, 30);
  let text = "";
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  if (text.trim().length >= 50) return text;

  // 2) OCR fallback for image-only PDFs (first 3 pages)
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  let ocrText = "";
  const ocrPages = Math.min(pdf.numPages, 3);

  for (let i = 1; i <= ocrPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const {
      data: { text: pageText },
    } = await worker.recognize(canvas);
    ocrText += pageText + "\n";
  }

  await worker.terminate();
  return ocrText;
}

async function fileToDataUrl(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = btoa(binary);
  return `data:${file.type || "application/octet-stream"};base64,${base64}`;
}

async function extractDocx(file) {
  const mammothModule = await import("mammoth");
  const extractRawText =
    mammothModule.extractRawText || mammothModule.default?.extractRawText;
  if (!extractRawText) {
    throw new Error("DOCX parser not available");
  }
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await extractRawText({ arrayBuffer });
  return value;
}
