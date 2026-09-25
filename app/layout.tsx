import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// Archivo (variable width) for engineering-nameplate headlines, IBM Plex Sans
// for reading, IBM Plex Mono only for technical labels. All SIL OFL.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Designing for Forces You Cannot See — Drillstring Design Case Study",
  description:
    "An interactive case study of an undergraduate final project: three drillstring designs for a directional well, checked for tension, torque, drag and buckling by hand calculation and by simulation, then revised.",
  openGraph: {
    title: "Designing for Forces You Cannot See",
    description: "Drillstring design on a directional well — loads, two methods of analysis, and a revised design.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1322",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
