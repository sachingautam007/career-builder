"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

const CoverLetterPreview = ({ content, onSave }) => {
  const [value, setValue] = useState(content);
  const router = useRouter();

  const handleSave = async () => {
    try {
      if (!onSave) return;

      await onSave(value);
      toast.success("Cover letter saved");
      router.push("/cover-letter");
    } catch (err) {
      toast.error("Failed to save cover letter");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="py-4 space-y-4">
      <MDEditor
        value={value}
        onChange={setValue}
        height={700}
      />

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
