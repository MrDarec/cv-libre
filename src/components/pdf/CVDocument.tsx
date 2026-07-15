import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { CVData, COLOR_THEMES } from "@/types/cv";

// ==========================================
// 1. ATS CLASSIQUE PDF LAYOUT & STYLES
// ==========================================
const classiqueStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937", // Slate 800
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // Slate 200
    paddingBottom: 12,
    marginBottom: 16,
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827" },
  title: { fontSize: 11, color: "#4b5563", marginTop: 2, fontFamily: "Helvetica-Bold" },
  contact: { fontSize: 8.5, color: "#4b5563", marginTop: 6 },
  photo: { width: 70, height: 70, borderRadius: 4, objectFit: "cover" },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 2,
  },
  section: { marginBottom: 14 },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expTitle: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#111827" },
  expDate: { fontSize: 8.5, color: "#6b7280" },
  expLieu: { fontSize: 8.5, color: "#6b7280", marginBottom: 2 },
  bullet: { fontSize: 9, color: "#4b5563", marginBottom: 2, marginLeft: 8 },
  expBlock: { marginBottom: 10 },
  twoCol: { flexDirection: "row", gap: 20, marginTop: 4 },
  col: { flex: 1 },
});

function ClassiquePDF({ cv, accentColor }: { cv: CVData; accentColor: string }) {
  const { infos } = cv;

  return (
    <Page size="A4" style={classiqueStyles.page}>
      <View style={classiqueStyles.header}>
        <View>
          <Text style={classiqueStyles.name}>
            {infos.prenom || "Prénom"} {infos.nom || "Nom"}
          </Text>
          <Text style={classiqueStyles.title}>{infos.titre}</Text>
          <Text style={classiqueStyles.contact}>
            {[
              infos.email,
              infos.telephone,
              [infos.ville, infos.pays].filter(Boolean).join(", "),
            ]
              .filter(Boolean)
              .join("   ·   ")}
          </Text>
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <Text style={classiqueStyles.contact}>
              {[
                infos.linkedin && `LinkedIn : ${infos.linkedin}`,
                infos.github && `GitHub / Portfolio : ${infos.github}`,
                infos.portfolio && `Portfolio : ${infos.portfolio}`,
              ]
                .filter(Boolean)
                .join("   ·   ")}
            </Text>
          )}
        </View>
        {infos.inclurePhoto && infos.photoUrl && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image src={infos.photoUrl} style={classiqueStyles.photo} />
        )}
      </View>

      {cv.resume && (
        <View style={classiqueStyles.section}>
          <Text style={[classiqueStyles.sectionTitle, { color: accentColor }]}>Profil</Text>
          <Text style={{ fontSize: 9.5, lineHeight: 1.4 }}>{cv.resume}</Text>
        </View>
      )}

      {cv.experiences.length > 0 && (
        <View style={classiqueStyles.section}>
          <Text style={[classiqueStyles.sectionTitle, { color: accentColor }]}>Expérience professionnelle</Text>
          {cv.experiences.map((exp) => (
            <View key={exp.id} style={classiqueStyles.expBlock}>
              <View style={classiqueStyles.expRow}>
                <Text style={classiqueStyles.expTitle}>
                  {exp.poste}
                  {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                </Text>
                <Text style={classiqueStyles.expDate}>
                  {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                </Text>
              </View>
              {exp.lieu && <Text style={classiqueStyles.expLieu}>{exp.lieu}</Text>}
              {exp.bullets
                .filter((b) => b.trim())
                .map((b, i) => (
                  <Text key={i} style={classiqueStyles.bullet}>
                    • {b}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}

      {cv.formations.length > 0 && (
        <View style={classiqueStyles.section}>
          <Text style={[classiqueStyles.sectionTitle, { color: accentColor }]}>Formation</Text>
          {cv.formations.map((f) => (
            <View key={f.id} style={classiqueStyles.expBlock}>
              <View style={classiqueStyles.expRow}>
                <Text style={{ fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                  {f.diplome}
                  {f.etablissement ? ` — ${f.etablissement}` : ""}
                </Text>
                <Text style={classiqueStyles.expDate}>{f.annee}</Text>
              </View>
              {f.lieu && <Text style={classiqueStyles.expLieu}>{f.lieu}</Text>}
            </View>
          ))}
        </View>
      )}

      <View style={classiqueStyles.twoCol}>
        {cv.competences.length > 0 && (
          <View style={classiqueStyles.col}>
            <Text style={[classiqueStyles.sectionTitle, { color: accentColor }]}>Compétences</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.4 }}>
              {cv.competences.map((c) => c.nom).join("  ·  ")}
            </Text>
          </View>
        )}
        {cv.langues.length > 0 && (
          <View style={classiqueStyles.col}>
            <Text style={[classiqueStyles.sectionTitle, { color: accentColor }]}>Langues</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.4 }}>
              {cv.langues.map((l) => `${l.nom} (${l.niveau})`).join("  ·  ")}
            </Text>
          </View>
        )}
      </View>
    </Page>
  );
}

// ==========================================
// 2. MODERNE PDF LAYOUT & STYLES (TWO COLUMN)
// ==========================================
const moderneStyles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: "#374151",
    backgroundColor: "#ffffff",
  },
  aside: {
    width: 175,
    color: "#ffffff",
    padding: 20,
    paddingTop: 30,
  },
  main: {
    flex: 1,
    padding: 24,
    paddingTop: 30,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 2,
    objectFit: "cover",
    alignSelf: "center",
  },
  asideName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    lineHeight: 1.1,
  },
  asideTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  asideSectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 6,
    letterSpacing: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 2,
  },
  asideContactItem: {
    fontSize: 7.5,
    color: "#d1d5db", // Gray 300
    marginBottom: 4,
    lineHeight: 1.3,
  },
  asideItem: {
    fontSize: 8,
    color: "#f3f4f6", // Gray 100
    marginBottom: 3.5,
    lineHeight: 1.25,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 14,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 3,
  },
  section: {
    marginBottom: 10,
  },
  resumeText: {
    fontSize: 9,
    lineHeight: 1.35,
    color: "#4b5563",
  },
  expBlock: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  expTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  expDate: {
    fontSize: 7.5,
    color: "#6b7280",
  },
  expLieu: {
    fontSize: 7.5,
    color: "#6b7280",
    marginBottom: 2,
  },
  bullet: {
    fontSize: 8.5,
    color: "#4b5563",
    marginBottom: 1.5,
    marginLeft: 6,
    lineHeight: 1.25,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 1,
  },
  formTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
});

function ModernePDF({ cv, accentColor, primaryColor }: { cv: CVData; accentColor: string; primaryColor: string }) {
  const { infos } = cv;

  return (
    <Page size="A4" style={moderneStyles.page}>
      {/* Sidebar aside column */}
      <View style={[moderneStyles.aside, { backgroundColor: primaryColor }]}>
        {infos.inclurePhoto && infos.photoUrl ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image src={infos.photoUrl} style={[moderneStyles.photo, { borderColor: accentColor }]} />
        ) : null}
        
        <Text style={moderneStyles.asideName}>
          {infos.prenom || "Prénom"}
        </Text>
        <Text style={{ ...moderneStyles.asideName, fontFamily: "Helvetica-Bold" }}>
          {infos.nom || "Nom"}
        </Text>
        
        <Text style={[moderneStyles.asideTitle, { color: accentColor }]}>
          {infos.titre || "Titre du poste"}
        </Text>

        {/* Contacts info */}
        <Text style={[moderneStyles.asideSectionTitle, { color: accentColor }]}>Contact</Text>
        <View style={{ marginTop: 2 }}>
          {infos.email ? <Text style={moderneStyles.asideContactItem}>{infos.email}</Text> : null}
          {infos.telephone ? <Text style={moderneStyles.asideContactItem}>{infos.telephone}</Text> : null}
          {infos.ville || infos.pays ? (
            <Text style={moderneStyles.asideContactItem}>
              {[infos.ville, infos.pays].filter(Boolean).join(", ")}
            </Text>
          ) : null}
          {infos.linkedin ? <Text style={moderneStyles.asideContactItem}>LinkedIn : {infos.linkedin}</Text> : null}
          {infos.github ? <Text style={moderneStyles.asideContactItem}>GitHub / Portfolio : {infos.github}</Text> : null}
          {infos.portfolio ? <Text style={moderneStyles.asideContactItem}>Portfolio : {infos.portfolio}</Text> : null}
        </View>

        {/* Competences list */}
        {cv.competences.length > 0 && (
          <View>
            <Text style={[moderneStyles.asideSectionTitle, { color: accentColor }]}>Compétences</Text>
            {cv.competences.map((c) => (
              <Text key={c.id} style={moderneStyles.asideItem}>
                • {c.nom}
              </Text>
            ))}
          </View>
        )}

        {/* Languages list */}
        {cv.langues.length > 0 && (
          <View>
            <Text style={[moderneStyles.asideSectionTitle, { color: accentColor }]}>Langues</Text>
            {cv.langues.map((l) => (
              <Text key={l.id} style={moderneStyles.asideItem}>
                • {l.nom} ({l.niveau})
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Main column */}
      <View style={moderneStyles.main}>
        {cv.resume ? (
          <View style={moderneStyles.section}>
            <Text style={[moderneStyles.sectionTitle, { color: accentColor }]}>Profil</Text>
            <Text style={moderneStyles.resumeText}>{cv.resume}</Text>
          </View>
        ) : null}

        {cv.experiences.length > 0 && (
          <View style={moderneStyles.section}>
            <Text style={[moderneStyles.sectionTitle, { color: accentColor }]}>Expérience professionnelle</Text>
            {cv.experiences.map((exp) => (
              <View key={exp.id} style={moderneStyles.expBlock}>
                <View style={moderneStyles.expHeader}>
                  <Text style={[moderneStyles.expTitle, { color: primaryColor }]}>
                    {exp.poste}
                    {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                  </Text>
                  <Text style={moderneStyles.expDate}>
                    {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                  </Text>
                </View>
                {exp.lieu ? <Text style={moderneStyles.expLieu}>{exp.lieu}</Text> : null}
                {exp.bullets
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <Text key={i} style={moderneStyles.bullet}>
                      • {b}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {cv.formations.length > 0 && (
          <View style={moderneStyles.section}>
            <Text style={[moderneStyles.sectionTitle, { color: accentColor }]}>Formation</Text>
            {cv.formations.map((f) => (
              <View key={f.id} style={{ marginBottom: 6 }}>
                <View style={moderneStyles.formRow}>
                  <Text style={[moderneStyles.formTitle, { color: primaryColor }]}>{f.diplome}</Text>
                  <Text style={moderneStyles.expDate}>{f.annee}</Text>
                </View>
                {f.etablissement || f.lieu ? (
                  <Text style={moderneStyles.expLieu}>
                    {f.etablissement}
                    {f.etablissement && f.lieu ? `, ` : ""}
                    {f.lieu}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}

// ==========================================
// 3. MAIN COMPONENT ROUTER
// ==========================================
export default function CVDocument({ cv }: { cv: CVData }) {
  const isModerne = cv.templateId === "moderne";

  // Resolve custom color theme
  const themeId = cv.colorTheme || "default";
  const activeTheme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;
  const primaryColor = activeTheme.primary;

  return (
    <Document
      title={`CV - ${cv.infos.prenom || "cv"} ${cv.infos.nom || "libre"}`}
      author="CV Libre - Éditions Cypher"
    >
      {isModerne ? (
        <ModernePDF cv={cv} accentColor={accentColor} primaryColor={primaryColor} />
      ) : (
        <ClassiquePDF cv={cv} accentColor={accentColor} />
      )}
    </Document>
  );
}
