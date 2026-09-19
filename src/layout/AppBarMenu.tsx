import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Logout } from '@mui/icons-material'
import React from 'react'
import { useAuth } from '../hooks/useAuth';

interface AppBarMenuProps {
    onMenuClick: () => void;
    onLogin?: () => void;
    onLogout?: () => void;
}


export const AppBarMenu: React.FC<AppBarMenuProps> = ({ onMenuClick, onLogin, onLogout }) => {

    const { isAuthenticated, user } = useAuth();

    return (
        <AppBar position='sticky'>
            <Toolbar>
                <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Kalum App
                </Typography>

                {isAuthenticated ?
                    (
                        <>
                            <Typography variant='h6' sx={{ fontWeight: "bold" }}>
                                Hola, {user?.user}
                            </Typography>
                            <Tooltip title='Cerrar Sesion'>
                                <IconButton color='inherit' onClick={onLogout}>
                                    <Logout />
                                </IconButton>
                            </Tooltip>
                        </>) :
                    (
                        <Tooltip title='Login'>
                            <IconButton color='inherit' onClick={onLogin}>
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    )}
            </Toolbar>
        </AppBar>
    )
}
