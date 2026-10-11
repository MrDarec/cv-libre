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
    <div className={`${fontClass} ${sizeClass} w-full min-h-full rounded relative`}>
      {/* Visual A4 Page Break Guide Lines */}
      <div className="absolute top-[297mm] left-0 right-0 pointer-events-none flex items-center justify-end pr-3 z-30">
        <div className="w-full border-b-2 border-dashed border-indigo-400/40" />
        <span className="ml-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white/95 dark:bg-zinc-900/95 px-2 py-0.5 rounded shadow border border-indigo-200/80 dark:border-indigo-800/80 whitespace-nowrap">
          Fin Page 1 · Début Page 2 (A4)
        </span>
      </div>
      <div className="absolute top-[594mm] left-0 right-0 pointer-events-none flex items-center justify-end pr-3 z-30">
        <div className="w-full border-b-2 border-dashed border-indigo-400/40" />
        <span className="ml-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white/95 dark:bg-zinc-900/95 px-2 py-0.5 rounded shadow border border-indigo-200/80 dark:border-indigo-800/80 whitespace-nowrap">
          Fin Page 2 · Début Page 3 (A4)
        </span>
      </div>

      {renderTemplate()}
    </div>
  );
}
