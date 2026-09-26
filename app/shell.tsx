import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { en } from "@/data/i18n/en";
import { id } from "@/data/i18n/id";

// Shared pieces of the two root layouts: "/" (English) and "/id/" (Indonesian).
// Two root layouts let each page ship the right <html lang> in its static HTML.

// Archivo (variable width) for engineering-nameplate headlines, IBM Plex Sans
// for reading, IBM Plex Mono only for technical labels. All SIL OFL.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

const dictionaries = { en, id };
type Lang = keyof typeof dictionaries;

export function siteMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang];
  const other = lang === "en" ? id : en;
  return {
    title: t.meta.pageTitle,
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.ogDescription,
      type: "website",
      locale: t.ogLocale,
      alternateLocale: [other.ogLocale],
    },
  };
}

export const siteViewport: Viewport = {
  themeColor: "#0a1322",
  colorScheme: "dark",
};

export function RootShell({ lang, head, children }: { lang: Lang; head?: ReactNode; children: ReactNode }) {
  return (
    <html lang={dictionaries[lang].htmlLang} className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      {head && <head>{head}</head>}
      <body>{children}</body>
    </html>
  );
}
