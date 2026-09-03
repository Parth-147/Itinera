import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-soft hover:shadow-elevated',
  secondary:
    'bg-surface-100 text-surface-800 hover:bg-surface-200 active:bg-surface-300 border border-surface-200',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft hover:shadow-elevated',
  ghost:
    'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-800',
  danger:
    'bg-danger text-white hover:bg-red-600 active:bg-red-700 shadow-soft',
  outline:
    'bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 hover:border-primary-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
  xl: 'px-9 py-4 text-lg gap-3',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        cursor-pointer select-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && (
        <IconRight className="h-4 w-4 shrink-0" />
      )}
    </button>
  );
});

export default Button;
