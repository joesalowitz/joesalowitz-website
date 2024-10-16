import React from 'react';
import { motion } from 'framer-motion';
import ButtonShimmer from '@/components/ui/button-shimmer';

const Navigation: React.FC = () => {
    const menuItems = ['Work', 'Coaching & Speaking', 'Writing'];

    return (
        <div className="fixed top-4 left-4 right-4 z-10 flex justify-between items-center rounded-2xl p-2 m-2">
            <motion.img
                src="/js_logo-fancy.svg"
                alt="JS Logo"
                className="w-16 h-16 ml-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            />
            <motion.div
                className="flex items-center space-x-6 bg-[#f9f2e9] bg-opacity-80 mix-blend-color-dodge backdrop-blur-md rounded-2xl border border-[#fffcf9] border-opacity-10 p-1 pl-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ul className="hidden md:flex space-x-2 items-center">
                    {menuItems.map((item) => (
                        <li key={item}>
                            <a href="#" className="lora-font relative z-10 text-neutral-700 hover:text-neutral-800 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-neutral-500 hover:bg-opacity-10">
                                {item}
                            </a>
                        </li>
                    ))}
                    <li>
                        <ButtonShimmer>
                            HI@JOESALOWITZ.COM
                        </ButtonShimmer>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
};

export default Navigation;
