/**
 * Локализация сайта: язык по URL (/privacy-en → en, иначе ru).
 * Используется на страницах с переводами (политика конфиденциальности и т.д.).
 */

import en from './locales/en.json';
import ru from './locales/ru.json';

export type SiteLang = 'ru' | 'en';

type Dict = Record<string, unknown>;

const dicts: Record<SiteLang, Dict> = { ru: ru as Dict, en: en as Dict };

function getLang(): SiteLang {
  if (globalThis.window === undefined) return 'ru';
  const path = globalThis.window.location.pathname;
  return path === '/privacy-en' || path === '/privacy-en/' ? 'en' : 'ru';
}

function getByPath(obj: Dict, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>))
      cur = (cur as Record<string, unknown>)[p];
    else return undefined;
  }
  return cur;
}

/**
 * Возвращает строку по ключу (например privacy.s1Title) для текущего языка.
 */
export function t(key: string): string {
  const lang = getLang();
  const dict = dicts[lang] ?? dicts.ru;
  const raw = getByPath(dict, key);
  return typeof raw === 'string' ? raw : key;
}

export { getLang };
