import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'admin_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 dias

function getSecretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET não configurada')
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  sub: string
  email: string
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null
    return { sub: payload.sub, email: payload.email }
  } catch {
    return null
  }
}
