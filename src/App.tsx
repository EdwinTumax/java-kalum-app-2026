import { use, useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { Dashboard } from './components/dashboard/Dashboard'
import { AppBarMenu } from './layout/AppBarMenu'
import { SideNav } from './layout/SideNav'

function App() {

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handlerDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
   <Router>
    <CssBaseline/>
    <AppBarMenu onMenuClick={handlerDrawerToggle}/>
    <SideNav open={drawerOpen} onClose={handlerDrawerToggle}/>
    <Routes>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/' element={<Navigate to="/dashboard"/>}/>  
    </Routes>
   </Router>
  )
}

export default App
