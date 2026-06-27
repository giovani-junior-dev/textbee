// Tipagem das mensagens i18n: dá autocomplete e erro de build em chave inexistente.
// Fonte de verdade = pt-BR.json (en.json deve manter paridade de chaves).
import type ptBR from './messages/pt-BR.json'

type Messages = typeof ptBR

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntlMessages extends Messages {}
}

export {}
