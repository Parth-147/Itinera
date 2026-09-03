import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', id, ...props },
  ref,
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`
          w-full rounded-lg border bg-white px-4 py-3 text-sm text-surface-900
          placeholder:text-surface-400 resize-y min-h-[100px]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          disabled:bg-surface-100 disabled:cursor-not-allowed
          ${error ? 'border-danger' : 'border-surface-200 hover:border-surface-300'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-500">{hint}</p>}
    </div>
  );
});

export default Textarea;
