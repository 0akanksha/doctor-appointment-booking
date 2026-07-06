import { generateId } from './idGenerator'

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
    bio: 'Believes in holistic, patient-first care and has a special interest in women\'s health.',
    yearsExperience: 4,
  },
]

const TIME_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00']

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function buildSlotsForDoctor(doctorId) {
  const slots = []
  const today = new Date()

  for (let dayOffset = 1; dayOffset <= 10; dayOffset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)

    // Skip weekends to keep the schedule realistic
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Give each doctor 2 slots per available day
    const timesForDay = [TIME_SLOTS[dayOffset % TIME_SLOTS.length], TIME_SLOTS[(dayOffset + 2) % TIME_SLOTS.length]]

    for (const time of timesForDay) {
      slots.push({
        id: generateId(),
        doctorId,
        date: formatDate(date),
        time,
        isBooked: false,
        appointmentId: null,
      })
    }
  }

  return slots
}

export function buildSeedDoctors() {
  return DOCTOR_TEMPLATES.map((template) => {
    const doctorId = generateId()
    return {
      id: doctorId,
      name: template.name,
      specialty: template.specialty,
      bio: template.bio,
      yearsExperience: template.yearsExperience,
      slots: buildSlotsForDoctor(doctorId),
    }
  })
}
