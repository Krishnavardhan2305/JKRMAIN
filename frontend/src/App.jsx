import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import React from 'react'
import AdminHome from './pages/AdminHome'
import { Toaster } from 'react-hot-toast'
import AdminLogin from './pages/AdminLogin'
import AddClient from './pages/AddClient'
import Home from './pages/Home'
import ClientMhome from './pages/ClientMhome'
import ClientVHome from './pages/ClientVHome'
import AddVolunteer from './pages/AddVolunteer'
import AddCitizen from './pages/AddCitizen'
import MandalDistribution from './pages/MandalDistribution'
import VolunteerChangePassword from './pages/VolunteerChangePassword'
import MLAChangePassword from './pages/MLAChangePassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import SeeVolunteers from './pages/SeeVolunteers'
import {  ProtectedRouteAdmin } from './utils/ProtectedRouteAdmin'
import { ProtectedRouteClient } from './utils/ProtectedRouteClient'
import RaiseQuery from './pages/RaiseQuery'
import SeeQueries from './pages/SeeQueries'
const router=createBrowserRouter([
  {
    path:'/adminLogin',
    element:<AdminLogin/>
  },
  {
    path:'/adminHome',
    element:<ProtectedRouteAdmin><AdminHome/></ProtectedRouteAdmin>
  },
    {
      path:'/adminHome/addClient',
      element:<ProtectedRouteAdmin><AddClient/></ProtectedRouteAdmin>
    },
    {
      path:'/adminHome/seeQueries',
      element:<ProtectedRouteAdmin><SeeQueries/></ProtectedRouteAdmin>
    },
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/MLAHOME',
      element:<ProtectedRouteClient><ClientMhome/></ProtectedRouteClient>
    },
    {
      path:'/VOLUNTEERHOME',
      element:<ProtectedRouteClient><ClientVHome/></ProtectedRouteClient>
    },
    {
      path:'/addMLAHOME/addvolunteer',
      element:<ProtectedRouteClient><AddVolunteer/></ProtectedRouteClient>
    },
    {
      path:'/VOLUNTEERHOME/addcitizen',
      element:<ProtectedRouteClient><AddCitizen/></ProtectedRouteClient>
    },
    {
      path:'/mandal-distribution',
      element:<ProtectedRouteClient><MandalDistribution/></ProtectedRouteClient>
    },
    {
      path:'/VOLUNTEERHOME/changePassword',
      element:<ProtectedRouteClient><VolunteerChangePassword/></ProtectedRouteClient>
    },
    {
      path:"/change-password" ,
      element:<ProtectedRouteClient><MLAChangePassword/></ProtectedRouteClient>
    },
    {
      path:'/forgot-password',
      element:<ForgotPassword/>
    },
    {
      path:"/reset-password/:token",
      element:<ResetPassword />
    },
    {
      path:'/MLAHOME/seevolunteers',
      element:<ProtectedRouteClient><SeeVolunteers/></ProtectedRouteClient>
    },
    {
      path:'/raise-a-query',
      element:<ProtectedRouteClient><RaiseQuery/></ProtectedRouteClient>
    }
])
const App = () => {
  return (
    <div className='min-h-screen'>
      <RouterProvider router={router}/>
      <Toaster/>
    </div>
  )
}

export default App
