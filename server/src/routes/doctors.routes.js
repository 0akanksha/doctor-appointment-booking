import { Router } from 'express'
import { sql } from '../db.js'
import { serializeDoctor, serializeSlot } from '../serializers.js'
import { asyncHandler } from '../asyncHandler.js'

const router = Router()

const SLOT_COLUMNS = `id, doctor_id, slot_date::text AS date, to_char(slot_time, 'HH24:MI') AS time, is_booked`

async function loadSlotsForDoctorIds(doctorIds) {
  if (doctorIds.length === 0) return new Map()

  const rows = await sql(
    `SELECT ${SLOT_COLUMNS} FROM slots WHERE doctor_id = ANY($1::uuid[]) ORDER BY slot_date, slot_time`,
    [doctorIds],
  )

  const byDoctorId = new Map()
  for (const row of rows) {
    if (!byDoctorId.has(row.doctor_id)) byDoctorId.set(row.doctor_id, [])
    byDoctorId.get(row.doctor_id).push(row)
  }
  return byDoctorId
}

router.get('/', asyncHandler(async (req, res) => {
  const { search, specialty } = req.query

  const doctors = await sql(
    `SELECT id, name, specialty, bio, years_experience
     FROM doctors
     WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR specialty = $2)
     ORDER BY name`,
    [search || null, specialty || null],
  )

  const slotsByDoctorId = await loadSlotsForDoctorIds(doctors.map((d) => d.id))
  res.json(doctors.map((doctor) => serializeDoctor(doctor, slotsByDoctorId.get(doctor.id) || [])))
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const [doctor] = await sql(
    'SELECT id, name, specialty, bio, years_experience FROM doctors WHERE id = $1',
    [req.params.id],
  )

  if (!doctor) return res.status(404).json({ error: 'Doctor not found.' })

  const slotsByDoctorId = await loadSlotsForDoctorIds([doctor.id])
  res.json(serializeDoctor(doctor, slotsByDoctorId.get(doctor.id) || []))
}))

router.get('/:id/slots', asyncHandler(async (req, res) => {
  const rows = await sql(
    `SELECT ${SLOT_COLUMNS} FROM slots WHERE doctor_id = $1 AND is_booked = false ORDER BY slot_date, slot_time`,
    [req.params.id],
  )
  res.json(rows.map(serializeSlot))
}))

export default router
