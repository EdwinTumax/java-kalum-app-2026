import { use, useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Dashboard } from './components/dashboard/Dashboard'
import { AppBarMenu } from './layout/AppBarMenu'
import { SideNav } from './layout/SideNav'
import { LoginForm } from './components/auth/LoginForm'

function App() {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handlerDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handlerOnLogin = () => {
    window.location.href='/login'
  }


  return (
   <Router>
    <CssBaseline/>
    <AppBarMenu onMenuClick={handlerDrawerToggle} onLogin={handlerOnLogin}/>
    <SideNav open={drawerOpen} onClose={handlerDrawerToggle}/>    
    <Routes>
      <Route path='/login' element={<LoginForm onLoginSuccess={() => window.location.hash='/dashboard'} />}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/' element={<Navigate to="/dashboard"/>}/>  
    </Routes>
   </Router>
  )
}

export default App
