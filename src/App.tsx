import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Dashboard } from './components/dashboard/Dashboard'
import { AppBarMenu } from './layout/AppBarMenu'
import { SideNav } from './layout/SideNav'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import Swal from 'sweetalert2'
import { useAuth } from './hooks/useAuth'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handlerDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const { logout } = useAuth();

  const handlerOnLogin = () => {
    window.location.href = '/login';
  }

  const handlerLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: '¿Esta seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#D33',
      confirmButtonText: 'Si'
    }).then(result => {
      if(result.isConfirmed) {
        logout();
        window.location.href = '/dashboard'
      }
    });
  }


  return (
   <Router>
    <CssBaseline/>
    <AppBarMenu onMenuClick={handlerDrawerToggle} onLogin={handlerOnLogin} onLogout={handlerLogout}/>
    <SideNav open={drawerOpen} onClose={handlerDrawerToggle}/>    
    <Routes>
      <Route path='/login' element={<LoginForm onLoginSuccess={() => window.location.hash='/dashboard'} />}/>
      <Route path='/register' element={<RegisterForm />}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/' element={<Navigate to="/dashboard"/>}/>  
    </Routes>
   </Router>
  )
}

export default App
