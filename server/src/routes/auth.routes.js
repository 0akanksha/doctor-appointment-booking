import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { sql } from '../db.js'
import { asyncHandler } from '../asyncHandler.js'
import { signToken, cookieOptions, COOKIE_NAME } from '../auth/tokens.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/

function respondWithUser(res, status, user) {
  const token = signToken(user)
  res.cookie(COOKIE_NAME, token, cookieOptions())
  res.status(status).json({ id: user.id, name: user.name, email: user.email, role: user.role })
}

router.post('/signup', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name?.trim() || !EMAIL_PATTERN.test(email?.trim() || '') || !password || password.length < 8) {
    return res.status(400).json({
      error: 'A valid name, email, and a password of at least 8 characters are required.',
    })
  }

  const normalizedEmail = email.trim().toLowerCase()

  const [existing] = await sql('SELECT id FROM users WHERE email = $1', [normalizedEmail])
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })

  const passwordHash = await bcrypt.hash(password, 10)
  const [user] = await sql(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'patient')
     RETURNING id, name, email, role`,
    [name.trim(), normalizedEmail, passwordHash],
  )

  respondWithUser(res, 201, user)
}))

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {}
  const normalizedEmail = (email || '').trim().toLowerCase()

  const [user] = await sql(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [normalizedEmail],
  )

  const passwordMatches = user ? await bcrypt.compare(password || '', user.password_hash) : false
  if (!user || !passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  respondWithUser(res, 200, user)
}))

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions())
  res.status(204).end()
})

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const [user] = await sql('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id])
  if (!user) return res.status(401).json({ error: 'Authentication required.' })
  res.json(user)
}))

export default router
