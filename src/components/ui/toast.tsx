import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Toast = ({
    message,
    open,
    onOpenChange,
}: {
    message: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                        "fixed bottom-[30px] left-1/2 transform -translate-x-1/2 z-50",
                        "bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg",
                        "border border-gray-200 dark:border-gray-700"
                    )}
                >
                    <div className="flex items-center space-x-2">
                        <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {message}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
