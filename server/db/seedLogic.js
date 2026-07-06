import bcrypt from 'bcryptjs'
import { sql } from '../src/db.js'

const DOCTOR_TEMPLATES = [
  {
    name: 'Dr. Ayesha Khan',
    specialty: 'Cardiology',
    bio: 'Specializes in heart health, hypertension management, and preventive cardiology with over a decade of clinical experience.',
    yearsExperience: 12,
  },
  {
    name: 'Dr. Marcus Lee',
    specialty: 'Dermatology',
    bio: 'Focused on skin conditions, acne treatment, and cosmetic dermatology, helping patients feel confident in their skin.',
    yearsExperience: 8,
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Pediatrics',
    bio: 'Passionate about childhood development and family-centered care, from newborns through adolescence.',
    yearsExperience: 15,
  },
  {
    name: 'Dr. James Whitfield',
    specialty: 'Orthopedics',
    bio: 'Treats sports injuries, joint pain, and musculoskeletal conditions with a focus on minimally invasive care.',
    yearsExperience: 10,
  },
  {
    name: 'Dr. Sofia Rossi',
    specialty: 'General Practice',
    bio: 'A trusted family physician providing routine checkups, preventive care, and chronic condition management.',
    yearsExperience: 6,
  },
  {
    name: 'Dr. Daniel Osei',
    specialty: 'Psychiatry',
    bio: 'Provides compassionate mental health care, specializing in anxiety, depression, and stress management.',
    yearsExperience: 9,
  },
  {
    name: 'Dr. Emily Carter',
    specialty: 'General Practice',
    bio: "Believes in holistic, patient-first care and has a special interest in women's health.",
    yearsExperience: 4,
  },
]

const TIME_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00']

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function buildSlotsForDoctor() {
  const slots = []
  const today = new Date()

  for (let dayOffset = 1; dayOffset <= 10; dayOffset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)

    if (date.getDay() === 0 || date.getDay() === 6) continue

    const timesForDay = [
      TIME_SLOTS[dayOffset % TIME_SLOTS.length],
      TIME_SLOTS[(dayOffset + 2) % TIME_SLOTS.length],
    ]

    for (const time of timesForDay) {
      slots.push({ date: formatDate(date), time })
    }
  }

  return slots
}

export async function runSeed() {
  await sql('DELETE FROM appointments')
  await sql('DELETE FROM slots')
  await sql('DELETE FROM doctors')

  for (const template of DOCTOR_TEMPLATES) {
    const [doctor] = await sql(
      `INSERT INTO doctors (name, specialty, bio, years_experience)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [template.name, template.specialty, template.bio, template.yearsExperience],
    )

    const slots = buildSlotsForDoctor()
    for (const slot of slots) {
      await sql(
        `INSERT INTO slots (doctor_id, slot_date, slot_time)
         VALUES ($1, $2, $3)`,
        [doctor.id, slot.date, slot.time],
      )
    }
  }

  console.log(`Seeded ${DOCTOR_TEMPLATES.length} doctors with their available slots.`)
}

export async function upsertAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin user upsert.')
    return
  }

  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(password, 10)

  await sql(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Admin', $1, $2, 'admin')
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = 'admin'`,
    [normalizedEmail, passwordHash],
  )

  console.log(`Admin user ensured for ${normalizedEmail}.`)
}
