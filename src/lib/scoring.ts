import { CVData } from "@/types/cv";

export interface ScoreResult {
  score: number; // 0-100
  conseils: string[];
}

const VERBES_ACTION = [
  "développé",
  "conçu",
  "dirigé",
  "optimisé",
  "automatisé",
  "réduit",
  "augmenté",
  "créé",
  "déployé",
  "géré",
  "piloté",
  "amélioré",
  "lancé",
  "coordonné",
  "négocié",
  "formé",
];

export function scoreCV(cv: CVData): ScoreResult {
  const conseils: string[] = [];
  let points = 0;
  const maxPoints = 6;

  if (cv.resume.trim().length >= 80) {
    points++;
  } else {
    conseils.push(
      "Ajoute un résumé d'au moins 80 caractères pour te présenter clairement."
    );
  }

  if (cv.experiences.length > 0) {
    points++;
  } else {
    conseils.push("Ajoute au moins une expérience professionnelle.");
  }

  const allBullets = cv.experiences.flatMap((e) => e.bullets);

  const bulletsAvecChiffres = allBullets.filter((b) => /\d/.test(b)).length;
  if (bulletsAvecChiffres >= 2) {
    points++;
  } else {
    conseils.push(
      "Quantifie tes réalisations (%, FCFA, nombre de clients, délais...)."
    );
  }

  const bulletsAvecVerbe = allBullets.filter((b) =>
    VERBES_ACTION.some((v) => b.trim().toLowerCase().startsWith(v))
  ).length;
  if (bulletsAvecVerbe >= 2) {
    points++;
  } else {
    conseils.push(
      "Commence tes réalisations par des verbes d'action (développé, piloté, réduit...)."
    );
  }

  if (cv.competences.length >= 4) {
    points++;
  } else {
    conseils.push("Liste au moins 4 compétences clés.");
  }

  const datesOk =
    cv.experiences.length === 0 ||
    cv.experiences.every((e) => e.debut && (e.enCours || e.fin));
  if (datesOk) {
    points++;
  } else {
    conseils.push(
      "Vérifie que chaque expérience a une date de début et de fin cohérente."
    );
  }

  return { score: Math.round((points / maxPoints) * 100), conseils };
}
