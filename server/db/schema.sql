CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS doctors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  specialty         TEXT NOT NULL,
  bio               TEXT NOT NULL DEFAULT '',
  years_experience  INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors (specialty);

CREATE TABLE IF NOT EXISTS slots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date   DATE NOT NULL,
  slot_time   TIME NOT NULL,
  is_booked   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, slot_date, slot_time)
);

CREATE INDEX IF NOT EXISTS idx_slots_doctor_id ON slots (doctor_id);
CREATE INDEX IF NOT EXISTS idx_slots_doctor_available ON slots (doctor_id, is_booked);

CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id         UUID NOT NULL REFERENCES doctors(id),
  slot_id           UUID NOT NULL REFERENCES slots(id),
  patient_name      TEXT NOT NULL,
  patient_contact   TEXT NOT NULL,
  patient_user_id   UUID NULL,
  status            TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled')),
  notes             TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_slot_id ON appointments (slot_id);

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_patient_user_id_fkey'
  ) THEN
    ALTER TABLE appointments
      ADD CONSTRAINT appointments_patient_user_id_fkey
      FOREIGN KEY (patient_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DROP INDEX IF EXISTS idx_appointments_patient_lookup;
