
import { en } from './en';
import { hi } from './hi';
import { fr } from './fr';
import { de } from './de';

export const translations = {
  en,
  hi,
  fr,
  de
};

export type TranslationKey = keyof typeof en;
