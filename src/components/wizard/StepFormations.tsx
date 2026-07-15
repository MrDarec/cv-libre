"use client";

import { useCVStore } from "@/lib/store";
import { Formation } from "@/types/cv";
import { Plus, Trash2, GraduationCap } from "lucide-react";

const inputClass =
  "w-full bg-slate-50 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 transition-all duration-200";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

const newFormation = (): Formation => ({
  id: crypto.randomUUID(),
  diplome: "",
  etablissement: "",
  lieu: "",
  annee: "",
});

export default function StepFormations() {
  const { cv, setCV } = useCVStore();

  const addFormation = () =>
    setCV((c) => ({ ...c, formations: [...c.formations, newFormation()] }));

  const updateFormation = (id: string, patch: Partial<Formation>) =>
    setCV((c) => ({
      ...c,
      formations: c.formations.map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    }));

  const removeFormation = (id: string) =>
    setCV((c) => ({
      ...c,
      formations: c.formations.filter((f) => f.id !== id),
    }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Formations & Diplômes</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Renseigne ton parcours académique, tes certifications ou diplômes obtenus.
        </p>
      </div>

      <div className="space-y-6">
        {cv.formations.map((f, fIdx) => (
          <div
            key={f.id}
            className="border border-slate-200 dark:border-zinc-800/80 bg-slate-50/20 dark:bg-zinc-900/10 rounded-2xl p-5 relative space-y-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                <GraduationCap size={15} className="text-slate-400" /> Formation #{fIdx + 1}
              </span>
              <button
                onClick={() => removeFormation(f.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all"
                title="Supprimer cette formation"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Diplôme / Certification</label>
                <input
                  className={inputClass}
                  placeholder="ex: Master en Informatique"
                  value={f.diplome}
                  onChange={(e) =>
                    updateFormation(f.id, { diplome: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Établissement</label>
                <input
                  className={inputClass}
                  placeholder="ex: Université de Paris"
                  value={f.etablissement}
                  onChange={(e) =>
                    updateFormation(f.id, { etablissement: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Lieu</label>
                <input
                  className={inputClass}
                  placeholder="ex: Paris, France"
                  value={f.lieu}
                  onChange={(e) =>
                    updateFormation(f.id, { lieu: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>{"Année d'obtention"}</label>
                <input
                  className={inputClass}
                  placeholder="ex: 2022"
                  value={f.annee}
                  onChange={(e) =>
                    updateFormation(f.id, { annee: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addFormation}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 dark:border-zinc-800 dark:hover:border-zinc-700 text-xs font-extrabold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/20"
      >
        <Plus size={14} /> Ajouter une formation
      </button>
    </div>
  );
}
