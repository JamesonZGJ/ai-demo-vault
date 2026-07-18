"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

type PasswordFieldProps = {
  id: string
  label: string
  name: string
  autoComplete: "current-password" | "new-password"
  minLength?: number
  describedBy?: string | undefined
  invalid?: boolean
}

export function PasswordField({
  id,
  label,
  name,
  autoComplete,
  minLength,
  describedBy,
  invalid,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input-wrap">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required
        />
        <button
          className="password-toggle"
          type="button"
          aria-label={visible ? `隐藏${label}` : `显示${label}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
