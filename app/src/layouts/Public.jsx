import React from 'react'
import { Header } from '../components'
import { Outlet } from "react-router-dom";

const Public = () => {
    return (
        <div className='font-inter bg-light'>
            <Header />
            <div className='md:pt-16'>
                <Outlet />
            </div>
        </div>
    )
}

export default Public