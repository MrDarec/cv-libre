export type Norme = "france" | "international" | "afrique-ouest";

export interface Experience {
  id: string;
  poste: string;
  entreprise: string;
  lieu: string;
  debut: string; // "2023-01"
  fin: string; // "" si en cours
  enCours: boolean;
  bullets: string[]; // réalisations, idéalement chiffrées
}

export interface Formation {
  id: string;
  diplome: string;
  etablissement: string;
  lieu: string;
  annee: string;
}

export interface Competence {
  id: string;
  nom: string;
}

export interface Interet {
  id: string;
  nom: string;
}

export type NiveauLangue =
  | "notions"
  | "intermediaire"
  | "courant"
  | "bilingue"
  | "natif";

export interface Langue {
  id: string;
  nom: string;
  niveau: NiveauLangue;
}

export interface InfosPerso {
  prenom: string;
  nom: string;
  titre: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  photoUrl?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  inclurePhoto: boolean;
}

export type ColorThemeId =
  | "default"
  | "emerald"
  | "indigo"
  | "bordeaux"
  | "anthracite"
  | "ocean"
  | "luxe"
  | "coral"
  | "amethyst"
  | "sage"
  | "royal";

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  accent: string;
  primary: string;
  previewClass: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: "default", label: "Cuivré / Encre", accent: "#B5622F", primary: "#1D2430", previewClass: "bg-gradient-to-tr from-[#B5622F] to-[#1D2430]" },
  { id: "emerald", label: "Émeraude / Forêt", accent: "#0D9488", primary: "#111827", previewClass: "bg-gradient-to-tr from-[#0D9488] to-[#111827]" },
  { id: "indigo", label: "Indigo / Minuit", accent: "#6366F1", primary: "#0F172A", previewClass: "bg-gradient-to-tr from-[#6366F1] to-[#0F172A]" },
  { id: "bordeaux", label: "Bordeaux / Grenat", accent: "#B91C1C", primary: "#1E1B4B", previewClass: "bg-gradient-to-tr from-[#B91C1C] to-[#1E1B4B]" },
  { id: "anthracite", label: "Minimal / Carbone", accent: "#4B5563", primary: "#18181B", previewClass: "bg-gradient-to-tr from-[#4B5563] to-[#18181B]" },
  { id: "ocean", label: "Bleu Océan", accent: "#06B6D4", primary: "#0F172A", previewClass: "bg-gradient-to-tr from-[#06B6D4] to-[#0F172A]" },
  { id: "luxe", label: "Luxe & Or", accent: "#C5A880", primary: "#1C1C1E", previewClass: "bg-gradient-to-tr from-[#C5A880] to-[#1C1C1E]" },
  { id: "coral", label: "Corail Éclatant", accent: "#F97316", primary: "#27272A", previewClass: "bg-gradient-to-tr from-[#F97316] to-[#27272A]" },
  { id: "amethyst", label: "Améthyste", accent: "#A78BFA", primary: "#2E1065", previewClass: "bg-gradient-to-tr from-[#A78BFA] to-[#2E1065]" },
  { id: "sage", label: "Vert Sauge", accent: "#84CC16", primary: "#1E293B", previewClass: "bg-gradient-to-tr from-[#84CC16] to-[#1E293B]" },
  { id: "royal", label: "Bleu Royal", accent: "#3B82F6", primary: "#1E3A8A", previewClass: "bg-gradient-to-tr from-[#3B82F6] to-[#1E3A8A]" },
];

export interface CVData {
  norme: Norme;
  templateId: "ats-classique" | "moderne" | "minimaliste" | "professionnel" | "creatif";
  colorTheme: ColorThemeId;
  fontSize: "sm" | "md" | "lg";
  fontFamily: "sans" | "serif" | "mono" | "elegant" | "playfair";
  infos: InfosPerso;
  resume: string;
  experiences: Experience[];
  formations: Formation[];
  competences: Competence[];
  langues: Langue[];
  interets: Interet[];
}

export const emptyCV = (): CVData => ({
  norme: "france",
  templateId: "ats-classique",
  colorTheme: "default",
  fontSize: "md",
  fontFamily: "sans",
  infos: {
    prenom: "",
    nom: "",
    titre: "",
    email: "",
    telephone: "",
    ville: "",
    pays: "",
    inclurePhoto: false,
  },
  resume: "",
  experiences: [],
  formations: [],
  competences: [],
  langues: [],
  interets: [],
});

export const NORME_LABELS: Record<Norme, string> = {
  france: "France / Europe (CV avec ou sans photo)",
  international: "International US/UK (sans photo, sans âge)",
  "afrique-ouest": "Afrique de l'Ouest (format courant UEMOA)",
};
