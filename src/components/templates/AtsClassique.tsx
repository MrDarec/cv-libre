import { CVData, COLOR_THEMES } from "@/types/cv";

export default function AtsClassique({ cv }: { cv: CVData }) {
  const { infos, colorTheme } = cv;

  // Resolve custom color theme
  const activeTheme = COLOR_THEMES.find(t => t.id === (colorTheme || "default")) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;

  return (
    <div className="bg-white text-neutral-900 w-[210mm] min-h-[297mm] p-12 font-sans text-[11pt] leading-snug">
      <header className="border-b border-neutral-300 pb-4 mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {infos.prenom || "Prénom"} {infos.nom || "Nom"}
          </h1>
          <p className="text-neutral-600 mt-1">
            {infos.titre || "Titre du poste recherché"}
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            {[
              infos.email,
              infos.telephone,
              [infos.ville, infos.pays].filter(Boolean).join(", "),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <p className="text-sm text-neutral-500 mt-1">
              {[
                infos.linkedin && `LinkedIn : ${infos.linkedin}`,
                infos.github && `GitHub / Portfolio : ${infos.github}`,
                infos.portfolio && `Portfolio : ${infos.portfolio}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        {infos.inclurePhoto && infos.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={infos.photoUrl}
            alt="Photo de profil"
            className="w-24 h-24 rounded object-cover flex-shrink-0"
          />
        )}
      </header>

      {cv.resume && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
            Profil
          </h2>
          <p>{cv.resume}</p>
        </section>
      )}

      {cv.experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
            Expérience professionnelle
          </h2>
          <div className="space-y-4">
            {cv.experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-4">
                  <p className="font-semibold">
                    {exp.poste}
                    {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                  </p>
                  <p className="text-sm text-neutral-500 whitespace-nowrap">
                    {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                  </p>
                </div>
                {exp.lieu && (
                  <p className="text-sm text-neutral-500">{exp.lieu}</p>
                )}
                {exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {cv.formations.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
            Formation
          </h2>
          <div className="space-y-1">
            {cv.formations.map((f) => (
              <div key={f.id} className="flex justify-between text-sm gap-4">
                <p>
                  <span className="font-semibold">{f.diplome}</span>
                  {f.etablissement ? ` — ${f.etablissement}` : ""}
                  {f.lieu ? ` (${f.lieu})` : ""}
                </p>
                <p className="text-neutral-500 whitespace-nowrap">
                  {f.annee}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {cv.competences.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
              Compétences
            </h2>
            <p className="text-sm">
              {cv.competences.map((c) => c.nom).join(" · ")}
            </p>
          </section>
        )}
        {cv.langues.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
              Langues
            </h2>
            <p className="text-sm">
              {cv.langues.map((l) => `${l.nom} (${l.niveau})`).join(" · ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
