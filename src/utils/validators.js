const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/

export function validateSignupForm({ name, email, password }) {
  const errors = {}

  if (!name || !name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!email || !EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return errors
}

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email || !email.trim()) {
    errors.email = 'Email is required.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}
