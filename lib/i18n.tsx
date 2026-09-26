"use client";

import { createContext, useContext, type ReactNode } from "react";
import { en, type Dict } from "@/data/i18n/en";
import { id } from "@/data/i18n/id";

// Two statically generated pages: "/" (English) and "/id/" (Bahasa Indonesia).
// The page tells the tree which language it renders; components read their
// words with useDict(). Both dictionaries are small, so both ship.

export type Lang = "en" | "id";
export const LANGS: Lang[] = ["en", "id"];
export const dictionaries: Record<Lang, Dict> = { en, id };

/** Path of each language's page (Next's <Link> adds the base path). */
export const langPath: Record<Lang, string> = { en: "/", id: "/id/" };

/** localStorage key for the visitor's explicit language choice. */
export const LANG_KEY = "ds-lang";

const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useDict() {
  return dictionaries[useContext(LangContext)];
}
