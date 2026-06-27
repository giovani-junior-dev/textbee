export const locales = ['pt-BR', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt-BR'

// Cookie lido pelo request config + gravado pelo language-switcher.
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}
