/**
 * Generic PDF document for all tool outputs.
 *
 * Takes the plain-text output from any tool's generator and renders it
 * as a styled, printable PDF with LexiReview branding.
 *
 * Premium variant adds:
 *   - Custom watermark
 *   - Lawyer-verified seal
 *   - State-specific addendum
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#0f172a",
    lineHeight: 1.6,
  },
  header: {
    borderBottom: "2px solid #2563eb",
    paddingBottom: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
  },
  tagline: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  meta: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "right",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0f172a",
  },
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#1e293b",
  },
  h1: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 8,
    color: "#0f172a",
  },
  h2: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#1e293b",
  },
  h3: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#1e293b",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  listItem: {
    marginBottom: 3,
    paddingLeft: 12,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
    fontSize: 8,
    color: "#94a3b8",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "15%",
    opacity: 0.06,
    fontSize: 64,
    fontWeight: "bold",
    color: "#2563eb",
    transform: "rotate(-30deg)",
  },
  badge: {
    backgroundColor: "#eff6ff",
    padding: "4px 8px",
    fontSize: 8,
    color: "#1e40af",
    alignSelf: "flex-start",
    borderRadius: 4,
    marginBottom: 8,
  },
  verifiedBadge: {
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    padding: "4px 8px",
    fontSize: 8,
    alignSelf: "flex-start",
    borderRadius: 4,
    marginBottom: 8,
  },
  disclaimer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderLeft: "3px solid #2563eb",
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.5,
  },
});

export interface ToolPdfProps {
  title: string;
  content: string; // plain text with \n\n for paragraphs
  toolSlug: string;
  generatedFor?: string; // e.g., user's name or email
  premium?: boolean;
  stateSpecific?: string; // e.g., "Maharashtra"
  disclaimer?: string;
}

// Parse plain text into structured blocks (headings, paragraphs, lists)
function parseContent(text: string): Array<{ type: string; text: string }> {
  const lines = text.split("\n");
  const blocks: Array<{ type: string; text: string }> = [];
  let buffer: string[] = [];
  let bufferType = "paragraph";

  const flush = () => {
    if (buffer.length === 0) return;
    const joined = buffer.join(" ").trim();
    if (joined) blocks.push({ type: bufferType, text: joined });
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flush();
      continue;
    }

    // H1 (# Title or ALL CAPS short line)
    if (line.startsWith("# ")) {
      flush();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }

    // Detect numbered / bulleted list
    if (/^[\d]+\.\s/.test(line) || /^[-*•]\s/.test(line)) {
      flush();
      blocks.push({ type: "listItem", text: line.replace(/^[-*•]\s|^[\d]+\.\s/, "").trim() });
      continue;
    }

    // ALL CAPS short heading (common in legal docs)
    if (line === line.toUpperCase() && line.length > 3 && line.length < 60 && /^[A-Z0-9 \-–:,.&/()]+$/.test(line)) {
      flush();
      blocks.push({ type: "h2", text: line });
      continue;
    }

    buffer.push(line);
  }
  flush();
  return blocks;
}

export function ToolPdfDocument({
  title,
  content,
  toolSlug,
  generatedFor,
  premium = false,
  stateSpecific,
  disclaimer,
}: ToolPdfProps) {
  const blocks = parseContent(content);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title={title}
      author="LexiReview"
      subject={`${title} — generated by LexiReview`}
      creator="LexiReview Tools"
      producer="@react-pdf/renderer"
    >
      <Page size="A4" style={styles.page} wrap>
        {premium && <Text style={styles.watermark}>LEXI</Text>}

        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>LexiReview</Text>
            <Text style={styles.tagline}>AI Contract Intelligence · India</Text>
          </View>
          <View>
            <Text style={styles.meta}>Generated: {today}</Text>
            {generatedFor && <Text style={styles.meta}>For: {generatedFor}</Text>}
            {stateSpecific && <Text style={styles.meta}>State: {stateSpecific}</Text>}
          </View>
        </View>

        {premium ? (
          <Text style={styles.verifiedBadge}>✓ LAWYER-VERIFIED · PREMIUM</Text>
        ) : (
          <Text style={styles.badge}>FREE GENERATED DOCUMENT</Text>
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.body}>
          {blocks.map((b, i) => {
            if (b.type === "h1")
              return (
                <Text key={i} style={styles.h1}>
                  {b.text}
                </Text>
              );
            if (b.type === "h2")
              return (
                <Text key={i} style={styles.h2}>
                  {b.text}
                </Text>
              );
            if (b.type === "h3")
              return (
                <Text key={i} style={styles.h3}>
                  {b.text}
                </Text>
              );
            if (b.type === "listItem")
              return (
                <Text key={i} style={styles.listItem}>
                  • {b.text}
                </Text>
              );
            return (
              <Text key={i} style={styles.paragraph}>
                {b.text}
              </Text>
            );
          })}
        </View>

        <View style={styles.disclaimer}>
          <Text>
            {disclaimer ||
              "DISCLAIMER: This document is an AI-generated template provided by LexiReview for informational purposes only. It is not legal advice. For matters involving significant value or legal complexity, consult a qualified Indian advocate. LexiReview is a product of LexiDraft Technologies."}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>lexireview.in · hello@lexireview.in</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages} · ${toolSlug}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
