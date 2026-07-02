import { useState } from "react"
import type { NewUser, User } from "../types/User"
import { validateUser, type UserErrors } from "../utils/validateUser"

const EMPTY_FORM: NewUser = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
}

type Props = {
  title: string
  /** Existing users, used for the unique-email check. */
  users: User[]
  /** When editing, the record being edited (id preserved on save). */
  initialUser?: User | null
  onCancel: () => void
  onSubmit: (values: NewUser) => void
}

type Field = {
  name: keyof NewUser
  label: string
  type?: string
}

const FIELDS: Field[] = [
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone Number" },
  { name: "password", label: "Password", type: "password" },
]

/**
 * Single modal used for both "Add" and "Edit" so validation and markup
 * stay in one place. Inline, field-level errors replace blocking alerts.
 */
export default function UserFormModal({
  title,
  users,
  initialUser,
  onCancel,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<NewUser>(
    initialUser
      ? {
          firstName: initialUser.firstName,
          lastName: initialUser.lastName,
          email: initialUser.email,
          phone: initialUser.phone,
          password: initialUser.password,
        }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState<UserErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const setField = (name: keyof NewUser, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear a field's error as the user edits it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const handleSubmit = () => {
    const nextErrors = validateUser(values, {
      existingUsers: users,
      currentUserId: initialUser?.id,
    })

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
    })
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
      onClick={onCancel}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 id="user-form-title">{title}</h3>

        {FIELDS.map(({ name, label, type }) => {
          const inputId = `user-${name}`
          const errorId = `${inputId}-error`
          const isPassword = name === "password"
          const inputType = isPassword
            ? showPassword
              ? "text"
              : "password"
            : type ?? "text"

          return (
            <div className="form-field" key={name}>
              <label htmlFor={inputId}>{label}:</label>
              <input
                id={inputId}
                type={inputType}
                value={values[name]}
                placeholder={label}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? errorId : undefined}
                onChange={(e) => setField(name, e.target.value)}
              />

              {isPassword && (
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}

              {errors[name] && (
                <span id={errorId} className="field-error" role="alert">
                  {errors[name]}
                </span>
              )}
            </div>
          )
        })}

        <div className="modal-actions">
          <button type="button" onClick={handleSubmit}>
            Save
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
