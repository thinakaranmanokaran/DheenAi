import React from 'react'
import { motion } from 'framer-motion'
import { Caret } from '../components'

const Home = () => {
    return (
        <div className='flex justify-center py-4 items-center h-screen '>
            <div className=' w-3/5  border-x border-x-black/20 h-full'>
                <h1 className='text-5xl font-bold text-center'>Welcome to DheenAI</h1>
                <div className='flex items-center bg-pink-300 min-h-12'>
                    <Caret />
                </div>
            </div>
            <div className='fixed min-h-16 flex items-center bottom-0 z-20 pb-4 w-3/5 bg-light'>
                <input type="text" className='w-full caret-transparent px-8 border rounded-full min-h-16 focus:outline-none ' />
                <div className='absolute z-30 left-8 '>
                    <Caret className=" " />
                </div>
            </div>
        </div>
    )
}

export default Home