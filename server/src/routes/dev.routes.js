import { Router } from 'express'
import { runSeed, upsertAdminUser } from '../../db/seedLogic.js'
import { asyncHandler } from '../asyncHandler.js'

const router = Router()

router.post('/reset', asyncHandler(async (_req, res) => {
  await runSeed()
  await upsertAdminUser()
  res.status(204).end()
}))

export default router
