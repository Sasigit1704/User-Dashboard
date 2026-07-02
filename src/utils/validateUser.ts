import type { NewUser, User } from "../types/User"

/** Field-keyed validation errors. Empty object == valid. */
export type UserErrors = Partial<Record<keyof NewUser, string>>

const NAME_RE = /^[A-Za-z\s]+$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9]{10}$/
const MIN_PASSWORD_LENGTH = 6

type ValidateOptions = {
  /** Existing users, used to enforce a unique email. */
  existingUsers: User[]
  /** When editing, the id being edited is excluded from the uniqueness check. */
  currentUserId?: number
}

/**
 * Pure validation used by both the Add and Edit flows so the rules can
 * never drift apart. Returns a map of field -> message; an empty map
 * means the form is valid.
 */
export function validateUser(
  values: NewUser,
  { existingUsers, currentUserId }: ValidateOptions
): UserErrors {
  const errors: UserErrors = {}
  const firstName = values.firstName.trim()
  const lastName = values.lastName.trim()
  const email = values.email.trim()

  if (!firstName) {
    errors.firstName = "First name is required."
  } else if (!NAME_RE.test(firstName)) {
    errors.firstName = "First name should contain only letters."
  }

  if (!lastName) {
    errors.lastName = "Last name is required."
  } else if (!NAME_RE.test(lastName)) {
    errors.lastName = "Last name should contain only letters."
  }

  if (!email) {
    errors.email = "Email is required."
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address."
  } else {
    const duplicate = existingUsers.some(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.id !== currentUserId
    )
    if (duplicate) {
      errors.email = "A user with this email already exists."
    }
  }

  if (!PHONE_RE.test(values.phone)) {
    errors.phone = "Phone number must contain exactly 10 digits."
  }

  if (!values.password.trim()) {
    errors.password = "Password is required."
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  return errors
}
