"use client";

import { CVData } from "@/types/cv";
import AtsClassique from "@/components/templates/AtsClassique";
import Moderne from "@/components/templates/Moderne";
import Minimaliste from "@/components/templates/Minimaliste";
import Professionnel from "@/components/templates/Professionnel";
import Creatif from "@/components/templates/Creatif";

export default function CVPreview({ cv }: { cv: CVData }) {
  const renderTemplate = () => {
    switch (cv.templateId) {
      case "moderne":
        return <Moderne cv={cv} />;
      case "minimaliste":
        return <Minimaliste cv={cv} />;
      case "professionnel":
        return <Professionnel cv={cv} />;
      case "creatif":
        return <Creatif cv={cv} />;
      case "ats-classique":
      default:
        return <AtsClassique cv={cv} />;
    }
  };

  const fontClass = `cv-font-${cv.fontFamily || "sans"}`;
  const sizeClass = `cv-size-${cv.fontSize || "md"}`;

  return (
    <div className={`${fontClass} ${sizeClass} w-full h-full rounded overflow-hidden`}>
      {renderTemplate()}
    </div>
  );
}

