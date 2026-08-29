import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Swal from 'sweetalert2';

interface LoginFormProps {
    onLoginSuccess: () => void;
}


export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {

    const [username, setUsername] = useState('etumax');
    const [password, setPassword] = useState('Inicio.2026');
    const [error, setError] = useState('');
  
    const handledSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(username === 'etumax' && password === 'Inicio.2026') {
            Swal.fire({
                title: 'Login Form',
                text: `Bienvenido ¡${username}! al sistema Kalum App`,
                icon: 'success'
            }).then(result => {
                if(result.isConfirmed) {
                    window.location.href = '/dashboard'
                }
            });
        } else {
            Swal.fire({
                title: 'Login Failed',
                text: 'Error en las credendiales, favor de validar',
                icon: 'error'
            }).then(result => {
                if(result.isConfirmed) {
                    window.location.href = '/login'
                }
            });
        }
    }


    return (
        <Container sx={{mt: 16}}>
            <Typography variant='h4' gutterBottom>
                Iniciar sesion
            </Typography>
            <form onSubmit={handledSubmit}>
                <TextField label="username" fullWidth margin='normal' value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="password" type='password' fullWidth margin='normal' value={password} onChange={(e) => setPassword(e.target.value)} /> 
                {error && <Alert severity='error' sx={{mt: 2}} >{error}</Alert>}
                <Box sx={{mt:2}}>
                    <Button type='submit' variant='contained' fullWidth>Login</Button>
                </Box>
            </form>
        </Container>

    )
}
