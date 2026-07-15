"use client";

import { useCVStore } from "@/lib/store";
import { scoreCV } from "@/lib/scoring";
import { cvToPlainText, downloadJsonFile, downloadTextFile } from "@/lib/export";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CVDocument from "@/components/pdf/CVDocument";
import { Download, FileText, FileJson, Award, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { COLOR_THEMES } from "@/types/cv";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-2.5 uppercase tracking-wider";

export default function StepFinal() {
  const { cv, setCV, reset } = useCVStore();
  const { score, conseils } = scoreCV(cv);

  // Dynamic colors based on score
  const getScoreColor = () => {
    if (score < 50) return {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-900/40",
      text: "text-red-700 dark:text-red-400",
      progress: "bg-red-500",
    };
    if (score < 85) return {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-900/40",
      text: "text-amber-700 dark:text-amber-400",
      progress: "bg-amber-500",
    };
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-900/40",
      text: "text-emerald-700 dark:text-emerald-400",
      progress: "bg-emerald-500",
    };
  };

  const colors = getScoreColor();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Exporter ton CV</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {"Choisis le format d'export de ton choix. Nous te conseillons d'exporter en PDF pour l'envoi aux recruteurs, et en JSON pour pouvoir le modifier plus tard."}
        </p>
      </div>

      {/* Template selection option cards */}
      <div className="space-y-2.5">
        <label className={labelClass}>Modèle de rendu</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "ats-classique" }))}
            className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              cv.templateId === "ats-classique"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 bg-transparent"
            }`}
          >
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">ATS Classique</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
              Simple, sobre, sur une seule colonne. Recommandé pour maximiser la compatibilité avec les outils ATS.
            </span>
          </button>

          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "moderne" }))}
            className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              cv.templateId === "moderne"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 bg-transparent"
            }`}
          >
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">Moderne bicolore</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
              Mise en page élégante sur 2 colonnes avec encart coloré. Parfait pour les envois par email directs.
            </span>
          </button>
        </div>
      </div>

      {/* Color Customization */}
      <div className="space-y-2.5">
        <label className={labelClass}>{"Thème de couleur"}</label>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_THEMES.map((theme) => {
            const isSelected = (cv.colorTheme || "default") === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setCV((c) => ({ ...c, colorTheme: theme.id }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                    : "border-slate-150 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-700 bg-transparent"
                }`}
                title={theme.label}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${theme.previewClass} border border-white/20 shadow-sm`} />
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CV scoring module */}
      <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bg} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className={colors.text} />
            <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">
              Qualité du CV : {score}/100
            </span>
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${colors.border} ${colors.text} bg-white dark:bg-zinc-900`}>
            {score < 50 ? "À améliorer" : score < 85 ? "Très bon" : "Excellent"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.progress}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Advice lists */}
        {conseils.length > 0 ? (
          <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-zinc-800/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {"Conseils d'optimisation"}
            </p>
            <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1.5 list-none">
              {conseils.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-250/20">
            <CheckCircle size={14} className="fill-emerald-500/10" />
            <span>Félicitations, ton CV respecte toutes les règles ATS recommandées !</span>
          </p>
        )}
      </div>

      {/* Export buttons */}
      <div className="space-y-2.5 pt-2">
        <label className={labelClass}>{"Format d'exportation"}</label>
        
        {/* PDF Exporter */}
        <PDFDownloadLink
          document={<CVDocument cv={cv} />}
          fileName={`CV_${cv.infos.prenom || "cv"}_${cv.infos.nom || "libre"}.pdf`}
          className="flex items-center gap-2 w-full justify-center px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
        >
          {({ loading }) => (
            <>
              <Download size={16} className="stroke-[2.5px]" />
              {loading ? "Génération du PDF..." : "Télécharger le PDF de candidature"}
            </>
          )}
        </PDFDownloadLink>

        {/* Text Exporter */}
        <button
          onClick={() =>
            downloadTextFile(
              `CV_${cv.infos.prenom || "cv"}_${cv.infos.nom || "libre"}.txt`,
              cvToPlainText(cv)
            )
          }
          className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm transition-all"
        >
          <FileText size={16} />
          Copier le texte brut (formulaires ATS)
        </button>

        {/* JSON Exporter */}
        <button
          onClick={() =>
            downloadJsonFile(
              `CV_${cv.infos.prenom || "cv"}_${cv.infos.nom || "libre"}.json`,
              cv
            )
          }
          className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm transition-all"
        >
          <FileJson size={16} />
          Télécharger la sauvegarde (Fichier JSON)
        </button>
      </div>

      {/* Reset workspace button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => {
            if (confirm("Voulez-vous vraiment réinitialiser tout le CV ? Cette action effacera vos données locales.")) reset();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          <RefreshCw size={13} /> Recommencer à zéro
        </button>
      </div>
    </div>
  );
}
