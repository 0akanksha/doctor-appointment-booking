import { COOKIE_NAME, verifyToken } from '../auth/tokens.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return res.status(401).json({ error: 'Authentication required.' })

  try {
    const payload = verifyToken(token)
    req.user = { id: payload.userId, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Authentication required.' })
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' })
    next()
  })
}
