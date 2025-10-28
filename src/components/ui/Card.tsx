'use client';

import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'interactive';
    children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', children, className = '', ...props }, ref) => {
        const variantClasses = {
            default: 'card',
            hover: 'card-hover',
            interactive: 'card-interactive',
        };

        const classes = `${variantClasses[variant]} ${className}`;

        return (
            <div ref={ref} className={classes} {...props}>
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div ref={ref} className={`card-header ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div ref={ref} className={`card-body ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div ref={ref} className={`card-footer ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };