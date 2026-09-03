import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  label,
}) {
  const [hovered, setHovered] = useState(0);
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-surface-700 mb-1.5">{label}</p>
      )}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= (hovered || value);
          return (
            <button
              key={i}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => !readonly && setHovered(starValue)}
              onMouseLeave={() => !readonly && setHovered(0)}
              className={`${readonly ? '' : 'cursor-pointer'} transition-colors`}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${iconSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-surface-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
