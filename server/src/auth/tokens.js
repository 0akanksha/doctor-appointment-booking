import jwt from 'jsonwebtoken'
import 'dotenv/config'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.')
}

export const COOKIE_NAME = 'auth_token'
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  }
}
