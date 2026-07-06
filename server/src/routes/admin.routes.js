import { Router } from 'express'
import { sql } from '../db.js'
import { serializeAppointment } from '../serializers.js'
import { asyncHandler } from '../asyncHandler.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

const ALLOWED_STATUSES = ['booked', 'cancelled']

router.get('/appointments', requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.query

  if (status && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
  }

  const rows = await sql(
    `SELECT a.*, d.name AS doctor_name, d.specialty,
            s.slot_date::text AS slot_date, to_char(s.slot_time, 'HH24:MI') AS slot_time
     FROM appointments a
     JOIN doctors d ON d.id = a.doctor_id
     JOIN slots s ON s.id = a.slot_id
     WHERE ($1::text IS NULL OR a.status = $1)
     ORDER BY s.slot_date DESC, s.slot_time DESC`,
    [status || null],
  )

  res.json(rows.map(serializeAppointment))
}))

export default router
