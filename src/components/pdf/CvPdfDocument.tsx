import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CvData, CvThemeSettings } from "../../types";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  title: { fontSize: 11, color: "#475569", marginBottom: 8 },
  contact: { fontSize: 9, color: "#64748b", marginBottom: 16 },
  section: { marginTop: 12, marginBottom: 4 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 3,
    marginBottom: 6,
  },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  itemMeta: { fontSize: 9, color: "#64748b", marginBottom: 2 },
  bullet: { marginLeft: 10, marginBottom: 2 },
  summary: { lineHeight: 1.4, marginBottom: 4 },
});

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const CvPdfDocument: React.FC<Props> = ({ data, theme }) => {
  const p = data.personalInfo;
  const accent = theme.primaryColor || "#1e293b";

  return (
    <Document title={`CV — ${p.fullName || "TempleoCV"}`}>
      <Page size="A4" style={styles.page}>
        <Text style={[styles.name, { color: accent }]}>
          {p.fullName || "Nombre"}
        </Text>
        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.contact}>
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(" · ")}
        </Text>

        {data.summary ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accent }]}>Resumen</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        ) : null}

        {data.experience?.length ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accent }]}>
              Experiencia
            </Text>
            {data.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>
                  {exp.title} — {exp.company}
                </Text>
                <Text style={styles.itemMeta}>
                  {exp.startDate} – {exp.current ? "Actualidad" : exp.endDate}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Text>
                {exp.bullets?.map((b, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {data.education?.length ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accent }]}>
              Educación
            </Text>
            {data.education.map((ed) => (
              <View key={ed.id} style={{ marginBottom: 6 }}>
                <Text style={styles.itemTitle}>
                  {ed.degree} {ed.fieldOfStudy}
                </Text>
                <Text style={styles.itemMeta}>
                  {ed.institution}
                  {ed.location ? ` · ${ed.location}` : ""} · {ed.startDate} –{" "}
                  {ed.current ? "Actualidad" : ed.endDate}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.skillCategories?.length ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: accent }]}>
              Skills
            </Text>
            {data.skillCategories.map((cat) => (
              <Text key={cat.id} style={{ marginBottom: 3 }}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  {cat.categoryName}:{" "}
                </Text>
                {cat.skills?.join(", ")}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
};

export async function downloadCvPdf(data: CvData, theme: CvThemeSettings) {
  const { pdf } = await import("@react-pdf/renderer");
  const blob = await pdf(<CvPdfDocument data={data} theme={theme} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.personalInfo.fullName || "CV").replace(/\s+/g, "_")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
