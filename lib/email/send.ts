import nodemailer from 'nodemailer'

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transporter
}

export interface SendEmailInput {
  to: string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

/**
 * Envia e-mail via SMTP. Se as variáveis SMTP_* não estiverem configuradas,
 * apenas registra um aviso — evita quebrar o envio do formulário em ambientes
 * sem e-mail configurado (ex: dev local sem credenciais).
 */
export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailInput) {
  const recipients = to.filter(Boolean)
  if (recipients.length === 0) return

  const client = getTransporter()
  if (!client) {
    console.warn(`[email] SMTP não configurado — e-mail "${subject}" não enviado para ${recipients.join(', ')}`)
    return
  }

  try {
    await client.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients,
      replyTo,
      subject,
      text,
      html,
    })
  } catch (err) {
    console.error('[email] Falha ao enviar e-mail:', err)
  }
}
