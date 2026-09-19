import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { PermContactCalendar } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SideNavProps {
    open: boolean;
    onClose: () => void;
}


interface MenuItem {
    text: string;
    icon: React.ReactElement,
    path: string,
    authenticated: boolean
}

export const SideNav: React.FC<SideNavProps> = ({ open, onClose }) => {

    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    const drawerWidth = 260;

    const menuItem: MenuItem[] = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard',
            authenticated: false
        },
        {
            text: 'Carreras Técnicas',
            icon: <SchoolIcon />,
            path: '/carreras',
            authenticated: false
        },
        {
            text: 'Usuarios',
            icon: <PeopleIcon />,
            path: '/users',
            authenticated: true
        },
        {
            text: 'Roles',
            icon: <SecurityIcon />,
            path: '/roles',
            authenticated: true
        },
        {
            text: 'Examenes Admisión',
            icon: <CalendarMonthIcon />,
            path: '/examenes-admision',
            authenticated: false
        },
        {
            text: 'Resultado Examen',
            icon: <PermContactCalendar />,
            path: '/status-examen-admision',
            authenticated: true
        },
    ]

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    }


    return (
        <Drawer anchor='left' open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { top: '64px', height: 'calc(100% - 64px)' } }} ModalProps={{ keepMounted: true }} >
            <List sx={{ width: drawerWidth }}>
                {
                    menuItem.filter(item => !item.authenticated || isAuthenticated)
                    .map((item, index) => (
                        <ListItemButton key={index} onClick={() => handleNavigate(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))
                }
            </List>
        </Drawer>
    )
}
