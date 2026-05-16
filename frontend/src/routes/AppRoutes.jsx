import React from 'react'
import {Routes , Route} from ""
import login from '../pages/Auth/Login'
import signup from '../pages/Auth/Signup'
import Home from '../pages/Home'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<login/>} />
        <Route path="/signup" element={<signup/>} />
      </Routes>
    </div>
  )
}

export default AppRoutes
