import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    "px-4 py-2 rounded-full font-semibold transition-colors duration-300",
    {
        variants: {
            variant: {
                primary: "bg-orange-500 text-white hover:bg-orange-600",
                secondary: "bg-white bg-opacity-20 text-white hover:bg-opacity-30",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant, ...props }) => {
    return (
        <button
            className={buttonVariants({ variant })}
            {...props}
        >
            {children}
        </button>
    );
};
