import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import storeContext from '../context/storeContext'
import { getCookie } from '../utils/token.utils'

const ProtectDashboard = () => {

    const refreshToken = getCookie("refreshToken")
    if (!refreshToken) {
        return <Navigate to='/admin/login' />
    } else {
        return <Outlet />
    }

}

export default ProtectDashboard