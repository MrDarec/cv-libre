"use client";

import { useCVStore } from "@/lib/store";
import { Experience } from "@/types/cv";
import { Plus, Trash2, Briefcase } from "lucide-react";

const inputClass =
  "w-full bg-slate-50 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 transition-all duration-200";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

const newExperience = (): Experience => ({
  id: crypto.randomUUID(),
  poste: "",
  entreprise: "",
  lieu: "",
  debut: "",
  fin: "",
  enCours: false,
  bullets: [""],
});

export default function StepExperiences() {
  const { cv, setCV } = useCVStore();

  const addExp = () =>
    setCV((c) => ({ ...c, experiences: [...c.experiences, newExperience()] }));

  const updateExp = (id: string, patch: Partial<Experience>) =>
    setCV((c) => ({
      ...c,
      experiences: c.experiences.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }));

  const removeExp = (id: string) =>
    setCV((c) => ({
      ...c,
      experiences: c.experiences.filter((e) => e.id !== id),
    }));

  const updateBullet = (expId: string, idx: number, value: string) =>
    setCV((c) => ({
      ...c,
      experiences: c.experiences.map((e) =>
        e.id === expId
          ? {
              ...e,
              bullets: e.bullets.map((b, i) => (i === idx ? value : b)),
            }
          : e
      ),
    }));

  const addBullet = (expId: string) =>
    setCV((c) => ({
      ...c,
      experiences: c.experiences.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    }));

  const removeBullet = (expId: string, idx: number) =>
    setCV((c) => ({
      ...c,
      experiences: c.experiences.map((e) =>
        e.id === expId
          ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) }
          : e
      ),
    }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Expériences professionnelles</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {"Décris tes postes précédents. Débute chaque puce par un verbe d'action et quantifie tes résultats (ex: \"Développé un script automatisé réduisant les erreurs de 20%\")."}
        </p>
      </div>

      <div className="space-y-6">
        {cv.experiences.map((exp, expIdx) => (
          <div
            key={exp.id}
            className="border border-slate-200 dark:border-zinc-800/80 bg-slate-50/20 dark:bg-zinc-900/10 rounded-2xl p-5 relative space-y-4 shadow-sm"
          >
            {/* Experience Block Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
                <Briefcase size={14} className="text-slate-400" /> Expérience #{expIdx + 1}
              </span>
              <button
                onClick={() => removeExp(exp.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all"
                title="Supprimer cette expérience"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Poste / Titre</label>
                <input
                  className={inputClass}
                  placeholder="ex: Chef de Projet"
                  value={exp.poste}
                  onChange={(e) => updateExp(exp.id, { poste: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Entreprise</label>
                <input
                  className={inputClass}
                  placeholder="ex: Google"
                  value={exp.entreprise}
                  onChange={(e) => updateExp(exp.id, { entreprise: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Lieu</label>
                <input
                  className={inputClass}
                  placeholder="ex: Paris, France (ou Distanciel)"
                  value={exp.lieu}
                  onChange={(e) => updateExp(exp.id, { lieu: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Période (Début - Fin)</label>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    placeholder="Début (AAAA-MM)"
                    value={exp.debut}
                    onChange={(e) => updateExp(exp.id, { debut: e.target.value })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Fin (AAAA-MM)"
                    disabled={exp.enCours}
                    value={exp.fin}
                    onChange={(e) => updateExp(exp.id, { fin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Current Position Checkbox */}
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer w-fit select-none">
              <input
                type="checkbox"
                className="rounded border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-indigo-600 focus:ring-slate-900 dark:focus:ring-indigo-500 h-4 w-4"
                checked={exp.enCours}
                onChange={(e) => updateExp(exp.id, { enCours: e.target.checked })}
              />
              <span>Poste actuel</span>
            </label>

            {/* Realizations / Bullet points */}
            <div className="space-y-2.5 pt-2">
              <label className={labelClass}>Réalisations clés (Une par ligne)</label>
              <div className="space-y-2">
                {exp.bullets.map((b, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-slate-300 dark:text-zinc-700 text-xs font-bold select-none">•</span>
                    <input
                      className={inputClass}
                      placeholder="Décris un résultat concret ou un projet mené..."
                      value={b}
                      onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        onClick={() => removeBullet(exp.id, i)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-zinc-800 transition-colors"
                        title="Supprimer la puce"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addBullet(exp.id)}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-600 hover:text-slate-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors pl-4"
              >
                <Plus size={13} className="stroke-[2.5px]" /> Ajouter une réalisation
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addExp}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 dark:border-zinc-800 dark:hover:border-zinc-700 text-xs font-extrabold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-all bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/20"
      >
        <Plus size={14} /> Ajouter une expérience professionnelle
      </button>
    </div>
  );
}
