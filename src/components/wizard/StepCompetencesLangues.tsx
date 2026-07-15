"use client";

import { useCVStore } from "@/lib/store";
import { Langue, NiveauLangue } from "@/types/cv";
import { Plus, Trash2, X, Sparkles, Languages } from "lucide-react";

const inputClass =
  "w-full bg-slate-50 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 transition-all duration-200";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

const NIVEAUX: NiveauLangue[] = [
  "notions",
  "intermediaire",
  "courant",
  "bilingue",
  "natif",
];

const NIVEAU_LABELS: Record<NiveauLangue, string> = {
  notions: "Notions / Débutant",
  intermediaire: "Intermédiaire",
  courant: "Courant / Professionnel",
  bilingue: "Bilingue",
  natif: "Langue maternelle",
};

export default function StepCompetencesLangues() {
  const { cv, setCV } = useCVStore();

  const addCompetence = (nom: string) => {
    if (!nom.trim()) return;
    // Eviter les doublons
    if (cv.competences.some((c) => c.nom.toLowerCase() === nom.trim().toLowerCase())) return;
    setCV((c) => ({
      ...c,
      competences: [...c.competences, { id: crypto.randomUUID(), nom: nom.trim() }],
    }));
  };

  const removeCompetence = (id: string) =>
    setCV((c) => ({
      ...c,
      competences: c.competences.filter((comp) => comp.id !== id),
    }));

  const addLangue = () =>
    setCV((c) => ({
      ...c,
      langues: [
        ...c.langues,
        { id: crypto.randomUUID(), nom: "", niveau: "courant" } as Langue,
      ],
    }));

  const updateLangue = (id: string, patch: Partial<Langue>) =>
    setCV((c) => ({
      ...c,
      langues: c.langues.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const removeLangue = (id: string) =>
    setCV((c) => ({
      ...c,
      langues: c.langues.filter((l) => l.id !== id),
    }));

  return (
    <div className="space-y-6">
      {/* Competences */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles size={18} className="text-indigo-500" /> Compétences clés
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Ajoute tes compétences techniques, méthodologiques ou comportementales (Hard & Soft Skills).
          </p>
        </div>

        <div className="space-y-3">
          <label className={labelClass}>Ajouter une compétence (Appuie sur Entrée)</label>
          <input
            className={inputClass}
            placeholder="ex: Next.js, Gestion de projet, Figma, Agile..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const target = e.target as HTMLInputElement;
                addCompetence(target.value);
                target.value = "";
              }
            }}
          />
          
          {cv.competences.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/80 rounded-2xl min-h-[50px] items-center">
              {cv.competences.map((c) => (
                <span
                  key={c.id}
                  onClick={() => removeCompetence(c.id)}
                  className="group flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 pl-3 pr-2 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/50"
                  title="Supprimer cette compétence"
                >
                  {c.nom}
                  <X size={13} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-zinc-850" />

      {/* Langues */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Languages size={18} className="text-indigo-500" /> Langues parlées
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Indique les langues que tu maîtrises ainsi que ton niveau de compétence.
          </p>
        </div>

        <div className="space-y-3">
          {cv.langues.map((l) => (
            <div key={l.id} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50/20 dark:bg-zinc-900/10 border border-slate-100 dark:border-zinc-800/80 p-3 rounded-2xl shadow-sm w-full">
              <div className="flex-1 w-full">
                <input
                  className={inputClass}
                  placeholder="Langue (ex: Anglais)"
                  value={l.nom}
                  onChange={(e) =>
                    updateLangue(l.id, { nom: e.target.value })
                  }
                />
              </div>
              <div className="flex-1 w-full">
                <select
                  className={`${inputClass} appearance-none cursor-pointer`}
                  value={l.niveau}
                  onChange={(e) =>
                    updateLangue(l.id, {
                      niveau: e.target.value as NiveauLangue,
                    })
                  }
                >
                  {NIVEAUX.map((n) => (
                    <option key={n} value={n} className="dark:bg-zinc-900 text-slate-900 dark:text-white">
                      {NIVEAU_LABELS[n]}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => removeLangue(l.id)}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all w-full sm:w-auto flex justify-center items-center"
                title="Supprimer cette langue"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addLangue}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 dark:border-zinc-800 dark:hover:border-zinc-700 text-xs font-extrabold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/20"
        >
          <Plus size={14} /> Ajouter une langue
        </button>
      </div>
    </div>
  );
}
