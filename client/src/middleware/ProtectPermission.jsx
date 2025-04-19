import React,{useContext} from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import storeContext from '../context/storeContext'

const ProtectPermission = ({ groupPermission }) => {

    const { store } = useContext(storeContext)
    if (store.group.includes(groupPermission)) {
        return <Outlet />
    } else {
        return <Navigate to='/admin/unable-access' />
    }
}

export default ProtectPermission