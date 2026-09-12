import { Box, Button, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('etumax2');
    const [password, setPassword] = useState('Inicio.2026');
    const { login } = useAuth();

    const handledSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        login(username, password).then((response: any) => {
            if (response.success) {
                Swal.fire({
                    title: 'Login Form',
                    text: `Bienvenido ¡${username}! al sistema Kalum App`,
                    icon: 'success'
                }).then(result => {
                    if (result.isConfirmed) {
                        onLoginSuccess();
                        window.location.href = '/dashboard'
                    }
                });
            }
        }).catch((error) => {
            console.log(error.response)
            Swal.fire({
                title: 'Login Failed',
                text: `${error.response?.data?.message}`,
                icon: 'error'
            }).then(result => {
                if (result.isConfirmed) {
                    window.location.href = '/login'
                }
            });
        });
    }

    const onRegister = () => {
        window.location.href = '/register'
    }

    return (
        <Container sx={{ mt: 16 }}>
            <Typography variant='h4' gutterBottom>
                Iniciar sesion
            </Typography>
            <form onSubmit={handledSubmit}>
                <TextField label="username" fullWidth margin='normal' value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="password" type='password' fullWidth margin='normal' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Box sx={{ mt: 2 }}>
                    <Button type='submit' variant='contained' fullWidth>Login</Button>
                    <Button type='submit' variant='contained' fullWidth onClick={onRegister}>¿No tienes una cuenta?, crea una aqui</Button>
                </Box>
            </form>
        </Container>

    )
}


/* 
try {
                if (response.success) {
                    Swal.fire({
                        title: 'Login Form',
                        text: `Bienvenido ¡${username}! al sistema Kalum App`,
                        icon: 'success'
                    }).then(result => {
                        if (result.isConfirmed) {
                            onLoginSuccess();
                            window.location.href = '/dashboard'
                        }
                    });
                }
            } catch (errorResponse: any) {
                Swal.fire({
                    title: 'Login Failed',
                    text: `${errorResponse.response?.data?.message}`,
                    icon: 'error'
                }).then(result => {
                    if (result.isConfirmed) {
                        window.location.href = '/login'
                    }
                });
            });

*/