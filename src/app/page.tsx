"use client";

import { useEffect, useState } from "react";
import { useCVStore } from "@/lib/store";
import WizardShell from "@/components/wizard/WizardShell";
import CVPreview from "@/components/preview/CVPreview";
import { Sun, Moon, Eye, LayoutTemplate, Upload, RotateCcw, X, FileText, ShieldAlert, User, Briefcase, GraduationCap, Wrench, Languages, Check, ArrowRight } from "lucide-react";

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

import { NiveauLangue, Experience, Formation, Competence, Langue, Interet } from "@/types/cv";

interface ParsedResumeData {
  prenom: string;
  nom: string;
  titre: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  linkedin: string;
  github: string;
  portfolio: string;
  resume: string;
  experiences: Experience[];
  formations: Formation[];
  skills: Competence[];
  langues: Langue[];
  interets: Interet[];
}

// Heuristic client-side parser to extract structured CV data from raw text (e.g. copied from PDF/Word)
const parseRawResumeText = (text: string): ParsedResumeData => {
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

  // 3. Section Splitting
  const sections: {
    header: string[];
    experience: string[];
    education: string[];
    skills: string[];
    languages: string[];
    interests: string[];
  } = {
    header: [],
    experience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
  };

  let currentSection: keyof typeof sections = "header";

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const isShort = line.length < 40;
    if (isShort && (lowerLine.includes("expérience") || lowerLine.includes("experience") || lowerLine.includes("work experience") || lowerLine.includes("parcours professionnel") || lowerLine.includes("postes occupés"))) {
      currentSection = "experience";
    } else if (isShort && (lowerLine.includes("formation") || lowerLine.includes("education") || lowerLine.includes("diplôme") || lowerLine.includes("diplome") || lowerLine.includes("cursus") || lowerLine.includes("études") || lowerLine.includes("etudes") || lowerLine.includes("certifications") || lowerLine.includes("parcours académique"))) {
      currentSection = "education";
    } else if (isShort && (lowerLine.includes("compétence") || lowerLine.includes("competence") || lowerLine.includes("skills") || lowerLine.includes("outils") || lowerLine.includes("technologies") || lowerLine.includes("aptitudes"))) {
      currentSection = "skills";
    } else if (isShort && (lowerLine.includes("langue") || lowerLine.includes("languages"))) {
      currentSection = "languages";
    } else if (isShort && (lowerLine.includes("intérêt") || lowerLine.includes("interet") || lowerLine.includes("loisir") || lowerLine.includes("hobbies") || lowerLine.includes("hobbi") || lowerLine.includes("activités") || lowerLine.includes("activites"))) {
      currentSection = "interests";
    } else {
      sections[currentSection].push(line);
    }
  }

  // 4. Name and Title Extraction
  const TITLE_INDICATORS = [
    "stagiaire", "developpeur", "développeur", "ingénieur", "ingénieur", "consultant", 
    "chef de", "directeur", "manager", "technicien", "analyste", "assistant", "chargé", 
    "charge", "alternant", "freelance", "expert", "specialist", "spécialiste", "designer"
  ];

  let nameLine = "";
  let titre = "";
  
  for (let i = 0; i < Math.min(sections.header.length, 5); i++) {
    const line = sections.header[i];
    if (line.includes("@") || line.match(phoneFullRegex) || line.toLowerCase().includes("linkedin") || line.toLowerCase().includes("github")) {
      continue;
    }
    
    const lowerLine = line.toLowerCase();
    let hasTitleIndicator = false;
    let splitIndex = -1;
    for (const indicator of TITLE_INDICATORS) {
      const idx = lowerLine.indexOf(indicator);
      if (idx !== -1) {
        hasTitleIndicator = true;
        splitIndex = idx;
        break;
      }
    }
    
    if (hasTitleIndicator && splitIndex > 0) {
      nameLine = line.slice(0, splitIndex).trim().replace(/[\s\-,|•]+$/, "");
      titre = line.slice(splitIndex).trim();
      break;
    } else if (!nameLine && line.length > 3 && line.length < 50 && line.split(/\s+/).length <= 6) {
      nameLine = line;
    } else if (nameLine && !titre && line.length > 3 && line.length < 60 && line.split(/\s+/).length <= 8) {
      titre = line;
      break;
    }
  }

  let prenom = "";
  let nom = "";
  if (nameLine) {
    const words = nameLine.split(/\s+/).filter(w => /^[a-zA-ZÀ-ÿ\-]+$/.test(w));
    if (words.length >= 1) {
      prenom = words[0];
    }
    if (words.length >= 2) {
      nom = words.slice(1).join(" ");
    }
  }

  // 5. Social links (LinkedIn, GitHub, Portfolio)
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

  // 6. Location (ville, pays)
  let ville = "";
  let pays = "";
  const COMMON_ADJECTIVES = ["motivée", "motivee", "motivé", "motive", "rigoureuse", "rigoureux", "organisée", "organisee", "organisé", "organise", "dynamique", "sérieux", "serieux", "ponctuel", "passionné", "passionne"];
  const COMMON_COUNTRIES = ["france", "belgique", "suisse", "canada", "bénin", "benin", "sénégal", "senegal", "côte d'ivoire", "cote d'ivoire", "cameroun", "togo", "maroc", "algérie", "algerie", "tunisie", "madagascar", "uemoa"];
  
  for (const line of sections.header) {
    const cleanLine = line.trim();
    const match = cleanLine.match(/\b([a-zA-ZÀ-ÿ\s\-]{2,20}),\s*([a-zA-ZÀ-ÿ\s\-]{2,20})\b/);
    if (match) {
      const possibleVille = match[1].trim();
      const possiblePays = match[2].trim();
      const lowerVille = possibleVille.toLowerCase();
      const lowerPays = possiblePays.toLowerCase();
      
      const isAdjective = COMMON_ADJECTIVES.includes(lowerVille) || COMMON_ADJECTIVES.includes(lowerPays);
      const isKnownCountry = COMMON_COUNTRIES.includes(lowerPays);
      const isShortLine = cleanLine.length < 80;
      
      if (!isAdjective && (isKnownCountry || (isShortLine && possibleVille[0] === possibleVille[0].toUpperCase() && possiblePays[0] === possiblePays[0].toUpperCase()))) {
        ville = possibleVille;
        pays = possiblePays;
        break;
      }
    }
  }

  // 7. Profile / Resume summary extraction
  let resume = "";
  const profileLines: string[] = [];
  let startCollecting = false;
  for (const line of sections.header) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes("profil") || lowerLine.includes("résumé") || lowerLine.includes("resume") || lowerLine.includes("summary") || lowerLine.includes("à propos") || lowerLine.includes("a propos")) {
      startCollecting = true;
      continue;
    }
    if (startCollecting) {
      profileLines.push(line);
    }
  }

  if (profileLines.length > 0) {
    resume = profileLines.join(" ");
  } else {
    // If no explicit profile section, look for lines in header that are relatively long paragraphs
    const paragraphs = sections.header.filter(line => {
      const clean = line.trim();
      // Exclude contact details
      if (clean.includes("@") || clean.toLowerCase().includes("linkedin") || clean.toLowerCase().includes("github") || clean.toLowerCase().includes("portfolio")) {
        return false;
      }
      // Exclude name and title lines
      if (nameLine && clean.includes(nameLine)) {
        return false;
      }
      if (titre && clean.includes(titre)) {
        return false;
      }
      return clean.length > 60;
    });
    if (paragraphs.length > 0) {
      resume = paragraphs.join(" ");
    }
  }

  // Helper date parsing function inside the scope
  const parseDatesFromText = (lineText: string) => {
    const monthRegexStr = "(?:janvier|février|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\\d{1,2})";
    const yearRegexStr = "\\b(19\\d{2}|20\\d{2}|\\d{2})\\b";
    const dateRegex = new RegExp(`(?:${monthRegexStr}[\\s/\\.\\-]+)?${yearRegexStr}`, "i");
    const rangeRegex = new RegExp(
      `(${dateRegex.source})\\s*([\\s\\-–—toàau/]+)\\s*(${dateRegex.source}|pr[ée]sent|aujourd'hui|en cours|current|now|present)`,
      "i"
    );
    
    const matchRange = lineText.match(rangeRegex);
    if (matchRange) {
      const raw = matchRange[0];
      const debutText = matchRange[1];
      const finText = matchRange[3];
      const enCours = /pr[ée]sent|aujourd'hui|en cours|current|now/i.test(finText);
      
      return {
        raw,
        debut: formatParsedDate(debutText),
        fin: enCours ? "" : formatParsedDate(finText),
        enCours
      };
    }
    
    const depuisRegex = new RegExp(`(?:depuis|since)\\s*(${dateRegex.source})`, "i");
    const matchDepuis = lineText.match(depuisRegex);
    if (matchDepuis) {
      return {
        raw: matchDepuis[0],
        debut: formatParsedDate(matchDepuis[1]),
        fin: "",
        enCours: true
      };
    }
    
    const matchSingle = lineText.match(dateRegex);
    if (matchSingle) {
      return {
        raw: matchSingle[0],
        debut: formatParsedDate(matchSingle[0]),
        fin: "",
        enCours: false
      };
    }
    
    return { raw: "", debut: "", fin: "", enCours: false };
  };

  const formatParsedDate = (dateText: string): string => {
    const txt = dateText.trim().toLowerCase();
    const yearMatch = txt.match(/\b(19\d{2}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : "";
    if (!year) return dateText;
    
    const months: Record<string, string> = {
      janvier: "01", jan: "01", "01": "01", "1": "01",
      "février": "02", fevrier: "02", fev: "02", feb: "02", "02": "02", "2": "02",
      mars: "03", mar: "03", "03": "03", "3": "03",
      avril: "04", avr: "04", apr: "04", "04": "04", "4": "04",
      mai: "05", may: "05", "05": "05", "5": "05",
      juin: "06", jun: "06", "06": "06", "6": "06",
      juillet: "07", jul: "07", "07": "07", "7": "07",
      "août": "08", aout: "08", aug: "08", "08": "08", "8": "08",
      septembre: "09", sep: "09", "09": "09", "9": "09",
      octobre: "10", oct: "10", "10": "10",
      novembre: "11", nov: "11", "11": "11",
      "décembre": "12", decembre: "12", dec: "12", "12": "12"
    };
    
    for (const [mName, mNum] of Object.entries(months)) {
      if (txt.includes(mName)) {
        return `${year}-${mNum}`;
      }
    }
    return year;
  };

  const parseLocationFromText = (lineText: string): string => {
    const locationRegex = /\b([a-zA-ZÀ-ÿ\s\-]{2,}),\s*([a-zA-ZÀ-ÿ\s\-]{2,})\b/i;
    const match = lineText.match(locationRegex);
    if (match) {
      const matchStr = match[0];
      const containsMonth = /(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i.test(matchStr);
      if (!containsMonth) {
        return matchStr;
      }
    }
    return "";
  };

  // 8. Experience Extraction
  const experiences: Experience[] = [];
  let currentExp: Experience | null = null;

  for (const line of sections.experience) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    const isBullet = /^[•\-\*\+]\s*(.*)/.test(cleanLine);
    const bulletText = cleanLine.replace(/^[•\-\*\+]\s*/, "");

    if (isBullet) {
      if (currentExp) {
        currentExp.bullets.push(bulletText);
      } else {
        currentExp = {
          id: crypto.randomUUID(),
          poste: "Poste",
          entreprise: "",
          lieu: "",
          debut: "",
          fin: "",
          enCours: false,
          bullets: [bulletText]
        };
        experiences.push(currentExp);
      }
    } else {
      const dates = parseDatesFromText(cleanLine);
      const location = parseLocationFromText(cleanLine);
      
      let textWithoutDatesAndLoc = cleanLine;
      if (dates.raw) {
        textWithoutDatesAndLoc = textWithoutDatesAndLoc.replace(dates.raw, "");
      }
      if (location) {
        textWithoutDatesAndLoc = textWithoutDatesAndLoc.replace(location, "");
      }
      
      const parts = textWithoutDatesAndLoc.split(/[\s\-—|•]{2,}|[—|]/).map(p => p.trim()).filter(Boolean);
      let poste = "Poste";
      let entreprise = "";
      
      if (parts.length >= 2) {
        poste = parts[0];
        entreprise = parts.slice(1).join(" - ");
      } else if (parts.length === 1) {
        poste = parts[0];
      }
      
      if (currentExp && currentExp.bullets.length === 0) {
        if (poste && poste !== "Poste") currentExp.poste = poste;
        if (entreprise) currentExp.entreprise = entreprise;
        if (location) currentExp.lieu = location;
        if (dates.debut) currentExp.debut = dates.debut;
        if (dates.fin) currentExp.fin = dates.fin;
        currentExp.enCours = dates.enCours;
      } else {
        currentExp = {
          id: crypto.randomUUID(),
          poste: poste || "Poste",
          entreprise: entreprise || "",
          lieu: location || "",
          debut: dates.debut || "",
          fin: dates.fin || "",
          enCours: dates.enCours,
          bullets: []
        };
        experiences.push(currentExp);
      }
    }
  }

  // 9. Education Extraction
  const formations: Formation[] = [];
  for (const line of sections.education) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    const dates = parseDatesFromText(cleanLine);
    const location = parseLocationFromText(cleanLine);
    
    let textWithoutDatesAndLoc = cleanLine;
    if (dates.raw) {
      textWithoutDatesAndLoc = textWithoutDatesAndLoc.replace(dates.raw, "");
    }
    if (location) {
      textWithoutDatesAndLoc = textWithoutDatesAndLoc.replace(location, "");
    }
    
    const parts = textWithoutDatesAndLoc.split(/[\s\-—|•]{2,}|[—|]/).map(p => p.trim()).filter(Boolean);
    let diplome = "";
    let etablissement = "";
    
    if (parts.length >= 2) {
      diplome = parts[0];
      etablissement = parts.slice(1).join(" - ");
    } else if (parts.length === 1) {
      diplome = parts[0];
    }
    
    const annee = dates.debut ? (dates.fin ? `${dates.debut} - ${dates.fin}` : dates.debut) : "";

    if (diplome) {
      formations.push({
        id: crypto.randomUUID(),
        diplome,
        etablissement: etablissement || "",
        lieu: location || "",
        annee: annee || ""
      });
    }
  }

  // 10. Skills Extraction
  const skills: Competence[] = [];
  const skillNamesAdded = new Set<string>();

  const addParsedSkill = (name: string) => {
    const cleaned = name.trim().replace(/^[•\-\*\+\s]+/, "").replace(/[\s\-\*\+]+$/, "");
    if (cleaned.length > 1 && cleaned.length < 30 && !skillNamesAdded.has(cleaned.toLowerCase())) {
      skillNamesAdded.add(cleaned.toLowerCase());
      skills.push({
        id: crypto.randomUUID(),
        nom: cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      });
    }
  };

  for (const line of sections.skills) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;
    
    if (cleanLine.includes(",") || cleanLine.includes(";") || cleanLine.includes("|")) {
      const parts = cleanLine.split(/[,;|]+/).map(p => p.trim()).filter(Boolean);
      parts.forEach(addParsedSkill);
    } else {
      addParsedSkill(cleanLine);
    }
  }

  if (skills.length < 5) {
    const lowerText = text.toLowerCase();
    COMMON_SKILLS.forEach(skill => {
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lowerText) && !skillNamesAdded.has(skill.toLowerCase())) {
        addParsedSkill(skill);
      }
    });
  }

  // 11. Languages Extraction
  const langues: Langue[] = [];
  for (const line of sections.languages) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;
    
    const parts = cleanLine.split(/[:\-–—\(]/).map(p => p.trim().replace(/\)$/, "")).filter(Boolean);
    if (parts.length >= 1) {
      const name = parts[0];
      const levelText = parts[1] || "";
      let niveau: NiveauLangue = "courant";
      const lowerLevel = levelText.toLowerCase();
      
      if (lowerLevel.includes("notion") || lowerLevel.includes("débutant") || lowerLevel.includes("debutant") || lowerLevel.includes("a1") || lowerLevel.includes("a2") || lowerLevel.includes("notions")) {
        niveau = "notions";
      } else if (lowerLevel.includes("interm") || lowerLevel.includes("b1") || lowerLevel.includes("b2") || lowerLevel.includes("moyen")) {
        niveau = "intermediaire";
      } else if (lowerLevel.includes("courant") || lowerLevel.includes("c1") || lowerLevel.includes("c2") || lowerLevel.includes("profes")) {
        niveau = "courant";
      } else if (lowerLevel.includes("bilingue") || lowerLevel.includes("bilingual")) {
        niveau = "bilingue";
      } else if (lowerLevel.includes("natif") || lowerLevel.includes("maternelle") || lowerLevel.includes("native")) {
        niveau = "natif";
      }
      
      langues.push({
        id: crypto.randomUUID(),
        nom: name.charAt(0).toUpperCase() + name.slice(1),
        niveau
      });
    }
  }

  // 12. Interests Extraction
  const interets: Interet[] = [];
  const interestNames = new Set<string>();

  const addInterest = (name: string) => {
    const cleaned = name.trim().replace(/^[•\-\*\+\s]+/, "").replace(/[\s\-\*\+]+$/, "");
    if (cleaned.length > 2 && cleaned.length < 30 && !interestNames.has(cleaned.toLowerCase())) {
      interestNames.add(cleaned.toLowerCase());
      interets.push({
        id: crypto.randomUUID(),
        nom: cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      });
    }
  };

  for (const line of sections.interests) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;
    
    if (cleanLine.includes(",") || cleanLine.includes(";") || cleanLine.includes("|")) {
      const parts = cleanLine.split(/[,;|]+/).map(p => p.trim()).filter(Boolean);
      parts.forEach(addInterest);
    } else {
      addInterest(cleanLine);
    }
  }

  return {
    prenom,
    nom,
    titre,
    email,
    telephone,
    ville,
    pays,
    linkedin,
    github,
    portfolio,
    resume,
    experiences,
    formations,
    skills,
    langues,
    interets
  };
};

interface CustomWindow extends Window {
  pdfjsLib?: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    getDocument: (options: { data: Uint8Array }) => {
      promise: Promise<{
        numPages: number;
        getPage: (pageNo: number) => Promise<{
          getTextContent: () => Promise<{
            items: Array<{
              str?: string;
              transform?: number[];
              hasEOL?: boolean;
            }>;
          }>;
        }>;
      }>;
    };
  };
}

// Dynamically load PDF.js from the local public folder to avoid Next.js dev server ESM / source map import errors
const loadPdfJS = (): Promise<Exclude<CustomWindow["pdfjsLib"], undefined>> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot run PDF.js on server side"));
      return;
    }
    const customWindow = window as unknown as CustomWindow;
    if (customWindow.pdfjsLib) {
      resolve(customWindow.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjs = customWindow.pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
        resolve(pdfjs);
      } else {
        reject(new Error("pdfjsLib not found on window"));
      }
    };
    script.onerror = (err) => {
      reject(err);
    };
    document.head.appendChild(script);
  });
};

export default function Home() {
  const { cv, setCV, reset } = useCVStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  
  // Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importActiveTab, setImportActiveTab] = useState<"file" | "text" | "reset">("file");
  const [pasteText, setPasteText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ParsedResumeData | null>(null);

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

  const switchTemplate = (templateId: "ats-classique" | "moderne" | "minimaliste" | "professionnel" | "creatif") => {
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
        const pdfjs = await loadPdfJS();

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          let pageText = "";
          let lastY = -1;
          for (const item of textContent.items) {
            const textItem = item as { str?: string; transform?: number[]; hasEOL?: boolean };
            if (textItem.str === undefined) continue;
            
            const currentY = textItem.transform ? textItem.transform[5] : -1;
            
            // Si la coordonnée Y a changé de manière significative, on commence une nouvelle ligne
            if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
              pageText += "\n";
            }
            
            pageText += textItem.str;
            
            if (textItem.hasEOL) {
              pageText += "\n";
            } else {
              pageText += " ";
            }
            
            lastY = currentY;
          }
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
    setParsedPreview(result);
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;
    
    // Fill all parsed values into CV Store
    setCV((c) => ({
      ...c,
      infos: {
        ...c.infos,
        prenom: parsedPreview.prenom || c.infos.prenom,
        nom: parsedPreview.nom || c.infos.nom,
        titre: parsedPreview.titre || c.infos.titre,
        email: parsedPreview.email || c.infos.email,
        telephone: parsedPreview.telephone || c.infos.telephone,
        ville: parsedPreview.ville || c.infos.ville,
        pays: parsedPreview.pays || c.infos.pays,
        linkedin: parsedPreview.linkedin || c.infos.linkedin,
        github: parsedPreview.github || c.infos.github,
        portfolio: parsedPreview.portfolio || c.infos.portfolio,
      },
      resume: parsedPreview.resume || c.resume,
      experiences: parsedPreview.experiences,
      formations: parsedPreview.formations,
      competences: parsedPreview.skills,
      langues: parsedPreview.langues,
      interets: parsedPreview.interets
    }));

    // Redirect to step 1 (Infos) where they can see the personal info and start updating!
    useCVStore.setState({ step: 1 });
    setShowImportModal(false);
    setParsedPreview(null);
    setPasteText("");
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
              {"Tous droits réservés à INNOVATIK — gratuit, open-source & conforme aux normes ATS"}
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
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              {([
                { id: "ats-classique", label: "ATS Classique" },
                { id: "moderne", label: "Moderne" },
                { id: "minimaliste", label: "Minimaliste" },
                { id: "professionnel", label: "Professionnel" },
                { id: "creatif", label: "Créatif" }
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTemplate(t.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    cv.templateId === t.id
                      ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <LayoutTemplate size={11} /> {t.label}
                </button>
              ))}
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
              onClick={() => {
                setShowImportModal(false);
                setParsedPreview(null);
              }}
              className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              {parsedPreview ? "Aperçu de l'analyse du CV" : "Configurer l'espace de travail"}
            </h3>

            {parsedPreview ? (
              <div className="space-y-5 py-2">
                <div className="p-4 rounded-2xl bg-slate-50/55 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-zinc-700/50 pb-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        Analyse réussie !
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Vérifiez les données extraites ci-dessous.
                      </p>
                    </div>
                  </div>

                  {/* Grid of parsed contents */}
                  <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                    {/* Personal info summary */}
                    <div className="flex items-start gap-2.5">
                      <User size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-700 dark:text-zinc-300 block">Informations de contact</span>
                        <p className="text-slate-655 dark:text-zinc-450 mt-0.5">
                          {[parsedPreview.prenom, parsedPreview.nom].filter(Boolean).join(" ") || "Nom non détecté"} 
                          {parsedPreview.titre && ` • ${parsedPreview.titre}`}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                          {[parsedPreview.email, parsedPreview.telephone, parsedPreview.ville, parsedPreview.pays].filter(Boolean).join("  |  ")}
                        </p>
                      </div>
                    </div>

                    {/* Profile summary */}
                    {parsedPreview.resume && (
                      <div className="flex items-start gap-2.5">
                        <FileText size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 block">Résumé professionnel</span>
                          <p className="text-slate-655 dark:text-zinc-450 mt-0.5 line-clamp-2 italic leading-normal">
                            &quot;{parsedPreview.resume}&quot;
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Experiences */}
                    {parsedPreview.experiences.length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Briefcase size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs w-full">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                            Expériences professionnelles 
                            <span className="px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">
                              {parsedPreview.experiences.length}
                            </span>
                          </span>
                          <ul className="mt-1 space-y-1 text-slate-655 dark:text-zinc-450 text-[11px] list-disc list-inside">
                            {parsedPreview.experiences.slice(0, 3).map((exp: Experience, idx: number) => (
                              <li key={idx} className="truncate">
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">{exp.poste}</span> {exp.entreprise ? `à ${exp.entreprise}` : ""}
                              </li>
                            ))}
                            {parsedPreview.experiences.length > 3 && (
                              <li className="text-slate-400 dark:text-zinc-550 list-none font-medium pl-3">
                                + {parsedPreview.experiences.length - 3} autres expériences
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {parsedPreview.formations.length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <GraduationCap size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs w-full">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                            Formations & Diplômes 
                            <span className="px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">
                              {parsedPreview.formations.length}
                            </span>
                          </span>
                          <ul className="mt-1 space-y-1 text-slate-655 dark:text-zinc-450 text-[11px] list-disc list-inside">
                            {parsedPreview.formations.slice(0, 3).map((form: Formation, idx: number) => (
                              <li key={idx} className="truncate">
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">{form.diplome}</span> {form.etablissement ? `— ${form.etablissement}` : ""}
                              </li>
                            ))}
                            {parsedPreview.formations.length > 3 && (
                              <li className="text-slate-400 dark:text-zinc-550 list-none font-medium pl-3">
                                + {parsedPreview.formations.length - 3} autres formations
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {parsedPreview.skills.length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Wrench size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs w-full">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 block mb-1">Compétences clés ({parsedPreview.skills.length})</span>
                          <div className="flex flex-wrap gap-1">
                            {parsedPreview.skills.map((skill: Competence, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-[10px] font-medium rounded-lg">
                                {skill.nom}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {parsedPreview.langues.length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Languages size={15} className="text-slate-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs w-full">
                          <span className="font-extrabold text-slate-700 dark:text-zinc-300 block mb-1">Langues ({parsedPreview.langues.length})</span>
                          <div className="flex flex-wrap gap-1.5">
                            {parsedPreview.langues.map((l: Langue, idx: number) => (
                              <span key={idx} className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                                {l.nom} <span className="text-slate-400 italic">({l.niveau})</span>
                                {idx < parsedPreview.langues.length - 1 ? "," : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirmation buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setParsedPreview(null)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-750/60 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex-[2] flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Valider et importer <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
