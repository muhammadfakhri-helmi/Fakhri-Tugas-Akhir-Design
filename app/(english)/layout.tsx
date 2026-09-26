import "../globals.css";
import { RootShell, siteMetadata, siteViewport } from "../shell";

export const metadata = siteMetadata("en");
export const viewport = siteViewport;

// "/" is the English page and also the entry URL people share. A reader who
// explicitly chose Bahasa Indonesia before is sent to "/id/" before first paint.
const base = process.env.BASE_PATH ?? "";
const rememberLanguage = `try{if(localStorage.getItem("ds-lang")==="id")location.replace(${JSON.stringify(`${base}/id/`)}+location.hash)}catch(e){}`;

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootShell lang="en" head={<script dangerouslySetInnerHTML={{ __html: rememberLanguage }} />}>
      {children}
    </RootShell>
  );
}
