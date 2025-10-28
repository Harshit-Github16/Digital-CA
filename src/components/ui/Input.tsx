'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'error' | 'success';
    inputSize?: 'md' | 'lg';
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ variant = 'default', inputSize = 'md', label, error, helperText, className = '', ...props }, ref) => {
        const variantClasses = {
            default: 'input',
            error: 'input-error',
            success: 'input-success',
        };

        const sizeClasses = {
            md: '',
            lg: 'input-lg',
        };

        const inputClasses = `${variantClasses[variant]} ${sizeClasses[inputSize]} ${className}`;

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-error-600">{error}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-secondary-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;