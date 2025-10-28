'use client';

import { forwardRef } from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    children: React.ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = 'primary', children, className = '', ...props }, ref) => {
        const variantClasses = {
            primary: 'badge-primary',
            secondary: 'badge-secondary',
            success: 'badge-success',
            warning: 'badge-warning',
            error: 'badge-error',
        };

        const classes = `badge ${variantClasses[variant]} ${className}`;

        return (
            <span ref={ref} className={classes} {...props}>
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;