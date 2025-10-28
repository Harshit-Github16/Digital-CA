'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', loading = false, children, className = '', disabled, ...props }, ref) => {
        const baseClasses = 'btn';
        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            ghost: 'btn-ghost',
            success: 'btn-success',
            warning: 'btn-warning',
            error: 'btn-error',
        };
        const sizeClasses = {
            sm: 'btn-sm',
            md: 'btn-md',
            lg: 'btn-lg',
        };

        const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;