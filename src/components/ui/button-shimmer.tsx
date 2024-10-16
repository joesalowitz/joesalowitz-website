import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonShimmerProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const ButtonShimmer: React.FC<ButtonShimmerProps> = ({
    children,
    className,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "",
                className
            )}
        >
            <div className="absolute inset-0 dark:bg-dot-white/[0.1] bg-dot-black/[0.1]" />
            <div className="relative z-40 w-auto text-sm inline-flex animate-shimmer items-center justify-center border border-amber-400 bg-[linear-gradient(110deg,#f59e0b,25%,#fbbf24,65%,#f59e0b)] bg-[length:200%_100%]  px-6 py-4 rounded-xl font-medium text-amber-900
                transition-all 
                hover:border-amber-300 hover:shadow-md hover:shadow-amber-200/50
                active:bg-[linear-gradient(110deg,#f59e0b,25%,#fbbf24,65%,#f59e0b)]
                active:border-amber-400 active:shadow-inner active:shadow-amber-400/20
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-amber-50
                group-hover:scale-[1.02] group-active:scale-[0.98]
                cursor-pointer
            ">{children}</div>
        </div>
    );
};

export default ButtonShimmer;
