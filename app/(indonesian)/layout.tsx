import "../globals.css";
import { RootShell, siteMetadata, siteViewport } from "../shell";

export const metadata = siteMetadata("id");
export const viewport = siteViewport;

export default function IndonesianLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="id">{children}</RootShell>;
}
