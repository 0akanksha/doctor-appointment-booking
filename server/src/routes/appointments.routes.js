import { Router } from 'express'
import { sql } from '../db.js'
import { serializeAppointment } from '../serializers.js'
import { asyncHandler } from '../asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const APPOINTMENT_JOIN = `
  JOIN doctors d ON d.id = a.doctor_id
  JOIN slots s ON s.id = a.slot_id
`

function canAccessAppointment(user, appointment) {
  return user.role === 'admin' || appointment.patient_user_id === user.id
}

router.post('/', requireAuth, asyncHandler(async (req, res) => {
  const { doctorId, slotId, notes } = req.body || {}

  if (!doctorId || !slotId) {
    return res.status(400).json({ error: 'doctorId and slotId are required.' })
  }

  const [account] = await sql('SELECT name, email FROM users WHERE id = $1', [req.user.id])

  const [slot] = await sql('SELECT id FROM slots WHERE id = $1 AND doctor_id = $2', [slotId, doctorId])
  if (!slot) return res.status(404).json({ error: 'Doctor or slot not found.' })

  const [booked] = await sql(
    `WITH updated_slot AS (
      UPDATE slots SET is_booked = true
      WHERE id = $1 AND is_booked = false
      RETURNING id, doctor_id, slot_date, slot_time
    ),
    inserted_appointment AS (
      INSERT INTO appointments (doctor_id, slot_id, patient_name, patient_contact, patient_user_id, notes, status)
      SELECT doctor_id, id, $2, $3, $4, $5, 'booked' FROM updated_slot
      RETURNING *
    )
    SELECT ia.*, d.name AS doctor_name, d.specialty,
           us.slot_date::text AS slot_date, to_char(us.slot_time, 'HH24:MI') AS slot_time
    FROM inserted_appointment ia
    JOIN updated_slot us ON us.id = ia.slot_id
    JOIN doctors d ON d.id = ia.doctor_id`,
    [slotId, account.name, account.email, req.user.id, notes?.trim() || ''],
  )

  if (!booked) return res.status(409).json({ error: 'This slot is no longer available.' })

  res.status(201).json(serializeAppointment(booked))
}))

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const rows = await sql(
    `SELECT a.*, d.name AS doctor_name, d.specialty,
            s.slot_date::text AS slot_date, to_char(s.slot_time, 'HH24:MI') AS slot_time
     FROM appointments a
     ${APPOINTMENT_JOIN}
     WHERE a.patient_user_id = $1
     ORDER BY s.slot_date, s.slot_time`,
    [req.user.id],
  )

  res.json(rows.map(serializeAppointment))
}))

router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const [appointment] = await sql(
    `SELECT a.*, d.name AS doctor_name, d.specialty,
            s.slot_date::text AS slot_date, to_char(s.slot_time, 'HH24:MI') AS slot_time
     FROM appointments a
     ${APPOINTMENT_JOIN}
     WHERE a.id = $1`,
    [req.params.id],
  )

  if (!appointment) return res.status(404).json({ error: 'Appointment not found.' })
  if (!canAccessAppointment(req.user, appointment)) {
    return res.status(403).json({ error: 'You do not have permission to view this appointment.' })
  }

  res.json(serializeAppointment(appointment))
}))

router.patch('/:id/cancel', requireAuth, asyncHandler(async (req, res) => {
  const [existingBefore] = await sql(
    'SELECT patient_user_id, status FROM appointments WHERE id = $1',
    [req.params.id],
  )
  if (!existingBefore) return res.status(404).json({ error: 'Appointment not found.' })
  if (!canAccessAppointment(req.user, existingBefore)) {
    return res.status(403).json({ error: 'You do not have permission to cancel this appointment.' })
  }

  const [cancelled] = await sql(
    `WITH cancelled AS (
      UPDATE appointments SET status = 'cancelled'
      WHERE id = $1 AND status = 'booked'
      RETURNING *
    ),
    freed_slot AS (
      UPDATE slots SET is_booked = false
      WHERE id = (SELECT slot_id FROM cancelled)
      RETURNING id, slot_date, slot_time
    )
    SELECT c.*, d.name AS doctor_name, d.specialty,
           fs.slot_date::text AS slot_date, to_char(fs.slot_time, 'HH24:MI') AS slot_time
    FROM cancelled c
    JOIN freed_slot fs ON fs.id = c.slot_id
    JOIN doctors d ON d.id = c.doctor_id`,
    [req.params.id],
  )

  if (cancelled) return res.json(serializeAppointment(cancelled))

  const [existing] = await sql(
    `SELECT a.*, d.name AS doctor_name, d.specialty,
            s.slot_date::text AS slot_date, to_char(s.slot_time, 'HH24:MI') AS slot_time
     FROM appointments a
     ${APPOINTMENT_JOIN}
     WHERE a.id = $1`,
    [req.params.id],
  )

  if (!existing) return res.status(404).json({ error: 'Appointment not found.' })
  res.json(serializeAppointment(existing))
}))

export default router
