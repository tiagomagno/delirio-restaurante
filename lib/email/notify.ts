import { prisma } from '@/lib/prisma'
import { getPageContent } from '@/lib/data/content'
import { sendEmail } from './send'
import { buildConfirmationEmail, type ConfirmationEmailDetail } from './templates'

export function parseExtraRecipients(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string' && v.trim() !== '')
}

/**
 * Busca a loja ativa pelo id e retorna nome + lista de destinatários
 * (e-mail principal da loja + destinatários extras cadastrados no admin).
 */
export async function getStoreWithRecipients(storeId: string) {
  const store = await prisma.store.findFirst({ where: { id: storeId, active: true } })
  if (!store) return null

  const recipients = [store.email, ...parseExtraRecipients(store.extraRecipients)]
  return { store, recipients }
}

export async function notifyStore(storeId: string, subject: string, text: string) {
  const result = await getStoreWithRecipients(storeId)
  if (!result) return
  await sendEmail({ to: result.recipients, subject, text })
}

/**
 * Destinatários extras configurados em /admin/pedidos (aba "Destinatários"),
 * recebem todo pedido de Eventos Corporativos além da loja escolhida.
 * Guardado em PageContent (page="eventos-corporativos", key="notify.extraRecipients").
 */
export async function getEventosExtraRecipients(): Promise<string[]> {
  const content = await getPageContent('eventos-corporativos')
  const raw = content['notify.extraRecipients'] ?? ''
  return raw
    .split('\n')
    .map(email => email.trim())
    .filter(Boolean)
}

/**
 * Notifica o canal de Ouvidoria — mensagem anônima, sem loja associada.
 * Sem OUVIDORIA_EMAIL configurado, apenas fica salva no admin (sendEmail já
 * trata a ausência de destinatário/SMTP sem lançar erro).
 */
export async function notifyOuvidoria(text: string) {
  const to = process.env.OUVIDORIA_EMAIL
  if (!to) return
  await sendEmail({ to: [to], subject: 'Nova mensagem — Ouvidoria', text })
}

export interface SendConfirmationInput {
  to: string
  greetingName: string
  formTitle: string
  storeName: string
  storeEmail: string
  intro: string
  details?: ConfirmationEmailDetail[]
}

/**
 * Confirma pro usuário que a mensagem/pedido/candidatura foi recebida.
 * O remetente continua sendo o SMTP_FROM (autenticado) — a loja entra como
 * Reply-To, então uma resposta do usuário vai direto pra loja sem quebrar
 * SPF/DKIM do envio.
 */
export async function sendConfirmationEmail({ to, greetingName, formTitle, storeName, storeEmail, intro, details }: SendConfirmationInput) {
  const { html, text } = buildConfirmationEmail({ greetingName, formTitle, storeName, intro, details })
  await sendEmail({
    to: [to],
    subject: `Recebemos seu contato — ${formTitle}`,
    text,
    html,
    replyTo: storeEmail,
  })
}
