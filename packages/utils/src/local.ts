import { getProperty } from 'js-cool'
import { type Language } from './types'

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export interface LocaleContext {
	locale: Language
	lang: string
	t: Translator
}

export const translate = (
	path: string,
	option: undefined | TranslatorOption,
	locale: Language
): string =>
	(getProperty(locale, path, path) as string).replace(
		/\{(\w+)\}/g,
		(_, key) => `${option?.[key] ?? `{${key}}`}`
	)

export const buildTranslator =
	(locale: Language): Translator =>
	(path, option) =>
		translate(path, option, locale)

export function useLocale(locale: Language) {
	const lang = locale.name
	return {
		lang,
		locale,
		t: buildTranslator(locale)
	} as LocaleContext
}
