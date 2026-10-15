import { en } from "./en";
import { tr } from "./tr";

export type Lang = "en" | "tr";

/** Sözlüğün şekli (EN ana sözlükten türetilir). */
export type Dict = typeof en;

export const dictionaries: Record<Lang, Dict> = { en, tr };

export const DEFAULT_LANG: Lang = "en";
