const variants = {
  default: 'bg-surface-100 text-surface-700',
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-800',
  success: 'bg-success-light text-emerald-700',
  warning: 'bg-warning-light text-amber-800',
  danger: 'bg-danger-light text-red-700',
  info: 'bg-info-light text-blue-700',
  outline: 'bg-transparent border border-surface-300 text-surface-600',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}
