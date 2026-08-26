import { SITE_LOGO, SITE_NAME, SITE_URL } from '@/lib/seo/pages'

const GREEN = '#00AE81'
const TEXT_DARK = '#1a1a1a'
const TEXT_MUTED = '#6b6b6b'
const BORDER = '#e5e5e5'

export interface ConfirmationEmailDetail {
  label: string
  value: string
}

export interface ConfirmationEmailInput {
  greetingName: string
  formTitle: string
  storeName: string
  intro: string
  details?: ConfirmationEmailDetail[]
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildConfirmationEmail({ greetingName, formTitle, storeName, intro, details = [] }: ConfirmationEmailInput) {
  const logoUrl = `${SITE_URL}${SITE_LOGO}`
  const siteLabel = SITE_URL.replace(/^https?:\/\//, '')
  const greeting = greetingName ? `, ${escapeHtml(greetingName)}` : ''

  const detailRows = details
    .map(
      d => `<tr>
        <td style="padding:4px 12px 4px 0;color:${TEXT_MUTED};font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(d.label)}</td>
        <td style="padding:4px 0;color:${TEXT_DARK};font-size:13px;">${escapeHtml(d.value)}</td>
      </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:480px;">
            <tr>
              <td align="center" style="background:${GREEN};padding:28px 24px;">
                <img src="${logoUrl}" alt="${escapeHtml(SITE_NAME)}" height="40" style="height:40px;display:block;border:0;">
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${GREEN};">${escapeHtml(formTitle)}</p>
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:${TEXT_DARK};">Recebemos sua mensagem${greeting}!</h1>
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${TEXT_DARK};">${escapeHtml(intro)}</p>
                ${detailRows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid ${BORDER};padding-top:12px;">${detailRows}</table>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#fafafa;border-top:1px solid ${BORDER};">
                <p style="margin:0;font-size:12px;color:${TEXT_MUTED};">
                  Loja: ${escapeHtml(storeName)} &middot;
                  <a href="${SITE_URL}" style="color:${GREEN};text-decoration:none;">${siteLabel}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    `${formTitle} — ${SITE_NAME}`,
    '',
    `Recebemos sua mensagem${greetingName ? `, ${greetingName}` : ''}!`,
    intro,
    '',
    ...details.map(d => `${d.label}: ${d.value}`),
    '',
    `Loja: ${storeName}`,
    SITE_URL,
  ].join('\n')

  return { html, text }
}
