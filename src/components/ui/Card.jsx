const variants = {
  default: 'bg-white border border-surface-200 shadow-card',
  flat: 'bg-surface-50',
  elevated: 'bg-white shadow-elevated',
  outlined: 'bg-transparent border border-surface-200',
  glass: 'bg-white/60 backdrop-blur-md border border-white/30 shadow-card',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        rounded-xl
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? 'transition-all duration-300 ease-out hover:shadow-elevated hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
