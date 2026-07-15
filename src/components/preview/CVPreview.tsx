"use client";

import { CVData } from "@/types/cv";
import AtsClassique from "@/components/templates/AtsClassique";
import Moderne from "@/components/templates/Moderne";

export default function CVPreview({ cv }: { cv: CVData }) {
  if (cv.templateId === "moderne") return <Moderne cv={cv} />;
  return <AtsClassique cv={cv} />;
}
