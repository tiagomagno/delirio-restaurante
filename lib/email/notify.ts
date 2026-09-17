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

async function getPageExtraRecipients(page: string): Promise<string[]> {
  const content = await getPageContent(page)
  const raw = content['notify.extraRecipients'] ?? ''
  return raw
    .split('\n')
    .map(email => email.trim())
    .filter(Boolean)
}

/**
 * Destinatários extras configurados em /admin/contatos (aba "Destinatários"),
 * recebem toda mensagem do Fale Conosco além da loja escolhida.
 * Guardado em PageContent (page="fale-conosco", key="notify.extraRecipients").
 */
export async function getFaleConoscoExtraRecipients(): Promise<string[]> {
  return getPageExtraRecipients('fale-conosco')
}

/**
 * Destinatários extras configurados em /admin/candidaturas (aba "Destinatários"),
 * recebem toda candidatura do Trabalhe Conosco além da loja escolhida.
 * Guardado em PageContent (page="trabalhe-conosco", key="notify.extraRecipients").
 */
export async function getTrabalheConoscoExtraRecipients(): Promise<string[]> {
  return getPageExtraRecipients('trabalhe-conosco')
}

/**
 * Destinatários configurados em /admin/ouvidoria (aba "Destinatários").
 * Guardado em PageContent (page="ouvidoria", key="notify.extraRecipients").
 */
export async function getOuvidoriaRecipients(): Promise<string[]> {
  return getPageExtraRecipients('ouvidoria')
}

/**
 * Notifica o canal de Ouvidoria — mensagem anônima, sem loja associada.
 * Destinatários vêm do admin (/admin/ouvidoria) somados à OUVIDORIA_EMAIL,
 * se configurada. Sem nenhum dos dois, a mensagem só fica salva no admin.
 */
export async function notifyOuvidoria(text: string) {
  const envRecipient = process.env.OUVIDORIA_EMAIL
  const to = Array.from(new Set([...(await getOuvidoriaRecipients()), ...(envRecipient ? [envRecipient] : [])]))
  if (to.length === 0) return
  await sendEmail({ to, subject: 'Nova mensagem — Ouvidoria', text })
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
