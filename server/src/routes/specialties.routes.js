import { Router } from 'express'
import { sql } from '../db.js'
import { asyncHandler } from '../asyncHandler.js'

const router = Router()

router.get('/', asyncHandler(async (_req, res) => {
  const rows = await sql('SELECT DISTINCT specialty FROM doctors ORDER BY specialty')
  res.json(rows.map((row) => row.specialty))
}))

export default router
