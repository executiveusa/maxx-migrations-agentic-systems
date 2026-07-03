import { forwardRef } from "react";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "block w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Forwarding the ref is required so react-hook-form's register() can bind
// directly to the underlying DOM node — without it, RHF never sees typed
// values and every field reads back as undefined at submit time.
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return <input ref={ref} {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return <textarea ref={ref} {...props} className={`${fieldBase} min-h-[100px] ${props.className ?? ""}`} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select(props, ref) {
    return <select ref={ref} {...props} className={`${fieldBase} ${props.className ?? ""}`} />;
  },
);

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block" {...props}>
      <span className="text-sm font-medium text-text">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
