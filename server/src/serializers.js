export function serializeSlot(row) {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    date: row.date,
    time: row.time,
    isBooked: row.is_booked,
    appointmentId: null,
  }
}

export function serializeDoctor(row, slots = []) {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty,
    bio: row.bio,
    yearsExperience: row.years_experience,
    slots: slots.map(serializeSlot),
  }
}

export function serializeAppointment(row) {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    slotId: row.slot_id,
    patientName: row.patient_name,
    patientContact: row.patient_contact,
    patientUserId: row.patient_user_id,
    status: row.status,
    createdAt: row.created_at,
    notes: row.notes,
    doctorName: row.doctor_name,
    specialty: row.specialty,
    slotDate: row.slot_date,
    slotTime: row.slot_time,
  }
}
