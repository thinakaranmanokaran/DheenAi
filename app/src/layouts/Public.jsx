import React from 'react'
import { Header } from '../components'
import { Outlet } from "react-router-dom";

const Public = () => {
    return (
        <div className='font-inter'>
            <Header />
            <Outlet />
        </div>
    )
}

export default Public