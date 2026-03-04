
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {ToastContainer} from "react-toastify";
import GetCurrentuser from './customHooks/GetCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import ForgetPassword from './pages/ForgetPassword'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import CreateCourses from './pages/Educator/CreateCourses'
import GetCreatorCourse from "./customHooks/GetCreatorCourse"
import EditCourse from './pages/Educator/EditCourse'

export const serverUrl = "http://localhost:8000"

function App() {
  GetCurrentuser();
  GetCreatorCourse();
  const {userData} = useSelector(state=>state.user);
  return (
    <>
    <ToastContainer/>
      <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={'/'}/>} />
         <Route path='/login' element={<Login/>} />
         <Route path='/profile' element={userData?<Profile/>:<Navigate to={'/signup'}/>}/>
         <Route path='/forget' element={userData?<ForgetPassword/>:<Navigate to={'/signup'}/>}/>
         <Route path='/editprofile' element={userData?<EditProfile/> :<Navigate to={'/signup'} />}/>
         <Route path='/dashboard' element={userData?.role === "educator"?<Dashboard/> :<Navigate to={'/signup'} />}/>
         <Route path='/courses' element={userData?.role === "educator"?<Courses/> :<Navigate to={'/signup'} />}/>
         <Route path='/createcourses' element={userData?.role === "educator"?<CreateCourses/> :<Navigate to={'/signup'} />}/>
         <Route path='/editcourse/:courseId' element={userData?.role === "educator"?<EditCourse/> :<Navigate to={'/signup'} />}/>
      </Routes>
      
    </>
  )
}

export default App
