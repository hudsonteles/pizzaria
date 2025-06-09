"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const PageWrapper = ({ children }: Props) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    minHeight: 'inherit'
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
