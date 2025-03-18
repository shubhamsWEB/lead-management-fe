import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Checkbox component with optional label
 * 
 * This matches the checkboxes in the lead table for selecting rows
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500',
            className
          )}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={props.id}
            className="ml-2 block text-sm text-gray-700"
          >
            {label}
          </label>
        )}
        
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;