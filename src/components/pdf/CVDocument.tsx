import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { CVData, COLOR_THEMES } from "@/types/cv";

// ==========================================
// REGISTER GOOGLE FONTS FOR PDF GENERATION
// ==========================================
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter/Inter_400Regular.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter/400Regular_Italic/Inter_400Regular_Italic.ttf", fontWeight: "normal", fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter/Inter_700Bold.ttf", fontWeight: "bold" },
  ]
});

Font.register({
  family: "Merriweather",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/merriweather/Merriweather_400Regular.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/merriweather/400Regular_Italic/Merriweather_400Regular_Italic.ttf", fontWeight: "normal", fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/merriweather/Merriweather_700Bold.ttf", fontWeight: "bold" },
  ]
});

Font.register({
  family: "Fira Code",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/fira-code/FiraCode_400Regular.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/fira-code/FiraCode_400Regular.ttf", fontWeight: "normal", fontStyle: "italic" }, // Fallback to regular since Fira Code has no italic
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/fira-code/FiraCode_700Bold.ttf", fontWeight: "bold" }
  ]
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/montserrat/Montserrat_400Regular.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/montserrat/400Regular_Italic/Montserrat_400Regular_Italic.ttf", fontWeight: "normal", fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/montserrat/Montserrat_700Bold.ttf", fontWeight: "bold" }
  ]
});

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/playfair-display/PlayfairDisplay_400Regular.ttf", fontWeight: "normal" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/playfair-display/400Regular_Italic/PlayfairDisplay_400Regular_Italic.ttf", fontWeight: "normal", fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/npm/@expo-google-fonts/playfair-display/PlayfairDisplay_700Bold.ttf", fontWeight: "bold" }
  ]
});

// Helper to resolve font family
const getFontFamily = (family?: string) => {
  switch (family) {
    case "serif": return "Merriweather";
    case "mono": return "Fira Code";
    case "elegant": return "Montserrat";
    case "playfair": return "Playfair Display";
    case "sans":
    default:
      return "Inter";
  }
};

// Helper to resolve font size multiplier
const getFontSizeMultiplier = (size?: string) => {
  switch (size) {
    case "sm": return 0.85;
    case "lg": return 1.15;
    case "md":
    default:
      return 1.0;
  }
};

// ============================================================================
// 1. ATS CLASSIQUE PDF TEMPLATE
// ============================================================================
function ClassiquePDF({ cv, accentColor, fontName, sizeMult }: { cv: CVData; accentColor: string; fontName: string; sizeMult: number }) {
  const { infos } = cv;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 9.5 * sizeMult,
      fontFamily: fontName,
      color: "#1f2937",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      paddingBottom: 12,
      marginBottom: 16,
    },
    name: { fontSize: 20 * sizeMult, fontFamily: fontName, fontWeight: "bold", color: "#111827" },
    title: { fontSize: 11 * sizeMult, color: "#4b5563", marginTop: 2, fontFamily: fontName, fontWeight: "bold" },
    contact: { fontSize: 8.5 * sizeMult, color: "#4b5563", marginTop: 5 },
    photo: { width: 70, height: 70, borderRadius: 4, objectFit: "cover" },
    sectionTitle: {
      fontSize: 9 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
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
    expTitle: { fontFamily: fontName, fontWeight: "bold", fontSize: 10 * sizeMult, color: "#111827" },
    expDate: { fontSize: 8.5 * sizeMult, color: "#6b7280" },
    expLieu: { fontSize: 8.5 * sizeMult, color: "#6b7280", marginBottom: 2 },
    bullet: { fontSize: 9 * sizeMult, color: "#4b5563", marginBottom: 2, marginLeft: 8 },
    expBlock: { marginBottom: 10 },
    twoCol: { flexDirection: "row", gap: 20, marginTop: 4 },
    col: { flex: 1 },
  });

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={styles.name}>
            {infos.prenom || "Prénom"} {infos.nom || "Nom"}
          </Text>
          <Text style={styles.title}>{infos.titre}</Text>
          <Text style={styles.contact}>
            {[
              infos.email,
              infos.telephone,
              [infos.ville, infos.pays].filter(Boolean).join(", "),
            ]
              .filter(Boolean)
              .join("   ·   ")}
          </Text>
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <Text style={styles.contact}>
              {[
                infos.linkedin && `LinkedIn : ${infos.linkedin}`,
                infos.github && `GitHub : ${infos.github}`,
                infos.portfolio && `Portfolio : ${infos.portfolio}`,
              ]
                .filter(Boolean)
                .join("   ·   ")}
            </Text>
          )}
        </View>
        {infos.inclurePhoto && infos.photoUrl && (
          <Image src={infos.photoUrl} style={styles.photo} />
        )}
      </View>

      {cv.resume && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Profil</Text>
          <Text style={{ fontSize: 9.5 * sizeMult, lineHeight: 1.4 }}>{cv.resume}</Text>
        </View>
      )}

      {cv.experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Expérience professionnelle</Text>
          {cv.experiences.map((exp) => (
            <View key={exp.id} style={styles.expBlock}>
              <View style={styles.expRow}>
                <Text style={styles.expTitle}>
                  {exp.poste}
                  {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                </Text>
                <Text style={styles.expDate}>
                  {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                </Text>
              </View>
              {exp.lieu && <Text style={styles.expLieu}>{exp.lieu}</Text>}
              {exp.bullets
                .filter((b) => b.trim())
                .map((b, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}

      {cv.formations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>Formation</Text>
          {cv.formations.map((f) => (
            <View key={f.id} style={styles.expBlock}>
              <View style={styles.expRow}>
                <Text style={{ fontSize: 9.5 * sizeMult, fontFamily: fontName, fontWeight: "bold", color: "#111827" }}>
                  {f.diplome}
                  {f.etablissement ? ` — ${f.etablissement}` : ""}
                </Text>
                <Text style={styles.expDate}>{f.annee}</Text>
              </View>
              {f.lieu && <Text style={styles.expLieu}>{f.lieu}</Text>}
            </View>
          ))}
        </View>
      )}

      <View style={styles.twoCol}>
        {cv.competences.length > 0 && (
          <View style={styles.col}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Compétences</Text>
            <Text style={{ fontSize: 9 * sizeMult, lineHeight: 1.4 }}>
              {cv.competences.map((c) => c.nom).join("  ·  ")}
            </Text>
          </View>
        )}
        {cv.langues.length > 0 && (
          <View style={styles.col}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Langues</Text>
            <Text style={{ fontSize: 9 * sizeMult, lineHeight: 1.4 }}>
              {cv.langues.map((l) => `${l.nom} (${l.niveau})`).join("  ·  ")}
            </Text>
          </View>
        )}
      </View>

      {cv.interets && cv.interets.length > 0 && (
        <View style={[styles.section, { marginTop: 10 }]}>
          <Text style={[styles.sectionTitle, { color: accentColor }]}>{"Centres d'intérêt"}</Text>
          <Text style={{ fontSize: 9 * sizeMult, lineHeight: 1.4 }}>
            {cv.interets.map((i) => i.nom).join("  ·  ")}
          </Text>
        </View>
      )}
    </Page>
  );
}

// ============================================================================
// 2. MODERNE PDF TEMPLATE
// ============================================================================
function ModernePDF({ cv, accentColor, primaryColor, fontName, sizeMult }: { cv: CVData; accentColor: string; primaryColor: string; fontName: string; sizeMult: number }) {
  const { infos } = cv;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      fontFamily: fontName,
      fontSize: 9.5 * sizeMult,
      color: "#374151",
      backgroundColor: "#ffffff",
    },
    aside: {
      width: "32%",
      backgroundColor: primaryColor,
      color: "#ffffff",
      padding: 24,
      flexDirection: "column",
    },
    main: {
      width: "68%",
      padding: 30,
    },
    photo: {
      width: 75,
      height: 75,
      borderRadius: 75 / 2,
      borderWidth: 2,
      borderColor: accentColor,
      marginBottom: 16,
      objectFit: "cover",
      alignSelf: "center",
    },
    asideName: {
      fontSize: 16 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
      color: "#ffffff",
      lineHeight: 1.15,
      textAlign: "center",
    },
    asideTitle: {
      fontSize: 9.5 * sizeMult,
      marginTop: 4,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textAlign: "center",
      marginBottom: 20,
    },
    asideSectionTitle: {
      fontSize: 9 * sizeMult,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginTop: 15,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.15)",
      paddingBottom: 3,
    },
    asideContactItem: {
      fontSize: 7.5 * sizeMult,
      color: "#d1d5db",
      marginBottom: 6,
      lineHeight: 1.3,
    },
    asideItem: {
      fontSize: 8 * sizeMult,
      color: "#e5e7eb",
      marginBottom: 4,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 10 * sizeMult,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#f3f4f6",
      paddingBottom: 3,
    },
    resumeText: {
      fontSize: 9 * sizeMult,
      lineHeight: 1.45,
      color: "#4b5563",
    },
    expBlock: {
      marginBottom: 12,
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    expTitle: {
      fontSize: 9.5 * sizeMult,
      fontWeight: "bold",
      color: "#111827",
    },
    expDate: {
      fontSize: 8 * sizeMult,
      color: "#6b7280",
    },
    expLieu: {
      fontSize: 8 * sizeMult,
      color: "#9ca3af",
      marginBottom: 3,
    },
    bullet: {
      fontSize: 8.5 * sizeMult,
      color: "#4b5563",
      marginLeft: 6,
      marginBottom: 1.5,
    },
    formRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 1,
    },
    formTitle: {
      fontSize: 9 * sizeMult,
      fontWeight: "bold",
    },
  });

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.aside}>
        {infos.inclurePhoto && infos.photoUrl && (
          <Image src={infos.photoUrl} style={styles.photo} />
        )}
        <Text style={styles.asideName}>
          {infos.prenom} {infos.nom}
        </Text>
        <Text style={[styles.asideTitle, { color: accentColor }]}>
          {infos.titre || "Recherche de poste"}
        </Text>

        <Text style={[styles.asideSectionTitle, { color: accentColor }]}>Contact</Text>
        <View>
          {infos.email ? <Text style={styles.asideContactItem}>{infos.email}</Text> : null}
          {infos.telephone ? <Text style={styles.asideContactItem}>{infos.telephone}</Text> : null}
          {infos.ville || infos.pays ? (
            <Text style={styles.asideContactItem}>
              {[infos.ville, infos.pays].filter(Boolean).join(", ")}
            </Text>
          ) : null}
          {infos.linkedin ? <Text style={styles.asideContactItem}>LinkedIn: {infos.linkedin}</Text> : null}
          {infos.github ? <Text style={styles.asideContactItem}>GitHub: {infos.github}</Text> : null}
          {infos.portfolio ? <Text style={styles.asideContactItem}>Portfolio: {infos.portfolio}</Text> : null}
        </View>

        {cv.competences.length > 0 && (
          <View>
            <Text style={[styles.asideSectionTitle, { color: accentColor }]}>Compétences</Text>
            {cv.competences.map((c) => (
              <Text key={c.id} style={styles.asideItem}>
                • {c.nom}
              </Text>
            ))}
          </View>
        )}

        {cv.langues.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.asideSectionTitle, { color: accentColor }]}>Langues</Text>
            {cv.langues.map((l) => (
              <Text key={l.id} style={styles.asideItem}>
                {l.nom} ({l.niveau})
              </Text>
            ))}
          </View>
        )}

        {cv.interets && cv.interets.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.asideSectionTitle, { color: accentColor }]}>{"Centres d'intérêt"}</Text>
            {cv.interets.map((i) => (
              <Text key={i.id} style={styles.asideItem}>
                • {i.nom}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.main}>
        {cv.resume && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Profil</Text>
            <Text style={styles.resumeText}>{cv.resume}</Text>
          </View>
        )}

        {cv.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Expérience professionnelle</Text>
            {cv.experiences.map((exp) => (
              <View key={exp.id} style={styles.expBlock}>
                <View style={styles.expHeader}>
                  <Text style={[styles.expTitle, { color: primaryColor }]}>
                    {exp.poste}
                    {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                  </Text>
                  <Text style={styles.expDate}>
                    {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                  </Text>
                </View>
                {exp.lieu ? <Text style={styles.expLieu}>{exp.lieu}</Text> : null}
                {exp.bullets
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <Text key={i} style={styles.bullet}>
                      • {b}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {cv.formations.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accentColor }]}>Formation</Text>
            {cv.formations.map((f) => (
              <View key={f.id} style={{ marginBottom: 8 }}>
                <View style={styles.formRow}>
                  <Text style={[styles.formTitle, { color: primaryColor }]}>{f.diplome}</Text>
                  <Text style={styles.expDate}>{f.annee}</Text>
                </View>
                {f.etablissement || f.lieu ? (
                  <Text style={styles.expLieu}>
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

// ============================================================================
// 3. MINIMALISTE PDF TEMPLATE
// ============================================================================
function MinimalistePDF({ cv, accentColor, fontName, sizeMult }: { cv: CVData; accentColor: string; fontName: string; sizeMult: number }) {
  const { infos } = cv;

  const styles = StyleSheet.create({
    page: {
      paddingHorizontal: 50,
      paddingVertical: 45,
      fontSize: 9 * sizeMult,
      fontFamily: fontName,
      color: "#27272a", // zinc-800
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    name: {
      fontSize: 22 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
      color: "#09090b", // zinc-950
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 9.5 * sizeMult,
      color: accentColor,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginTop: 5,
      fontWeight: "bold",
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12,
      marginTop: 8,
      fontSize: 8 * sizeMult,
      color: "#71717a",
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#f4f4f5",
      paddingBottom: 2,
      marginBottom: 10,
      textAlign: "center",
      fontSize: 9 * sizeMult,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: "#a1a1aa",
    },
    section: {
      marginBottom: 18,
    },
    resume: {
      fontSize: 9 * sizeMult,
      lineHeight: 1.5,
      color: "#52525b",
      textAlign: "center",
      fontStyle: "italic",
      marginBottom: 14,
      paddingHorizontal: 20,
    },
    expBlock: {
      marginBottom: 10,
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 1,
    },
    expTitle: {
      fontSize: 9.5 * sizeMult,
      fontWeight: "bold",
      color: "#18181b",
    },
    expDate: {
      fontSize: 8 * sizeMult,
      color: "#71717a",
    },
    expLieu: {
      fontSize: 8 * sizeMult,
      color: "#a1a1aa",
      fontStyle: "italic",
      marginBottom: 2,
    },
    bullet: {
      fontSize: 8.5 * sizeMult,
      color: "#52525b",
      marginLeft: 10,
      marginBottom: 1,
      lineHeight: 1.35,
    },
    twoCol: {
      flexDirection: "row",
      gap: 30,
      marginTop: 5,
    },
    col: {
      flex: 1,
    },
    photo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      objectFit: "cover",
      marginTop: 8,
      opacity: 0.8,
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {infos.prenom} {infos.nom}
        </Text>
        <Text style={styles.title}>{infos.titre || "CV"}</Text>
        <View style={styles.contactRow}>
          {infos.email ? <Text>{infos.email}</Text> : null}
          {infos.telephone ? <Text>{infos.telephone}</Text> : null}
          {infos.ville || infos.pays ? (
            <Text>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</Text>
          ) : null}
        </View>
        {(infos.linkedin || infos.github || infos.portfolio) && (
          <View style={[styles.contactRow, { marginTop: 2, color: "#a1a1aa" }]}>
            {infos.linkedin ? <Text>LinkedIn: {infos.linkedin}</Text> : null}
            {infos.github ? <Text>GitHub: {infos.github}</Text> : null}
            {infos.portfolio ? <Text>Portfolio: {infos.portfolio}</Text> : null}
          </View>
        )}
      </View>

      {cv.resume && (
        <Text style={styles.resume}>{cv.resume}</Text>
      )}

      {cv.experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.divider}>Expérience</Text>
          {cv.experiences.map((exp) => (
            <View key={exp.id} style={styles.expBlock}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>
                  {exp.poste}  ·  <Text style={{ fontWeight: "normal", color: "#52525b" }}>{exp.entreprise}</Text>
                </Text>
                <Text style={styles.expDate}>
                  {exp.debut} – {exp.enCours ? "présent" : exp.fin}
                </Text>
              </View>
              {exp.lieu ? <Text style={styles.expLieu}>{exp.lieu}</Text> : null}
              {exp.bullets
                .filter((b) => b.trim())
                .map((b, i) => (
                  <Text key={i} style={styles.bullet}>
                    — {b}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}

      {cv.formations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.divider}>Formation</Text>
          {cv.formations.map((f) => (
            <View key={f.id} style={{ marginBottom: 6 }}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>
                  {f.diplome}
                  {f.etablissement ? <Text style={{ fontWeight: "normal", color: "#52525b" }}> — {f.etablissement}</Text> : ""}
                </Text>
                <Text style={styles.expDate}>{f.annee}</Text>
              </View>
              {f.lieu ? <Text style={styles.expLieu}>{f.lieu}</Text> : null}
            </View>
          ))}
        </View>
      )}

      <View style={styles.twoCol}>
        {cv.competences.length > 0 && (
          <View style={styles.col}>
            <Text style={[styles.divider, { textAlign: "left" }]}>Compétences</Text>
            <Text style={{ fontSize: 8.5 * sizeMult, color: "#52525b", lineHeight: 1.4 }}>
              {cv.competences.map((c) => c.nom).join("  ·  ")}
            </Text>
          </View>
        )}
        {cv.langues.length > 0 && (
          <View style={styles.col}>
            <Text style={[styles.divider, { textAlign: "left" }]}>Langues</Text>
            <Text style={{ fontSize: 8.5 * sizeMult, color: "#52525b", lineHeight: 1.4 }}>
              {cv.langues.map((l) => `${l.nom} (${l.niveau})`).join("  ·  ")}
            </Text>
          </View>
        )}
      </View>

      {cv.interets && cv.interets.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={[styles.divider, { textAlign: "left" }]}>Intérêts</Text>
          <Text style={{ fontSize: 8.5 * sizeMult, color: "#52525b", lineHeight: 1.4 }}>
            {cv.interets.map((i) => i.nom).join("  ·  ")}
          </Text>
        </View>
      )}

      {infos.inclurePhoto && infos.photoUrl && (
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Image src={infos.photoUrl} style={styles.photo} />
        </View>
      )}
    </Page>
  );
}

// ============================================================================
// 4. PROFESSIONNEL PDF TEMPLATE
// ============================================================================
function ProfessionnelPDF({ cv, accentColor, fontName, sizeMult }: { cv: CVData; accentColor: string; fontName: string; sizeMult: number }) {
  const { infos } = cv;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 9.5 * sizeMult,
      fontFamily: fontName,
      color: "#1e293b", // slate-800
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderBottomWidth: 2,
      borderBottomColor: accentColor,
      paddingBottom: 10,
      marginBottom: 18,
    },
    name: {
      fontSize: 21 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
      color: "#0f172a", // slate-900
      lineHeight: 1.1,
    },
    title: {
      fontSize: 11 * sizeMult,
      color: "#475569", // slate-600
      marginTop: 2,
      fontFamily: fontName,
      fontWeight: "bold",
    },
    contactBlock: {
      textAlign: "right",
      fontSize: 8.5 * sizeMult,
      color: "#64748b", // slate-500
      lineHeight: 1.3,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 10 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#0f172a",
      borderBottomWidth: 1,
      borderBottomColor: "#cbd5e1",
      paddingBottom: 2,
      marginBottom: 8,
    },
    resumeText: {
      fontSize: 9 * sizeMult,
      lineHeight: 1.45,
      color: "#334155",
    },
    expBlock: {
      marginBottom: 10,
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    expTitle: {
      fontSize: 9.5 * sizeMult,
      fontWeight: "bold",
      color: "#0f172a",
    },
    expDate: {
      fontSize: 8.5 * sizeMult,
      color: "#475569",
      fontWeight: "bold",
    },
    expLieu: {
      fontSize: 8.5 * sizeMult,
      color: "#64748b",
      fontStyle: "italic",
      marginBottom: 2,
    },
    bullet: {
      fontSize: 8.5 * sizeMult,
      color: "#334155",
      marginLeft: 10,
      marginBottom: 1.5,
    },
    twoCol: {
      flexDirection: "row",
      gap: 25,
      marginTop: 4,
    },
    col: {
      flex: 1,
    },
    skillBadge: {
      fontSize: 8 * sizeMult,
      color: "#334155",
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 3,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginRight: 4,
      marginBottom: 4,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 2,
    },
    langRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 9 * sizeMult,
      color: "#334155",
      marginBottom: 4,
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={styles.name}>
            {infos.prenom} {infos.nom}
          </Text>
          <Text style={styles.title}>{infos.titre || "Cadre Professionnel"}</Text>
        </View>
        <View style={styles.contactBlock}>
          {infos.email ? <Text>{infos.email}</Text> : null}
          {infos.telephone ? <Text>{infos.telephone}</Text> : null}
          {infos.ville || infos.pays ? (
            <Text>{[infos.ville, infos.pays].filter(Boolean).join(", ")}</Text>
          ) : null}
          {(infos.linkedin || infos.github || infos.portfolio) && (
            <Text style={{ fontSize: 7.5 * sizeMult, color: "#94a3b8", marginTop: 2 }}>
              {[infos.linkedin, infos.github, infos.portfolio].filter(Boolean).join("  |  ")}
            </Text>
          )}
        </View>
      </View>

      {cv.resume && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Professionnel</Text>
          <Text style={styles.resumeText}>{cv.resume}</Text>
        </View>
      )}

      {cv.experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
          {cv.experiences.map((exp) => (
            <View key={exp.id} style={styles.expBlock}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>
                  {exp.poste} <Text style={{ fontWeight: "normal", color: "#475569" }}>— {exp.entreprise}</Text>
                </Text>
                <Text style={styles.expDate}>
                  {exp.debut} – {exp.enCours ? "Présent" : exp.fin}
                </Text>
              </View>
              {exp.lieu ? <Text style={styles.expLieu}>{exp.lieu}</Text> : null}
              {exp.bullets
                .filter((b) => b.trim())
                .map((b, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
            </View>
          ))}
        </View>
      )}

      {cv.formations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formation et Diplômes</Text>
          {cv.formations.map((f) => (
            <View key={f.id} style={{ marginBottom: 6 }}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>
                  {f.diplome}
                  {f.etablissement ? <Text style={{ fontWeight: "normal", color: "#475569" }}> — {f.etablissement}</Text> : ""}
                </Text>
                <Text style={styles.expDate}>{f.annee}</Text>
              </View>
              {f.lieu ? <Text style={styles.expLieu}>{f.lieu}</Text> : null}
            </View>
          ))}
        </View>
      )}

      <View style={styles.twoCol}>
        {cv.competences.length > 0 && (
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Compétences Clés</Text>
            <View style={styles.skillsContainer}>
              {cv.competences.map((c) => (
                <Text key={c.id} style={styles.skillBadge}>{c.nom}</Text>
              ))}
            </View>
          </View>
        )}
        {cv.langues.length > 0 && (
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Langues</Text>
            <View style={{ marginTop: 2 }}>
              {cv.langues.map((l) => (
                <View key={l.id} style={styles.langRow}>
                  <Text style={{ fontWeight: "bold" }}>{l.nom}</Text>
                  <Text style={{ color: "#64748b", fontSize: 8.5 * sizeMult }}>{l.niveau}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {cv.interets && cv.interets.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>{"Centres d'intérêt"}</Text>
          <View style={styles.skillsContainer}>
            {cv.interets.map((i) => (
              <Text key={i.id} style={styles.skillBadge}>{i.nom}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
}

// ============================================================================
// 5. CREATIF PDF TEMPLATE
// ============================================================================
function CreatifPDF({ cv, accentColor, primaryColor, fontName, sizeMult }: { cv: CVData; accentColor: string; primaryColor: string; fontName: string; sizeMult: number }) {
  const { infos } = cv;

  const styles = StyleSheet.create({
    page: {
      fontFamily: fontName,
      fontSize: 9 * sizeMult,
      color: "#334155", // slate-700
      backgroundColor: "#ffffff",
    },
    header: {
      backgroundColor: primaryColor,
      color: "#ffffff",
      paddingHorizontal: 30,
      paddingVertical: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
      flex: 1,
      marginRight: 15,
    },
    name: {
      fontSize: 22 * sizeMult,
      fontFamily: fontName,
      fontWeight: "bold",
      color: "#ffffff",
      lineHeight: 1.1,
    },
    title: {
      fontSize: 10 * sizeMult,
      color: accentColor,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginTop: 6,
      fontWeight: "bold",
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: accentColor,
      objectFit: "cover",
    },
    bodyGrid: {
      flexDirection: "row",
      flex: 1,
    },
    mainCol: {
      width: "65%",
      padding: 24,
    },
    sideCol: {
      width: "35%",
      backgroundColor: "#f8fafc", // slate-50
      padding: 20,
      borderLeftWidth: 1,
      borderLeftColor: "#f1f5f9",
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 10 * sizeMult,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#0f172a", // slate-900
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    sectionIndicator: {
      width: 3,
      height: 10,
      backgroundColor: accentColor,
      marginRight: 6,
    },
    resumeText: {
      fontSize: 9 * sizeMult,
      lineHeight: 1.45,
      color: "#475569",
    },
    expBlock: {
      marginBottom: 12,
      borderLeftWidth: 1.5,
      borderLeftColor: "#f1f5f9",
      paddingLeft: 10,
      position: "relative",
    },
    expHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    expTitle: {
      fontSize: 9 * sizeMult,
      fontWeight: "bold",
      color: "#0f172a",
    },
    expDate: {
      fontSize: 7.5 * sizeMult,
      color: "#94a3b8",
      fontWeight: "bold",
    },
    expCompany: {
      fontSize: 8 * sizeMult,
      fontWeight: "bold",
      color: "#64748b",
      marginBottom: 3,
    },
    bullet: {
      fontSize: 8 * sizeMult,
      color: "#475569",
      marginBottom: 1.5,
      marginLeft: 4,
    },
    sidebarTitle: {
      fontSize: 9 * sizeMult,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#0f172a",
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      paddingBottom: 2,
      marginBottom: 8,
    },
    sidebarLabel: {
      fontSize: 7.5 * sizeMult,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: "#94a3b8",
      fontWeight: "bold",
      marginTop: 6,
    },
    sidebarValue: {
      fontSize: 8.5 * sizeMult,
      color: "#334155",
      marginBottom: 2,
    },
    badgeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      marginTop: 4,
    },
    badge: {
      fontSize: 7.5 * sizeMult,
      fontWeight: "bold",
      backgroundColor: "#ffffff",
      color: "#334155",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 3,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
    },
    langRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 8.5 * sizeMult,
      color: "#334155",
      marginBottom: 3,
    },
    footerLine: {
      height: 4,
      backgroundColor: accentColor,
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {infos.prenom} {infos.nom}
          </Text>
          <Text style={styles.title}>{infos.titre || "Créatif"}</Text>
        </View>
        {infos.inclurePhoto && infos.photoUrl && (
          <Image src={infos.photoUrl} style={styles.photo} />
        )}
      </View>

      <View style={styles.bodyGrid}>
        {/* Left main col */}
        <View style={styles.mainCol}>
          {cv.resume && (
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>Profil</Text>
              </View>
              <Text style={styles.resumeText}>{cv.resume}</Text>
            </View>
          )}

          {cv.experiences.length > 0 && (
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>Expériences</Text>
              </View>
              {cv.experiences.map((exp) => (
                <View key={exp.id} style={styles.expBlock}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.poste}</Text>
                    <Text style={styles.expDate}>
                      {exp.debut} – {exp.enCours ? "Présent" : exp.fin}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.entreprise} {exp.lieu ? `(${exp.lieu})` : ""}
                  </Text>
                  {exp.bullets
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {b}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}

          {cv.formations.length > 0 && (
            <View style={styles.section}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <View style={styles.sectionIndicator} />
                <Text style={styles.sectionTitle}>Formation</Text>
              </View>
              {cv.formations.map((f) => (
                <View key={f.id} style={{ marginBottom: 6 }}>
                  <View style={styles.expHeader}>
                    <Text style={[styles.expTitle, { fontSize: 8.5 * sizeMult }]}>
                      {f.diplome}
                      {f.etablissement ? <Text style={{ fontWeight: "normal", color: "#64748b" }}> — {f.etablissement}</Text> : ""}
                    </Text>
                    <Text style={styles.expDate}>{f.annee}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right side col */}
        <View style={styles.sideCol}>
          <View style={styles.section}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {infos.email ? (
              <View>
                <Text style={styles.sidebarLabel}>E-mail</Text>
                <Text style={styles.sidebarValue}>{infos.email}</Text>
              </View>
            ) : null}
            {infos.telephone ? (
              <View>
                <Text style={styles.sidebarLabel}>Téléphone</Text>
                <Text style={styles.sidebarValue}>{infos.telephone}</Text>
              </View>
            ) : null}
            {infos.ville || infos.pays ? (
              <View>
                <Text style={styles.sidebarLabel}>Localisation</Text>
                <Text style={styles.sidebarValue}>
                  {[infos.ville, infos.pays].filter(Boolean).join(", ")}
                </Text>
              </View>
            ) : null}
            {infos.linkedin ? (
              <View>
                <Text style={styles.sidebarLabel}>LinkedIn</Text>
                <Text style={styles.sidebarValue}>{infos.linkedin}</Text>
              </View>
            ) : null}
            {infos.github ? (
              <View>
                <Text style={styles.sidebarLabel}>GitHub</Text>
                <Text style={styles.sidebarValue}>{infos.github}</Text>
              </View>
            ) : null}
            {infos.portfolio ? (
              <View>
                <Text style={styles.sidebarLabel}>Portfolio</Text>
                <Text style={styles.sidebarValue}>{infos.portfolio}</Text>
              </View>
            ) : null}
          </View>

          {cv.competences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sidebarTitle}>Compétences</Text>
              <View style={styles.badgeContainer}>
                {cv.competences.map((c) => (
                  <Text key={c.id} style={styles.badge}>{c.nom}</Text>
                ))}
              </View>
            </View>
          )}

          {cv.langues.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sidebarTitle}>Langues</Text>
              {cv.langues.map((l) => (
                <View key={l.id} style={styles.langRow}>
                  <Text style={{ fontWeight: "bold" }}>{l.nom}</Text>
                  <Text style={{ color: "#64748b", fontSize: 8 * sizeMult }}>{l.niveau}</Text>
                </View>
              ))}
            </View>
          )}

          {cv.interets && cv.interets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sidebarTitle}>Intérêts</Text>
              <View style={styles.badgeContainer}>
                {cv.interets.map((i) => (
                  <Text key={i.id} style={styles.badge}>{i.nom}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footerLine} />
    </Page>
  );
}

// ============================================================================
// MAIN PDF COMPONENT ROUTER
// ============================================================================
export default function CVDocument({ cv }: { cv: CVData }) {
  const templateId = cv.templateId || "ats-classique";

  // Resolve custom color theme
  const themeId = cv.colorTheme || "default";
  const activeTheme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  const accentColor = activeTheme.accent;
  const primaryColor = activeTheme.primary;

  // Resolve font and size
  const fontName = getFontFamily(cv.fontFamily);
  const sizeMult = getFontSizeMultiplier(cv.fontSize);

  return (
    <Document
      title={`CV - ${cv.infos.prenom || "cv"} ${cv.infos.nom || "libre"}`}
      author="CV Libre - Tous droits réservés à INNOVATIK"
    >
      {templateId === "moderne" ? (
        <ModernePDF cv={cv} accentColor={accentColor} primaryColor={primaryColor} fontName={fontName} sizeMult={sizeMult} />
      ) : templateId === "minimaliste" ? (
        <MinimalistePDF cv={cv} accentColor={accentColor} fontName={fontName} sizeMult={sizeMult} />
      ) : templateId === "professionnel" ? (
        <ProfessionnelPDF cv={cv} accentColor={accentColor} fontName={fontName} sizeMult={sizeMult} />
      ) : templateId === "creatif" ? (
        <CreatifPDF cv={cv} accentColor={accentColor} primaryColor={primaryColor} fontName={fontName} sizeMult={sizeMult} />
      ) : (
        <ClassiquePDF cv={cv} accentColor={accentColor} fontName={fontName} sizeMult={sizeMult} />
      )}
    </Document>
  );
}
