import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Logout } from '@mui/icons-material'
import React from 'react'

interface AppBarMenuProps {
    onMenuClick: () => void;
    onLogin?: () => void;
}


export const AppBarMenu: React.FC<AppBarMenuProps> = ({ onMenuClick, onLogin }) => {
    return (
        <AppBar position='sticky'>
            <Toolbar>
                <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Kalum App
                </Typography>
                <Tooltip title='Login'>
                    <IconButton color='inherit' onClick={onLogin}>
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Cerrar Sesion'>
                    <IconButton color='inherit'>
                        <Logout />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}
