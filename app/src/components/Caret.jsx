import React from 'react'
import { motion } from "framer-motion";

const Caret = ({ className, position }) => {
    return (
        <motion.div
            className={`w-[1px] bg-black ${className}`}
            initial={{ height: 0, x: 0 }}
            animate={{ height: [0, 28, 0], x: position }} // loop between 0 → 40 → 0
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