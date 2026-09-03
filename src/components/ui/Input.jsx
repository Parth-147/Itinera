import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-surface-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-surface-900
            placeholder:text-surface-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-60
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-danger focus:ring-danger/20 focus:border-danger'
              : 'border-surface-200 hover:border-surface-300'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}
    </div>
  );
});

export default Input;
