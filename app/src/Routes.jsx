import React from 'react'
import PublicRoutes from './routes/PublicRoutes'
import { BrowserRouter } from 'react-router-dom'

const Routes = () => {
    return (
        <BrowserRouter basename="/DheenAi/">
            <PublicRoutes />
        </BrowserRouter>
    )
}

export default Routes