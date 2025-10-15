import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { History, Home } from '../pages'
import { Public } from '../layouts'

const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Public />} >
                <Route index element={<Home />} />
                <Route path="history" element={<History />} />
            </Route>
        </Routes>
    )
}

export default PublicRoutes