import { useId, type ReactNode } from "react";
import { icons } from "../assets";
import { Icon } from "./Icon";

interface FieldShellProps {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: string;
  children: ReactNode;
}

/** Form field with a persistent visible label (never placeholder-only) and helper text. */
function FieldShell({ id, label, helper, error, children }: FieldShellProps) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id} className="t-label">
        {label}
      </label>
      {children}
      {(error || helper) && (
        <p id={`${id}-helper`} className="t-body-small muted field__helper" role={error ? "alert" : undefined}>
          {error ?? helper}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
}

export function TextAreaField({ label, placeholder, helper, value, onChange, maxLength, error }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      helper={
        <>
          <span>{helper}</span>
          {maxLength !== undefined && value.length > 0 && (
            <span aria-live="polite">
              {value.length}/{maxLength}
            </span>
          )}
        </>
      }
    >
      <textarea
        id={id}
        className="field__control field__control--area t-body"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-helper`}
        aria-invalid={error ? true : undefined}
      />
    </FieldShell>
  );
}

interface TextFieldProps {
  label: string;
  placeholder: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TextField({ label, placeholder, helper, value, onChange, error }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} helper={helper} error={error}>
      <input
        id={id}
        className="field__control t-body"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={helper || error ? `${id}-helper` : undefined}
        aria-invalid={error ? true : undefined}
      />
    </FieldShell>
  );
}

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  helper?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
}

export function SelectField({ label, placeholder, helper, value, options, onChange, error }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} helper={helper} error={error}>
      <div className="field__select">
        <select
          id={id}
          className={`field__control t-body ${value ? "" : "is-placeholder"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={helper || error ? `${id}-helper` : undefined}
          aria-invalid={error ? true : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon src={icons.chevronDown} size={24} className="field__chevron" />
      </div>
    </FieldShell>
  );
}
