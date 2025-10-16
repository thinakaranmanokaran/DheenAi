import React from 'react'
import { motion } from "framer-motion";

const Caret = ({ className }) => {
    return (
        <motion.div
            className={`w-[2px] bg-black ${className}`}
            initial={{ height: 0 }}
            animate={{ height: [0, 28, 0] }} // loop between 0 → 40 → 0
            transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 0.2,
                ease: "easeInOut"
            }}
        />
    )
}

export default Caret