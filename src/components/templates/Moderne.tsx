import { CVData, COLOR_THEMES } from "@/types/cv";

export default function Moderne({ cv }: { cv: CVData }) {
  const { infos, colorTheme } = cv;

  // Resolve custom colors from active theme
  const activeTheme = COLOR_THEMES.find(t => t.id === (colorTheme || "default")) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;
  const primaryColor = activeTheme.primary;

  return (
    <div className="bg-white text-neutral-900 w-[210mm] min-h-[297mm] flex font-sans text-[10.5pt]">
      {/* Colonne latérale : texte réel empilé, jamais de tableau ni d'absolute pour rester lisible par les ATS */}
      <aside
        className="w-[70mm] min-h-[297mm] text-white p-8 flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        {infos.inclurePhoto && infos.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={infos.photoUrl}
            alt="Photo de profil"
            className="w-28 h-28 rounded-full object-cover mb-6"
          />
        )}
        <h1 className="text-xl font-bold leading-tight">
          {infos.prenom || "Prénom"}
          <br />
          {infos.nom || "Nom"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: accentColor }}>
          {infos.titre || "Titre du poste"}
        </p>

        <div className="mt-6 space-y-1 text-xs text-neutral-300">
          {infos.email && <p>{infos.email}</p>}
          {infos.telephone && <p>{infos.telephone}</p>}
          {(infos.ville || infos.pays) && (
            <p>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</p>
          )}
          {infos.linkedin && <p>LinkedIn : {infos.linkedin}</p>}
          {infos.github && <p>GitHub / Portfolio : {infos.github}</p>}
          {infos.portfolio && <p>Portfolio : {infos.portfolio}</p>}
        </div>

        {cv.competences.length > 0 && (
          <div className="mt-8">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Compétences
            </h2>
            <ul className="text-xs space-y-1 text-neutral-200">
              {cv.competences.map((c) => (
                <li key={c.id}>{c.nom}</li>
              ))}
            </ul>
          </div>
        )}

        {cv.langues.length > 0 && (
          <div className="mt-8">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Langues
            </h2>
            <ul className="text-xs space-y-1 text-neutral-200">
              {cv.langues.map((l) => (
                <li key={l.id}>
                  {l.nom} — {l.niveau}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Colonne principale */}
      <main className="flex-1 p-8">
        {cv.resume && (
          <section className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Profil
            </h2>
            <p>{cv.resume}</p>
          </section>
        )}

        {cv.experiences.length > 0 && (
          <section className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              Expérience professionnelle
            </h2>
            <div className="space-y-4">
              {cv.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-4">
                    <p className="font-semibold" style={{ color: primaryColor }}>
                      {exp.poste}
                      {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                    </p>
                    <p className="text-xs text-neutral-500 whitespace-nowrap">
                      {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                    </p>
                  </div>
                  {exp.lieu && (
                    <p className="text-xs text-neutral-500">{exp.lieu}</p>
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
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: accentColor }}
            >
              Formation
            </h2>
            <div className="space-y-1">
              {cv.formations.map((f) => (
                <div
                  key={f.id}
                  className="flex justify-between text-sm gap-4"
                >
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
      </main>
    </div>
  );
}
