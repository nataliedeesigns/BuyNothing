import { useId } from "react";

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

/** Form field with a persistent visible label, 8px radius, and helper text. */
export function TextAreaField({ label, placeholder, helper, value, onChange, maxLength }: TextAreaFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="t-label">
        {label}
      </label>
      <textarea
        id={id}
        className="field__control t-body"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={`${id}-helper`}
      />
      <p id={`${id}-helper`} className="t-body-small muted field__helper">
        <span>{helper}</span>
        {maxLength !== undefined && value.length > 0 && (
          <span aria-live="polite">
            {value.length}/{maxLength}
          </span>
        )}
      </p>
    </div>
  );
}
