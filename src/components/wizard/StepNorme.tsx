"use client";

import { useCVStore } from "@/lib/store";
import { Norme } from "@/types/cv";
import { Globe, MapPin, Milestone, CheckCircle2, LucideIcon } from "lucide-react";

const NORMES: { id: Norme; label: string; desc: string; icon: LucideIcon }[] = [
  {
    id: "france",
    label: "France / Europe",
    desc: "Format standard européen. Photo facultative, informations personnelles claires et sections classiques.",
    icon: MapPin,
  },
  {
    id: "international",
    label: "International US/UK",
    desc: "Format strict sans photo, âge ou informations personnelles sensibles pour respecter les critères anti-discrimination.",
    icon: Globe,
  },
  {
    id: "afrique-ouest",
    label: "Afrique de l'Ouest",
    desc: "Format courant pour l'espace UEMOA (Sénégal, Côte d'Ivoire, etc.) acceptant les informations d'état civil standard.",
    icon: Milestone,
  },
];

export default function StepNorme() {
  const { cv, setCV } = useCVStore();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Norme de CV</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {"Chaque marché de l'emploi a ses exigences (coordonnées, photo, format). Sélectionne la norme adaptée pour maximiser tes chances."}
        </p>
      </div>

      <div className="space-y-3">
        {NORMES.map((n) => {
          const Icon = n.icon;
          const isSelected = cv.norme === n.id;
          
          return (
            <label
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 ${
                isSelected
                  ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                  : "border-slate-100 dark:border-zinc-800 bg-transparent"
              }`}
            >
              <input
                type="radio"
                name="norme"
                className="sr-only"
                checked={isSelected}
                onChange={() =>
                  setCV((c) => ({
                    ...c,
                    norme: n.id,
                    infos: {
                      ...c.infos,
                      inclurePhoto: n.id === "france" || n.id === "afrique-ouest",
                    },
                  }))
                }
              />
              <div className={`p-2.5 rounded-xl transition-colors ${
                isSelected 
                  ? "bg-slate-900 text-white dark:bg-indigo-600" 
                  : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                    {n.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-slate-900 dark:text-indigo-400 fill-slate-900/10 dark:fill-indigo-400/10" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                  {n.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
