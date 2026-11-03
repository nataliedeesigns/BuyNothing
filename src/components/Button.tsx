import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "disabled";

interface BaseProps {
  variant?: Variant;
  icon?: string;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const classes = ({ variant = "primary", fullWidth, className }: BaseProps) =>
  ["btn", `btn--${variant}`, fullWidth ? "btn--full" : "", className ?? ""].join(" ").trim();

/** Pill button, 48px tall. Primary = ink fill, Secondary = ink outline, Disabled = neutral fill. */
export function Button({
  variant = "primary",
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const disabled = variant === "disabled";
  return (
    <button
      type="button"
      {...rest}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : rest.onClick}
      className={classes({ variant, fullWidth, className, children })}
    >
      {icon && <Icon src={icon} size={20} />}
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  icon,
  fullWidth,
  className,
  children,
}: BaseProps & { to: string }) {
  return (
    <Link to={to} className={classes({ variant, fullWidth, className, children })}>
      {icon && <Icon src={icon} size={20} />}
      <span>{children}</span>
    </Link>
  );
}
