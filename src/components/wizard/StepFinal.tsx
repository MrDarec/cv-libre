"use client";

import { useState, useEffect } from "react";
import { useCVStore } from "@/lib/store";
import { scoreCV } from "@/lib/scoring";
import { cvToPlainText, downloadJsonFile, downloadTextFile } from "@/lib/export";
import { pdf } from "@react-pdf/renderer";
import CVDocument from "@/components/pdf/CVDocument";
import {
  Download,
  FileText,
  FileJson,
  Award,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Mail,
  X,
  Type
} from "lucide-react";
import { COLOR_THEMES } from "@/types/cv";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-2.5 uppercase tracking-wider";

export default function StepFinal() {
  const { cv, setCV, reset } = useCVStore();
  const { score, conseils } = scoreCV(cv);

  // Email collection modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [pendingDownload, setPendingDownload] = useState<"pdf" | "json" | "txt" | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const localEmail = localStorage.getItem("cv-libre-user-email") || "";
    setSavedEmail(localEmail);
  }, []);

  // Pre-fill email input when modal opens
  useEffect(() => {
    if (showEmailModal) {
      // Prioritize cv profile email, fallback to localStorage saved email
      setEmailInput(cv.infos.email || savedEmail || "");
      setEmailError("");
    }
  }, [showEmailModal, cv.infos.email, savedEmail]);

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

  // Validate email format
  const isValidEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim());
  };

  // Intercept downloads to enforce email requirements
  const handleExportClick = (type: "pdf" | "json" | "txt") => {
    // If we already have a saved email in localstorage/state, or in profile infos
    const activeEmail = cv.infos.email || savedEmail;

    if (activeEmail && isValidEmail(activeEmail)) {
      // Proceed directly
      executeDownload(type, activeEmail);
    } else {
      // Prompt modal
      setPendingDownload(type);
      setShowEmailModal(true);
    }
  };

  // Execute actual download file compilation/triggers
  const executeDownload = async (type: "pdf" | "json" | "txt", emailAddress: string) => {
    // Save email in storage if not already there
    localStorage.setItem("cv-libre-user-email", emailAddress);
    setSavedEmail(emailAddress);

    // If profile email is blank, we can also sync it optionally
    if (!cv.infos.email) {
      setCV(c => ({ ...c, infos: { ...c.infos, email: emailAddress } }));
    }

    const fileBaseName = `CV_${cv.infos.prenom || "cv"}_${cv.infos.nom || "libre"}`;

    if (type === "pdf") {
      setIsGeneratingPdf(true);
      try {
        const doc = <CVDocument cv={cv} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileBaseName}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Une erreur s'est produite lors de la génération du fichier PDF.");
      } finally {
        setIsGeneratingPdf(false);
        setShowEmailModal(false);
        setPendingDownload(null);
      }
    } else if (type === "json") {
      downloadJsonFile(`${fileBaseName}.json`, cv);
      setShowEmailModal(false);
      setPendingDownload(null);
    } else if (type === "txt") {
      downloadTextFile(`${fileBaseName}.txt`, cvToPlainText(cv));
      setShowEmailModal(false);
      setPendingDownload(null);
    }
  };

  // Form submit handler in email modal
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setEmailError("Veuillez saisir votre adresse e-mail.");
      return;
    }
    if (!isValidEmail(emailInput)) {
      setEmailError("Format d'e-mail invalide. Exemple: jean.dupont@gmail.com");
      return;
    }

    if (pendingDownload) {
      executeDownload(pendingDownload, emailInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Exporter ton CV</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          {"Choisis le format d'export de ton choix. Nous te conseillons d'exporter en PDF pour l'envoi aux recruteurs, et en JSON pour pouvoir le modifier plus tard."}
        </p>
      </div>

      {/* 1. Template selection option cards */}
      <div className="space-y-2.5">
        <label className={labelClass}>Modèle de rendu (5 styles)</label>
        <div className="grid grid-cols-1 gap-2">
          {/* ATS Classique */}
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "ats-classique" }))}
            className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all duration-250 ${
              cv.templateId === "ats-classique"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-750 bg-transparent"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">ATS Classique</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">Recommandé</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block leading-normal">
                Simple, sobre, sur une seule colonne. Recommandé pour maximiser la compatibilité avec les outils ATS.
              </span>
            </div>
          </button>

          {/* Moderne Bicolore */}
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "moderne" }))}
            className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all duration-250 ${
              cv.templateId === "moderne"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-750 bg-transparent"
            }`}
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Moderne Bicolore</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block leading-normal">
                Mise en page élégante sur 2 colonnes avec encart coloré latéral. Parfait pour les envois par email directs.
              </span>
            </div>
          </button>

          {/* Minimaliste épuré */}
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "minimaliste" }))}
            className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all duration-250 ${
              cv.templateId === "minimaliste"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-750 bg-transparent"
            }`}
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Minimaliste Épuré</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block leading-normal">
                Format centré à forte dominance typographique et grands espaces blancs. Idéal pour profils créatifs ou académiques.
              </span>
            </div>
          </button>

          {/* Professionnel structuré */}
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "professionnel" }))}
            className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all duration-250 ${
              cv.templateId === "professionnel"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-750 bg-transparent"
            }`}
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Professionnel Structuré</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block leading-normal">
                {"Lignes d'accents de couleur, en-tête à double colonne et blocs bien délimités. Idéal pour la finance, l'ingénierie et l'exécutif."}
              </span>
            </div>
          </button>

          {/* Créatif asymétrique */}
          <button
            onClick={() => setCV((c) => ({ ...c, templateId: "creatif" }))}
            className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all duration-250 ${
              cv.templateId === "creatif"
                ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                : "border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-750 bg-transparent"
            }`}
          >
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Créatif Asymétrique</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block leading-normal">
                {"Bandeau d'en-tête de couleur contrastante, photo asymétrique et grille moderne. Fait sensation au premier coup d'œil."}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Color Customization */}
      <div className="space-y-2.5">
        <label className={labelClass}>{"Thème de couleur"}</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_THEMES.map((theme) => {
            const isSelected = (cv.colorTheme || "default") === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setCV((c) => ({ ...c, colorTheme: theme.id }))}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all duration-150 ${
                  isSelected
                    ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                    : "border-slate-150 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-700 bg-transparent"
                }`}
                title={theme.label}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${theme.previewClass} border border-white/20 shadow-sm`} />
                <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography Adjustments (Size & Font) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Font Family Selector */}
        <div className="space-y-2.5">
          <label className={labelClass}>Police de caractères</label>
          <div className="grid grid-cols-1 gap-1.5">
            {([
              { id: "sans", label: "Sans-serif (Inter)", class: "font-sans" },
              { id: "serif", label: "Serif (Merriweather)", class: "font-serif" },
              { id: "mono", label: "Code (Fira Code)", class: "font-mono" },
              { id: "elegant", label: "Montserrat", class: "font-semibold font-sans" },
              { id: "playfair", label: "Playfair Display", class: "font-serif italic" }
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setCV((c) => ({ ...c, fontFamily: f.id }))}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 text-xs transition-all ${
                  cv.fontFamily === f.id
                    ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 font-bold shadow-sm"
                    : "border-slate-150 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-650 dark:text-zinc-350 bg-transparent"
                }`}
              >
                <span className={f.class}>{f.label}</span>
                <Type size={12} className="opacity-40" />
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Selector */}
        <div className="space-y-2.5">
          <label className={labelClass}>Taille des caractères</label>
          <div className="flex flex-col gap-1.5">
            {([
              { id: "sm", label: "Petite", desc: "Contenu dense (idéal si bcp d'exp)" },
              { id: "md", label: "Moyenne", desc: "Taille standard recommandée" },
              { id: "lg", label: "Grande", desc: "Aérée (idéal si peu d'exp)" }
            ] as const).map((sz) => (
              <button
                key={sz.id}
                onClick={() => setCV((c) => ({ ...c, fontSize: sz.id }))}
                className={`flex flex-col text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
                  cv.fontSize === sz.id
                    ? "border-slate-900 bg-slate-50/50 dark:border-indigo-500 dark:bg-indigo-950/10 shadow-sm"
                    : "border-slate-150 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-transparent"
                }`}
              >
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{sz.label}</span>
                <span className="text-[9px] text-slate-450 mt-0.5 leading-none">{sz.desc}</span>
              </button>
            ))}
          </div>
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
        
        {/* PDF Exporter Button (Intercepted) */}
        <button
          onClick={() => handleExportClick("pdf")}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 w-full justify-center px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <Download size={16} className="stroke-[2.5px]" />
          {isGeneratingPdf ? "Génération du PDF..." : "Télécharger le PDF de candidature"}
        </button>

        {/* Text Exporter */}
        <button
          onClick={() => handleExportClick("txt")}
          className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm transition-all"
        >
          <FileText size={16} />
          Copier le texte brut (formulaires ATS)
        </button>

        {/* JSON Exporter */}
        <button
          onClick={() => handleExportClick("json")}
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

      {/* Email Collection Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                if (!isGeneratingPdf) {
                  setShowEmailModal(false);
                  setPendingDownload(null);
                }
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                <Mail size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Adresse e-mail requise
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed px-4">
                  Pour finaliser le téléchargement de votre CV, veuillez renseigner votre adresse e-mail ci-dessous.
                </p>
              </div>
            </div>

            <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
              <div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="Ex: jean.dupont@gmail.com"
                  className={`w-full bg-slate-50 dark:bg-zinc-850 border rounded-xl px-3.5 py-3 text-xs text-slate-800 dark:text-zinc-150 focus:outline-none transition-colors ${
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-250 dark:border-zinc-700/80 focus:border-slate-900 dark:focus:border-indigo-500"
                  }`}
                  disabled={isGeneratingPdf}
                  autoFocus
                />
                {emailError && (
                  <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle size={10} />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setPendingDownload(null);
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-350 text-xs font-bold transition-all"
                  disabled={isGeneratingPdf}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingPdf}
                  className="flex-2 flex items-center justify-center gap-1.5 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isGeneratingPdf ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      Valider et télécharger
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
