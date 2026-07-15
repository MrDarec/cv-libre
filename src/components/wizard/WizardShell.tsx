"use client";

import { useCVStore } from "@/lib/store";
import StepNorme from "./StepNorme";
import StepInfos from "./StepInfos";
import StepExperiences from "./StepExperiences";
import StepFormations from "./StepFormations";
import StepCompetencesLangues from "./StepCompetencesLangues";
import StepFinal from "./StepFinal";
import { Sliders, User, Briefcase, GraduationCap, Wrench, FileCheck, ChevronLeft, ChevronRight, Check } from "lucide-react";

const STEPS = [
  { label: "Norme", component: StepNorme, icon: Sliders },
  { label: "Infos", component: StepInfos, icon: User },
  { label: "Expérience", component: StepExperiences, icon: Briefcase },
  { label: "Formation", component: StepFormations, icon: GraduationCap },
  { label: "Compétences", component: StepCompetencesLangues, icon: Wrench },
  { label: "Finaliser", component: StepFinal, icon: FileCheck },
];

export default function WizardShell() {
  const { step, setStep } = useCVStore();
  const Current = STEPS[step].component;

  return (
    <div className="space-y-6">
      {/* Sleek Steps Stepper Nav */}
      <nav className="relative w-full border-b border-slate-100 dark:border-zinc-800/80 pb-5 overflow-x-auto no-scrollbar scroll-smooth">
        <ol className="flex items-center gap-2 md:gap-3 min-w-max">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;
            
            return (
              <li key={s.label}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-indigo-600 dark:border-indigo-600 dark:text-white dark:shadow-indigo-500/10"
                      : isCompleted
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800/60 dark:text-emerald-400"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-zinc-800/40 dark:border-zinc-700/60 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <span className={`flex items-center justify-center rounded-lg p-0.5 ${
                    isActive 
                      ? "text-white" 
                      : isCompleted 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-slate-400 dark:text-zinc-500"
                  }`}>
                    {isCompleted ? <Check size={14} className="stroke-[3px]" /> : <Icon size={14} />}
                  </span>
                  <span>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Form Content Wrapper */}
      <div className="min-h-[380px] py-2">
        <Current />
      </div>

      {/* Stepper Navigation Buttons */}
      <div className="flex justify-between items-center pt-5 border-t border-slate-100 dark:border-zinc-800/80">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-all duration-150"
        >
          <ChevronLeft size={15} /> Précédent
        </button>
        <button
          onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
          disabled={step === STEPS.length - 1}
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 disabled:hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:disabled:hover:bg-indigo-600 shadow-sm transition-all duration-150"
        >
          Suivant <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
