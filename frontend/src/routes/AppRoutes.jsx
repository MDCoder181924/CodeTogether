import React from 'react'
import {Routes , Route} from "react-router-dom"
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import Home from '../pages/Home'
import GroupLobbyPage from '../pages/GroupLobbyPage'
import CollaborativeEditor from '../components/CollaborativeEditor/CollaborativeEditor'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/group-lobby" element={<GroupLobbyPage/>} />
        <Route path="/editor" element={<CollaborativeEditor/>} />
      </Routes>
    </div>
  )
}

export default AppRoutes
