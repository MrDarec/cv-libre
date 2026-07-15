import { CVData } from "@/types/cv";

export function cvToPlainText(cv: CVData): string {
  const { infos } = cv;
  const lines: string[] = [];

  lines.push(`${infos.prenom} ${infos.nom}`.trim());
  if (infos.titre) lines.push(infos.titre);
  lines.push(
    [infos.email, infos.telephone, [infos.ville, infos.pays].filter(Boolean).join(", ")]
      .filter(Boolean)
      .join(" | ")
  );
  if (infos.linkedin || infos.github || infos.portfolio) {
    lines.push(
      [infos.linkedin, infos.github, infos.portfolio].filter(Boolean).join(" | ")
    );
  }
  lines.push("");

  if (cv.resume) {
    lines.push("PROFIL");
    lines.push(cv.resume);
    lines.push("");
  }

  if (cv.experiences.length > 0) {
    lines.push("EXPERIENCE PROFESSIONNELLE");
    for (const exp of cv.experiences) {
      lines.push(
        `${exp.poste}${exp.entreprise ? " - " + exp.entreprise : ""} (${exp.debut} - ${
          exp.enCours ? "présent" : exp.fin
        })`
      );
      if (exp.lieu) lines.push(exp.lieu);
      for (const b of exp.bullets.filter((x) => x.trim())) {
        lines.push(`- ${b}`);
      }
      lines.push("");
    }
  }

  if (cv.formations.length > 0) {
    lines.push("FORMATION");
    for (const f of cv.formations) {
      lines.push(
        `${f.diplome}${f.etablissement ? " - " + f.etablissement : ""} (${f.annee})`
      );
    }
    lines.push("");
  }

  if (cv.competences.length > 0) {
    lines.push("COMPETENCES");
    lines.push(cv.competences.map((c) => c.nom).join(", "));
    lines.push("");
  }

  if (cv.langues.length > 0) {
    lines.push("LANGUES");
    lines.push(cv.langues.map((l) => `${l.nom} (${l.niveau})`).join(", "));
  }

  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
