import { CVData, COLOR_THEMES } from "@/types/cv";

export default function Professionnel({ cv }: { cv: CVData }) {
  const { infos, colorTheme } = cv;

  // Resolve custom color theme
  const activeTheme = COLOR_THEMES.find(t => t.id === (colorTheme || "default")) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;

  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] p-12 cv-text-body">
      {/* Header - Left Aligned Name, Right Aligned Contact */}
      <header className="border-b-2 pb-6 mb-8 flex justify-between items-end gap-6" style={{ borderColor: accentColor }}>
        <div>
          <h1 className="font-extrabold tracking-tight text-slate-900 cv-text-title">
            {infos.prenom || "Prénom"} {infos.nom || "Nom"}
          </h1>
          <p className="text-sm font-semibold tracking-wide mt-1 text-slate-600">
            {infos.titre || "Titre du poste recherché"}
          </p>
        </div>
        <div className="text-right text-slate-500 space-y-0.5 cv-text-meta">
          <p>{infos.email}</p>
          <p>{infos.telephone}</p>
          <p>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</p>
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <p className="text-slate-400 text-[10px] truncate max-w-[280px]">
              {[
                infos.linkedin && `LinkedIn: ${infos.linkedin}`,
                infos.github && `GitHub: ${infos.github}`,
                infos.portfolio && `Portfolio: ${infos.portfolio}`,
              ]
                .filter(Boolean)
                .join("  |  ")}
            </p>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Profile */}
        {cv.resume && (
          <section>
            <h2 className="font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
              Profil Professionnel
            </h2>
            <p className="text-slate-700 leading-relaxed cv-text-body">{cv.resume}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experiences.length > 0 && (
          <section>
            <h2 className="font-bold uppercase tracking-wider mb-3 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
              Expérience Professionnelle
            </h2>
            <div className="space-y-4">
              {cv.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-4 mb-0.5">
                    <h3 className="font-bold text-slate-900 cv-text-body">
                      {exp.poste} <span className="font-semibold text-slate-650">— {exp.entreprise}</span>
                    </h3>
                    <span className="text-slate-500 font-medium whitespace-nowrap cv-text-meta">
                      {exp.debut} – {exp.enCours ? "Présent" : exp.fin}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs italic mb-1.5 cv-text-meta">
                    <span>{exp.lieu}</span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2 cv-text-body">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="pl-1 leading-normal">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formation */}
        {cv.formations.length > 0 && (
          <section>
            <h2 className="font-bold uppercase tracking-wider mb-3 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
              Formation et Diplômes
            </h2>
            <div className="space-y-3">
              {cv.formations.map((f) => (
                <div key={f.id} className="flex justify-between items-baseline gap-4">
                  <div>
                    <span className="font-bold text-slate-800 cv-text-body">{f.diplome}</span>
                    {f.etablissement && (
                      <span className="text-slate-650 cv-text-body"> — {f.etablissement}</span>
                    )}
                    {f.lieu && <span className="text-slate-450 italic cv-text-meta"> ({f.lieu})</span>}
                  </div>
                  <span className="text-slate-500 font-medium whitespace-nowrap cv-text-meta">{f.annee}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competences & Langues in 3 Columns */}
        <div className="grid grid-cols-3 gap-8 pt-2">
          {cv.competences.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
                Compétences Clés
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cv.competences.map((c) => (
                  <span
                    key={c.id}
                    className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {c.nom}
                  </span>
                ))}
              </div>
            </section>
          )}

          {cv.langues.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
                Langues
              </h2>
              <ul className="space-y-1 pt-1 text-slate-700 cv-text-body">
                {cv.langues.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span className="font-semibold">{l.nom}</span>
                    <span className="text-slate-500 text-xs italic">{l.niveau}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cv.interets && cv.interets.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-200 pb-1 cv-text-subtitle">
                {"Centres d'intérêt"}
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cv.interets.map((i) => (
                  <span
                    key={i.id}
                    className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    {i.nom}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
