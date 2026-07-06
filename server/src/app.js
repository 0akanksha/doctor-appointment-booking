import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'
import doctorsRouter from './routes/doctors.routes.js'
import specialtiesRouter from './routes/specialties.routes.js'
import appointmentsRouter from './routes/appointments.routes.js'
import devRouter from './routes/dev.routes.js'
import authRouter from './routes/auth.routes.js'
import adminRouter from './routes/admin.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const distDir = path.join(projectRoot, 'dist')

export async function createApp() {
  const isProduction = process.env.NODE_ENV === 'production'
  const app = express()

  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/auth', authRouter)
  app.use('/api/doctors', doctorsRouter)
  app.use('/api/specialties', specialtiesRouter)
  app.use('/api/appointments', appointmentsRouter)
  app.use('/api/admin', adminRouter)
  if (!isProduction) {
    app.use('/api/dev', devRouter)
  }
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))

  if (isProduction) {
    app.use(express.static(distDir))
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'))
    })
  } else {
    const { createServer } = await import('vite')
    const vite = await createServer({
      root: projectRoot,
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  }

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error.' })
  })

  return app
}
