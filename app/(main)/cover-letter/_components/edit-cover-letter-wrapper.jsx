"use client";

import CoverLetterPreview from "./cover-letter-preview";
import { updateCoverLetter } from "@/actions/cover-letter";

export default function EditCoverLetterWrapper({ content, id }) {
  const handleSave = async (text) => {
    await updateCoverLetter(id, text);
  };

  return <CoverLetterPreview content={content} onSave={handleSave} />;
}
