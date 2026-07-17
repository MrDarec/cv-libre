import { CVData, COLOR_THEMES } from "@/types/cv";

export default function Creatif({ cv }: { cv: CVData }) {
  const { infos, colorTheme } = cv;

  // Resolve custom color theme
  const activeTheme = COLOR_THEMES.find(t => t.id === (colorTheme || "default")) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;
  const primaryColor = activeTheme.primary;

  return (
    <div className="bg-white text-slate-800 w-[210mm] min-h-[297mm] flex flex-col justify-between cv-text-body overflow-hidden">
      <div>
        {/* Banner Header */}
        <header className="p-10 text-white flex justify-between items-center gap-6" style={{ backgroundColor: primaryColor }}>
          <div>
            <h1 className="font-black tracking-tight cv-text-title leading-tight">
              {infos.prenom || "Prénom"} {infos.nom || "Nom"}
            </h1>
            <p className="text-sm font-bold tracking-widest uppercase mt-1.5" style={{ color: accentColor }}>
              {infos.titre || "Titre du poste recherché"}
            </p>
          </div>
          {infos.inclurePhoto && infos.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={infos.photoUrl}
              alt="Photo"
              className="w-24 h-24 rounded-2xl border-4 object-cover shadow-md flex-shrink-0"
              style={{ borderColor: accentColor }}
            />
          )}
        </header>

        {/* Double Column Grid */}
        <div className="grid grid-cols-12 min-h-[200mm]">
          {/* Main Column - Left (2/3) */}
          <main className="col-span-8 p-8 space-y-6">
            {cv.resume && (
              <section>
                <h2 className="font-extrabold uppercase tracking-wide mb-2 text-slate-900 cv-text-subtitle flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                  Profil
                </h2>
                <p className="text-slate-650 leading-relaxed cv-text-body">{cv.resume}</p>
              </section>
            )}

            {cv.experiences.length > 0 && (
              <section>
                <h2 className="font-extrabold uppercase tracking-wide mb-3.5 text-slate-900 cv-text-subtitle flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                  Expériences
                </h2>
                <div className="space-y-4">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100 hover:border-slate-300 transition-colors">
                      <div className="absolute -left-[6px] top-1.5 w-[10px] h-[10px] rounded-full border bg-white" style={{ borderColor: accentColor }} />
                      <div className="flex justify-between items-baseline gap-4 mb-0.5">
                        <p className="font-bold text-slate-900 cv-text-body">{exp.poste}</p>
                        <p className="text-xs font-semibold text-slate-400 whitespace-nowrap cv-text-meta">
                          {exp.debut} – {exp.enCours ? "Présent" : exp.fin}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-slate-505 mb-1.5">{exp.entreprise} {exp.lieu ? `(${exp.lieu})` : ""}</p>
                      {exp.bullets.length > 0 && (
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1 cv-text-body">
                          {exp.bullets.map((b, i) => (
                            <li key={i} className="leading-relaxed">{b}</li>
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
                <h2 className="font-extrabold uppercase tracking-wide mb-3.5 text-slate-900 cv-text-subtitle flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                  Formation
                </h2>
                <div className="space-y-3">
                  {cv.formations.map((f) => (
                    <div key={f.id} className="flex justify-between items-baseline gap-4">
                      <div>
                        <span className="font-bold text-slate-800 cv-text-body">{f.diplome}</span>
                        {f.etablissement && (
                          <span className="text-slate-600 font-medium cv-text-body"> — {f.etablissement}</span>
                        )}
                        {f.lieu && <span className="text-slate-400 italic cv-text-meta"> ({f.lieu})</span>}
                      </div>
                      <span className="text-slate-500 whitespace-nowrap cv-text-meta font-semibold">{f.annee}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar Column - Right (1/3) */}
          <aside className="col-span-4 bg-slate-50/70 p-6 border-l border-slate-100 space-y-6">
            {/* Contact Details */}
            <section className="space-y-2">
              <h2 className="font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 cv-text-subtitle">
                Contact
              </h2>
              <div className="space-y-1.5 text-slate-600 cv-text-meta break-words">
                {infos.email && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">E-mail</span>
                    <span>{infos.email}</span>
                  </p>
                )}
                {infos.telephone && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Téléphone</span>
                    <span>{infos.telephone}</span>
                  </p>
                )}
                {(infos.ville || infos.pays) && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Localisation</span>
                    <span>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</span>
                  </p>
                )}
                {infos.linkedin && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">LinkedIn</span>
                    <span className="truncate">{infos.linkedin}</span>
                  </p>
                )}
                {infos.github && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">GitHub</span>
                    <span className="truncate">{infos.github}</span>
                  </p>
                )}
                {infos.portfolio && (
                  <p className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Portfolio</span>
                    <span className="truncate">{infos.portfolio}</span>
                  </p>
                )}
              </div>
            </section>

            {/* Competences */}
            {cv.competences.length > 0 && (
              <section className="space-y-2">
                <h2 className="font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 cv-text-subtitle">
                  Compétences
                </h2>
                <div className="flex flex-wrap gap-1">
                  {cv.competences.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      {c.nom}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Langues */}
            {cv.langues.length > 0 && (
              <section className="space-y-2">
                <h2 className="font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 cv-text-subtitle">
                  Langues
                </h2>
                <div className="space-y-1.5 cv-text-meta">
                  {cv.langues.map((l) => (
                    <div key={l.id} className="flex justify-between items-center text-slate-650">
                      <span className="font-bold">{l.nom}</span>
                      <span className="text-[10px] text-slate-450 italic">{l.niveau}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Centres d'intérêt */}
            {cv.interets && cv.interets.length > 0 && (
              <section className="space-y-2">
                <h2 className="font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 cv-text-subtitle">
                  {"Centres d'intérêt"}
                </h2>
                <div className="flex flex-wrap gap-1">
                  {cv.interets.map((i) => (
                    <span
                      key={i.id}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      {i.nom}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      {/* Subtle branding or clean bottom spacer */}
      <footer className="h-2 w-full" style={{ backgroundColor: accentColor }} />
    </div>
  );
}
