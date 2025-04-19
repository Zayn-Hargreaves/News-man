import { useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './dashboard/layout/MainLayout'
import AdminIndex from './dashboard/pages/AdminIndex'
import Login from './dashboard/pages/Login'
import ProtectDashboard from './middleware/ProtectDashboard'
import ProtectPermission from './middleware/ProtectPermission'
import Unable from './dashboard/pages/Unable'
import Profile from './dashboard/pages/Profile'
import CreateNews from './dashboard/pages/CreateNews'
import storeContext from './context/storeContext'
import Editnews from './dashboard/pages/Editnews'
import Source from './dashboard/pages/Source'
import AddSource from './dashboard/pages/AddSource'
import Comment from './dashboard/pages/Comment'
import Account from './dashboard/pages/Account/Account'
import User from './dashboard/pages/User'
import Category from './dashboard/pages/Category'
import Article from './dashboard/pages/Article'
import Role from './dashboard/pages/Role'
import CreateCategory from './dashboard/pages/Category/CreateCategory'
import CreateRole from './dashboard/pages/CreateRole'
import EditSource from './dashboard/pages/EditSource'
import SourceDetail from './dashboard/pages/DetailSource'
import Permission from './dashboard/pages/Permission'
import EditCategory from './dashboard/pages/Category/EditCategory'
import EditRole from './dashboard/pages/EditRole'
import CreateAccount from './dashboard/pages/Account/CreateAccount'
function App() {

  const { store } = useContext(storeContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin/login' element={<Login />} />
        <Route path='/admin' element={<ProtectDashboard />} >

          <Route path='' element={<MainLayout />}>
            <Route path='unable-access' element={<Unable />} />
            <Route path='dashboard' element={<AdminIndex />} />
            <Route path='profile' element={<Profile />} />
            <Route path='category' element={<Category />} />
            <Route path='category/create' element={<CreateCategory />} />
            <Route path='category/edit/:id' element={<EditCategory />} />

            <Route path='role' element={<Role />} />
            <Route path='role/create' element={<CreateRole />} />
            <Route path='role/edit/:id' element={<EditRole />} />
            <Route path='permission' element={<Permission />} />
            <Route path='' element={<ProtectPermission groupPermission='source' />} >
              <Route path='source' element={<Source />} />
              <Route path='source/detail/:id' element={<SourceDetail />} />
              <Route path='source/edit/:id' element={<EditSource />} /> 
              <Route path='source/create' element={<AddSource />} />
            </Route>

            <Route path='' element={<ProtectPermission groupPermission='comment' />} >
              <Route path='comment' element={<Comment />} />
            </Route>
            <Route path='' element={<ProtectPermission groupPermission='article' />} >
              <Route path='article' element={<Article />} />
              <Route path='article/create' element={<CreateNews />} />
              <Route path='article/edit/:news_id' element={<Editnews/>} />
              <Route path='article/:news_id' element={<CreateNews />} />
            </Route>
            <Route path='' element={<ProtectPermission groupPermission='account' />} >
              <Route path='account' element={<Account />} />
              <Route path='account/create' element={<CreateAccount/>} />
              <Route path='user' element={<User />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
