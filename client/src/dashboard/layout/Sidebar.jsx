import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiFillDashboard, AiOutlinePlus } from 'react-icons/ai'
import { ImProfile } from 'react-icons/im'
import { BiNews } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { FaPlus, FaNewspaper, FaComment, FaRegUser, FaCriticalRole } from "react-icons/fa";
import storeContext from '../../context/storeContext'
import { IoLogOutOutline } from "react-icons/io5";
import { deleteCookie, getCookie } from '../../utils/token.utils'
import axios from 'axios'
import { MdCategory } from 'react-icons/md'
const Sidebar = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { store, dispatch } = useContext(storeContext)

    const logout = async () => {
        const refreshToken = getCookie("refreshToken")
        try {
            await axios.post("/api/logout", { refreshToken });
            deleteCookie("accessToken")
            deleteCookie("refreshToken")
            deleteCookie("privateKey")
            dispatch({ type: 'logout', payload: '' })
            navigate('/login')
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Failed to logout. Please try again.");
        }
    }
    return (
        <div className='w-[250px] h-screen fixed left-0 top-0 bg-white'>
            <div className='h-[70px] flex justify-center items-center'>
                <Link to='/'>
                    <img className='w-[190px] h-[35px]' src="../../../public/logo.png" alt="" />
                </Link>
            </div>
            <ul className='px-3 flex flex-col gap-y-1 font-medium'>

                <li>
                    <Link to='/admin/dashboard' className={`px-3 ${pathname === '/admin/dashboard' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><AiFillDashboard /></span>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/source' className={`px-3 ${pathname === '/admin/source' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><FaNewspaper /></span>
                        <span>Source</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/category' className={`px-3 ${pathname === '/admin/category' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><MdCategory /></span>
                        <span>Category</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/article' className={`px-3 ${pathname === '/admin/article' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><BiNews /></span>
                        <span>Article</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/comment' className={`px-3 ${pathname === '/admin/comment' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><FaComment /></span>
                        <span>Comment</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/role' className={`px-3 ${pathname === '/admin/role' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><FaCriticalRole /></span>
                        <span>Role</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/account' className={`px-3 ${pathname === '/admin/account' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><FiUsers /></span>
                        <span>Account</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/user' className={`px-3 ${pathname === '/admin/user' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><FaRegUser /></span>
                        <span>User</span>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/permission' className={`px-3 ${pathname === '/admin/premission' ? 'bg-indigo-500 text-white' : 'bg-white text-[#404040f6]'} py-2 hover:shadow-lg hover:shadow-indigo-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`}>
                        <span className='text-xl'><ImProfile /></span>
                        <span>Permission</span>
                    </Link>
                </li>
                <li>
                    <div onClick={logout} className={`px-3  py-2 hover:shadow-lg hover:shadow-red-500/20 w-full rounded-sm flex gap-x-2 justify-start items-center hover:bg-red-500 hover:text-white cursor-pointer`}>
                        <span className='text-xl'><IoLogOutOutline /></span>
                        <span>Logout</span>
                    </div>
                </li>

            </ul>
        </div>
    )
}

export default Sidebar