import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from './session-edge'
export type { SessionPayload } from './session-edge'
