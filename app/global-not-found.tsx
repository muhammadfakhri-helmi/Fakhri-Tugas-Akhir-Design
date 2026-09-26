import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { RootShell, siteViewport } from "./shell";
import { en } from "@/data/i18n/en";
import { id } from "@/data/i18n/id";

export const metadata: Metadata = {
  title: `404 — ${en.meta.title}`,
};
export const viewport = siteViewport;

// Served by GitHub Pages for any unknown URL, in both languages.
export default function GlobalNotFound() {
  return (
    <RootShell lang="en">
      <main className="mx-auto flex min-h-[100svh] max-w-[720px] flex-col justify-center gap-10 px-6 py-16">
        <svg width="36" height="44" viewBox="0 0 18 22" aria-hidden="true">
          <path d="M3 1 V9 A9 9 0 0 0 6 15 L12 21" fill="none" stroke="var(--flow)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <section>
          <p className="label text-flow">404</p>
          <h1 className="h2 mt-3">This page is off the well path.</h1>
          <p className="prose-body mt-3 text-muted">The page you asked for does not exist. The case study starts here:</p>
          <Link href="/" hrefLang="en" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-flow px-5 font-medium text-bg">
            {en.meta.title}
          </Link>
        </section>
        <section lang="id" className="border-t border-line pt-10">
          <h2 className="h3">Halaman ini berada di luar lintasan sumur.</h2>
          <p className="prose-body mt-3 text-muted">Halaman yang Anda cari tidak ada. Studi kasusnya dimulai di sini:</p>
          <Link href="/id/" hrefLang="id" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-line-strong px-5 text-ink">
            {id.meta.title}
          </Link>
        </section>
      </main>
    </RootShell>
  );
}
