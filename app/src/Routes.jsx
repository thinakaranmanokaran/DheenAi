import React from 'react'
import PublicRoutes from './routes/PublicRoutes'
import { BrowserRouter } from 'react-router-dom'

const Routes = () => {
    return (
        <BrowserRouter>
            <PublicRoutes />
        </BrowserRouter>
    )
}

export default Routes