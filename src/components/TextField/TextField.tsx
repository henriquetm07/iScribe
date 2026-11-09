import { useId, type InputHTMLAttributes } from 'react';
import './TextField.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label above the input */
  label: string;
  /** Helper text below the input */
  hint?: string;
  /** Error message; replaces the hint and marks the field invalid */
  error?: string;
}

export const TextField = ({ label, hint, error, id, ...props }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={`is-field${error ? ' is-field--error' : ''}`}>
      <label className="is-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="is-field__input"
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...props}
      />
      {message && (
        <p id={messageId} className="is-field__message">
          {message}
        </p>
      )}
    </div>
  );
};
