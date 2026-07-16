import { CVData, COLOR_THEMES } from "@/types/cv";

export default function Minimaliste({ cv }: { cv: CVData }) {
  const { infos, colorTheme } = cv;

  // Resolve custom color theme
  const activeTheme = COLOR_THEMES.find(t => t.id === (colorTheme || "default")) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;

  return (
    <div className="bg-white text-neutral-800 w-[210mm] min-h-[297mm] p-14 flex flex-col justify-between cv-text-body">
      <div>
        {/* Header - Centered & Clean */}
        <header className="text-center mb-10">
          <h1 className="font-light tracking-wide text-neutral-900 cv-text-title">
            <span className="font-bold">{infos.prenom || "Prénom"}</span> {infos.nom || "Nom"}
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold mt-2" style={{ color: accentColor }}>
            {infos.titre || "Titre du poste recherché"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-neutral-500 cv-text-meta">
            {infos.email && <span>{infos.email}</span>}
            {infos.telephone && <span>{infos.telephone}</span>}
            {(infos.ville || infos.pays) && (
              <span>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</span>
            )}
          </div>
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-neutral-400 cv-text-meta">
              {infos.linkedin && <span>LinkedIn : {infos.linkedin}</span>}
              {infos.github && <span>GitHub : {infos.github}</span>}
              {infos.portfolio && <span>Portfolio : {infos.portfolio}</span>}
            </div>
          )}
        </header>

        {/* Profile */}
        {cv.resume && (
          <section className="mb-8 max-w-2xl mx-auto text-center">
            <p className="italic text-neutral-600 leading-relaxed cv-text-body">{cv.resume}</p>
          </section>
        )}

        <div className="space-y-8">
          {/* Experience */}
          {cv.experiences.length > 0 && (
            <section>
              <h2 className="text-[10pt] uppercase tracking-widest font-bold border-b border-neutral-100 pb-1 mb-4 text-center text-neutral-405">
                Expérience
              </h2>
              <div className="space-y-5">
                {cv.experiences.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-baseline gap-4 mb-0.5">
                      <p className="font-bold text-neutral-900 cv-text-body">
                        {exp.poste} <span className="font-light text-neutral-400">|</span> <span className="font-medium text-neutral-700">{exp.entreprise}</span>
                      </p>
                      <p className="text-neutral-500 whitespace-nowrap cv-text-meta">
                        {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                      </p>
                    </div>
                    {exp.lieu && (
                      <p className="text-neutral-400 italic mb-1.5 cv-text-meta">{exp.lieu}</p>
                    )}
                    {exp.bullets.length > 0 && (
                      <ul className="list-none space-y-1 pl-4 border-l border-neutral-100">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-neutral-600 before:content-['—'] before:mr-2 before:text-neutral-300 cv-text-body">
                            {b}
                          </li>
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
              <h2 className="text-[10pt] uppercase tracking-widest font-bold border-b border-neutral-100 pb-1 mb-4 text-center text-neutral-405">
                Formation
              </h2>
              <div className="space-y-4">
                {cv.formations.map((f) => (
                  <div key={f.id} className="flex justify-between items-baseline gap-4">
                    <div>
                      <span className="font-bold text-neutral-800 cv-text-body">{f.diplome}</span>
                      {f.etablissement && (
                        <span className="text-neutral-600 cv-text-body"> — {f.etablissement}</span>
                      )}
                      {f.lieu && <span className="text-neutral-400 italic cv-text-meta"> ({f.lieu})</span>}
                    </div>
                    <span className="text-neutral-500 whitespace-nowrap cv-text-meta">{f.annee}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Competences & Langues side-by-side */}
          <div className="grid grid-cols-2 gap-10 pt-4">
            {cv.competences.length > 0 && (
              <section>
                <h3 className="text-[9pt] uppercase tracking-widest font-bold border-b border-neutral-100 pb-1 mb-2.5 text-neutral-400">
                  Compétences
                </h3>
                <p className="text-neutral-600 leading-relaxed cv-text-body">
                  {cv.competences.map((c) => c.nom).join("  ·  ")}
                </p>
              </section>
            )}
            {cv.langues.length > 0 && (
              <section>
                <h3 className="text-[9pt] uppercase tracking-widest font-bold border-b border-neutral-100 pb-1 mb-2.5 text-neutral-400">
                  Langues
                </h3>
                <p className="text-neutral-600 leading-relaxed cv-text-body">
                  {cv.langues.map((l) => `${l.nom} (${l.niveau})`).join("  ·  ")}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Footer info (optional photo or signature placeholder) */}
      {infos.inclurePhoto && infos.photoUrl && (
        <div className="flex justify-center mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={infos.photoUrl}
            alt="Photo"
            className="w-16 h-16 rounded-full grayscale opacity-80 border border-neutral-200 p-0.5 object-cover"
          />
        </div>
      )}
    </div>
  );
}
