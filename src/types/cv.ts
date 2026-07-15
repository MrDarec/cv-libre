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

export type ColorThemeId = "default" | "emerald" | "indigo" | "bordeaux" | "anthracite";

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
];

export interface CVData {
  norme: Norme;
  templateId: "ats-classique" | "moderne";
  colorTheme: ColorThemeId;
  infos: InfosPerso;
  resume: string;
  experiences: Experience[];
  formations: Formation[];
  competences: Competence[];
  langues: Langue[];
}

export const emptyCV = (): CVData => ({
  norme: "france",
  templateId: "ats-classique",
  colorTheme: "default",
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
});

export const NORME_LABELS: Record<Norme, string> = {
  france: "France / Europe (CV avec ou sans photo)",
  international: "International US/UK (sans photo, sans âge)",
  "afrique-ouest": "Afrique de l'Ouest (format courant UEMOA)",
};
