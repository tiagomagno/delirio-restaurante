import { prisma } from '@/lib/prisma'
import { sendEmail } from './send'

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
