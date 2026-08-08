import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { PermContactCalendar } from '@mui/icons-material';

import React, { useState } from 'react'

interface SideNavProps {
    open: boolean;
    onClose: () => void;
}


interface MenuItem {
    text: string;
    icon: React.ReactElement,
    path: string
}

export const SideNav: React.FC<SideNavProps> = ({ open, onClose }) => {

    const drawerWidth = 260;

    const menuItem: MenuItem[] = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard'
        },
        {
            text: 'Carreras Técnicas',
            icon: <SchoolIcon />,
            path: '/carreras'
        },
        {
            text: 'Usuarios',
            icon: <PeopleIcon />,
            path: '/users'
        },
        {
            text: 'Roles',
            icon: <SecurityIcon />,
            path: '/roles'
        },
        {
            text: 'Examenes Admisión',
            icon: <CalendarMonthIcon />,
            path: '/examenes-admision'
        },
        {
            text: 'Resultado Examen',
            icon: <PermContactCalendar />,
            path: '/status-examen-admision'
        },
    ]

    return (
        <Drawer anchor='left' open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { top: '64px', height: 'calc(100% - 64px)' } }} ModalProps={{ keepMounted: true }} >
            <List sx={{ width: drawerWidth }}>
                {
                    menuItem.map((item, index) => (
                        <ListItemButton key={index}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))
                }
            </List>
        </Drawer>
    )
}
