"use client";

import { useEffect, useState } from "react";
import { useCVStore } from "@/lib/store";
import WizardShell from "@/components/wizard/WizardShell";
import CVPreview from "@/components/preview/CVPreview";
import { Sun, Moon, Eye, LayoutTemplate, Upload, RotateCcw, X, FileText, ShieldAlert } from "lucide-react";

// List of common skills for the matching thesaurus regex parser
const COMMON_SKILLS = [
  "javascript", "typescript", "react", "next.js", "vue", "angular", "node.js", "express",
  "python", "django", "flask", "fastapi", "java", "spring", "c++", "c#", "dotnet",
  "php", "laravel", "symfony", "ruby", "rails", "go", "rust", "sql", "postgresql",
  "mongodb", "mysql", "redis", "docker", "kubernetes", "aws", "gcp", "azure",
  "html", "css", "tailwind", "sass", "git", "github", "gitlab", "ci/cd", "agile",
  "scrum", "kanban", "management", "leadership", "marketing", "seo", "figma",
  "design", "photoshop", "illustrator", "excel", "word", "powerpoint", "sales",
  "communication", "english", "french", "spanish", "german", "devops", "cloud",
  "linux", "windows", "macos", "cybersecurity", "security", "network", "testing",
  "jest", "cypress", "selenium", "machine learning", "deep learning", "data science"
];

// Heuristic client-side parser to extract structured CV data from raw text (e.g. copied from PDF/Word)
const parseRawResumeText = (text: string) => {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  // 1. Email extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  const email = emails[0] || "";

  // 2. Phone extraction (matches common international and local patterns)
  const phoneFullRegex = /(?:\+?(\d{1,3}))?[\s-]?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{2,4}/g;
  const phones = text.match(phoneFullRegex) || [];
  const validPhones = phones.map(p => p.trim()).filter(p => p.replace(/\D/g, "").length >= 8);
  const telephone = validPhones[0] || "";

  // 3. Name extraction (heuristic: usually the first lines)
  let prenom = "";
  let nom = "";
  if (lines.length > 0) {
    const nameLine = lines[0];
    const words = nameLine.split(/\s+/).filter(w => /^[a-zA-ZÀ-ÿ]+$/.test(w));
    if (words.length >= 1) {
      prenom = words[0];
    }
    if (words.length >= 2) {
      nom = words.slice(1).join(" ");
    }
  }

  // 4. Social links (LinkedIn, GitHub, Portfolio)
  let linkedin = "";
  let github = "";
  let portfolio = "";

  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
  const urlRegex = /(?:https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;

  const linkedinMatch = text.match(linkedinRegex);
  if (linkedinMatch) linkedin = linkedinMatch[0];

  const githubMatch = text.match(githubRegex);
  if (githubMatch) github = githubMatch[0];

  const allUrls = text.match(urlRegex) || [];
  const portfolioUrl = allUrls.find(url => 
    !url.includes("@") && 
    !url.toLowerCase().includes("linkedin.com") && 
    !url.toLowerCase().includes("github.com") && 
    !url.toLowerCase().includes("gstatic") && 
    !url.toLowerCase().includes("fonts.googleapis")
  );
  if (portfolioUrl) portfolio = portfolioUrl;

  // 5. Skills extraction
  const lowerText = text.toLowerCase();
  const detectedSkills: string[] = [];
  COMMON_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerText) && !detectedSkills.includes(skill)) {
      const capitalized = skill.charAt(0).toUpperCase() + skill.slice(1);
      detectedSkills.push(capitalized);
    }
  });

  return {
    prenom,
    nom,
    email,
    telephone,
    linkedin,
    github,
    portfolio,
    skills: detectedSkills.slice(0, 8), // limit to top 8 key skills
  };
};

export default function Home() {
  const { cv, setCV, reset } = useCVStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  
  // Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importActiveTab, setImportActiveTab] = useState<"file" | "text" | "reset">("file");
  const [pasteText, setPasteText] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = saved || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const switchTemplate = (templateId: "ats-classique" | "moderne") => {
    setCV((c) => ({ ...c, templateId }));
  };

  // Unified File Import Handler (.json save file, .pdf, or .docx)
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === "json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === "object" && "infos" in parsed && "norme" in parsed) {
            setCV(() => parsed);
            useCVStore.setState({ step: 0 });
            setShowImportModal(false);
            alert("Sauvegarde chargée avec succès !");
          } else {
            alert("Le fichier de sauvegarde JSON est invalide ou corrompu.");
          }
        } catch {
          alert("Erreur lors de la lecture du fichier JSON.");
        }
      };
      reader.readAsText(file);
    } else if (fileType === "pdf") {
      try {
        // Dynamically import pdfjs-dist on client-side to prevent SSR issues
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => {
              const textItem = item as { str?: string };
              return textItem.str || "";
            })
            .join(" ");
          extractedText += pageText + "\n";
        }

        if (extractedText.trim()) {
          setPasteText(extractedText);
          setImportActiveTab("text"); // switch tab to text area review
          alert("Texte extrait du PDF avec succès ! Vous pouvez à présent le relire et lancer l'analyse.");
        } else {
          alert("Aucun texte n'a pu être extrait de ce PDF (il s'agit peut-être d'un scan ou d'une image).");
        }
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la lecture du fichier PDF. Veuillez copier-coller le texte à la place.");
      }
    } else if (fileType === "docx") {
      try {
        // Dynamically import mammoth on client-side
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const extractedText = result.value;

        if (extractedText.trim()) {
          setPasteText(extractedText);
          setImportActiveTab("text"); // switch tab to text area review
          alert("Texte extrait du fichier Word avec succès ! Vous pouvez à présent le relire et lancer l'analyse.");
        } else {
          alert("Aucun texte n'a pu être extrait de ce fichier Word.");
        }
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la lecture du fichier Word. Veuillez copier-coller le texte à la place.");
      }
    } else {
      alert("Format de fichier non pris en charge (utilisez .json, .pdf ou .docx).");
    }
  };

  // Import raw text (from PDF / Word)
  const handleImportRawText = () => {
    if (!pasteText.trim()) {
      alert("Veuillez coller le texte de votre ancien CV.");
      return;
    }
    const result = parseRawResumeText(pasteText);
    
    // Fill values into CV Store
    setCV((c) => ({
      ...c,
      infos: {
        ...c.infos,
        prenom: result.prenom || c.infos.prenom,
        nom: result.nom || c.infos.nom,
        email: result.email || c.infos.email,
        telephone: result.telephone || c.infos.telephone,
        linkedin: result.linkedin || c.infos.linkedin,
        github: result.github || c.infos.github,
        portfolio: result.portfolio || c.infos.portfolio,
      },
      competences: [
        ...c.competences,
        ...result.skills
          .filter(skill => !c.competences.some(existing => existing.nom.toLowerCase() === skill.toLowerCase()))
          .map(skill => ({ id: crypto.randomUUID(), nom: skill }))
      ]
    }));

    useCVStore.setState({ step: 0 });
    setShowImportModal(false);
    setPasteText("");
    alert(`Importation réussie : Coordonnées extraites et ${result.skills.length} compétences détectées !`);
  };

  // Reset to default
  const handleResetCV = () => {
    reset();
    setShowImportModal(false);
    alert("Données effacées. Nouveau CV démarré !");
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 transition-colors duration-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/80 px-6 py-4 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            CV
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 dark:from-white dark:via-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              CV Libre
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 font-medium">
              {"Par Éditions Cypher — gratuit, open-source & conforme aux normes ATS"}
            </p>
          </div>
        </div>

        {mounted && (
          <div className="flex items-center gap-2">
            {/* Import / Reset trigger button */}
            <button
              onClick={() => {
                setImportActiveTab("file");
                setShowImportModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-250 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700/80 text-xs font-bold text-slate-700 dark:text-zinc-300 transition-all shadow-sm shadow-slate-100/50 dark:shadow-none hover:scale-105"
            >
              <Upload size={13} className="stroke-[2.5px]" />
              <span>{"Importer / Reset"}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-300 transition-all shadow-sm hover:scale-105"
              aria-label="Changer de thème"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        )}
      </header>

      {/* Main Split Screen Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[calc(100vh-73px)]">
        {/* Left Section: Stepper & Wizard Forms */}
        <section className="xl:col-span-5 p-4 sm:p-6 lg:p-8 xl:max-h-[calc(100vh-73px)] xl:overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/40 transition-colors duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl p-5 sm:p-6 lg:p-8 transition-colors duration-200">
            <WizardShell />
          </div>
        </section>

        {/* Right Section: Interactive Preview Panel */}
        <section className="xl:col-span-7 bg-slate-100 dark:bg-zinc-900/40 p-4 sm:p-6 lg:p-8 flex flex-col xl:max-h-[calc(100vh-73px)] xl:overflow-y-auto border-t xl:border-t-0 xl:border-l border-slate-200 dark:border-zinc-800 transition-colors duration-200">
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Eye size={13} className="text-slate-400 dark:text-zinc-500" /> {"Prévisualisation en direct"}
              </span>
            </div>

            {/* Quick Template Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => switchTemplate("ats-classique")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  cv.templateId === "ats-classique"
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <LayoutTemplate size={12} /> {"ATS Classique"}
              </button>
              <button
                onClick={() => switchTemplate("moderne")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  cv.templateId === "moderne"
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <LayoutTemplate size={12} /> {"Moderne"}
              </button>
            </div>
          </div>

          {/* CV A4 Sheet Canvas Area */}
          <div className="flex-1 flex justify-center items-start overflow-x-auto py-2 xl:py-4">
            <div className="w-[210mm] h-[297mm] origin-top scale-[0.45] xs:scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.85] xl:scale-[0.6] 2xl:scale-[0.72] shadow-xl dark:shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-zinc-800 rounded bg-white transition-all duration-300">
              <CVPreview cv={cv} />
            </div>
          </div>
        </section>
      </div>

      {/* Import / Reset Dialog Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              {"Configurer l'espace de travail"}
            </h3>

            {/* Tab switch navigation */}
            <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl mb-5">
              <button
                onClick={() => setImportActiveTab("file")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  importActiveTab === "file"
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                {"Fichier (JSON, PDF, Word)"}
              </button>
              <button
                onClick={() => setImportActiveTab("text")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  importActiveTab === "text"
                    ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                {"Copier-coller manuel"}
              </button>
              <button
                onClick={() => setImportActiveTab("reset")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  importActiveTab === "reset"
                    ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-red-500"
                }`}
              >
                {"Recommencer à zéro"}
              </button>
            </div>

            {/* Content Tabs */}
            <div className="space-y-4 min-h-[180px] flex flex-col justify-between">
              {importActiveTab === "file" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                    {"Importe une sauvegarde (.json) pour restaurer ton CV, ou charge directement ton ancien CV au format PDF (.pdf) ou Word (.docx) pour en extraire automatiquement le texte et les coordonnées."}
                  </p>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-750 bg-slate-50/30 hover:bg-slate-50/50 dark:bg-zinc-900/10 p-6 rounded-2xl text-center cursor-pointer transition-all duration-150 relative">
                    <Upload size={18} className="text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{"Sélectionner un fichier (.json, .pdf, .docx)"}</span>
                    <input
                      type="file"
                      accept=".json,.pdf,.docx"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {importActiveTab === "text" && (
                <div className="space-y-3 flex-1 flex flex-col">
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                    {"Relis et valide le texte ci-dessous (extrait du fichier ou collé manuellement). Clique sur le bouton pour extraire automatiquement les informations de contact et de compétences."}
                  </p>
                  <textarea
                    rows={6}
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Colle ou dépose ton CV texte ici..."
                    className="w-full flex-1 bg-slate-50 dark:bg-zinc-800/30 border border-slate-250 dark:border-zinc-700/80 rounded-2xl p-3 text-xs text-slate-800 dark:text-zinc-150 focus:outline-none focus:border-slate-900 dark:focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={handleImportRawText}
                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                  >
                    <FileText size={14} />
                    {"Analyser et pré-remplir"}
                  </button>
                </div>
              )}

              {importActiveTab === "reset" && (
                <div className="space-y-4">
                  <div className="flex gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/15 border border-red-100 dark:border-red-900/40">
                    <ShieldAlert className="text-red-500 flex-shrink-0" size={18} />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-red-800 dark:text-red-400">{"Action irréversible"}</p>
                      <p className="text-[11px] text-red-700/80 dark:text-red-450 leading-normal">
                        {"Toutes les données saisies sur le CV en cours (coordonnées, expériences, formations, photo, etc.) seront définitivement supprimées du stockage de votre navigateur."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetCV}
                    className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <RotateCcw size={14} />
                    {"Réinitialiser et recommencer à zéro"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
