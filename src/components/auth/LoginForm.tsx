import { Box, Button, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';


interface LoginFormProps {
    onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('etumax2');
    const [password, setPassword] = useState('Inicio.2026');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

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
                        navigate('/dashboard');
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
                    navigate('/login');
                }
            });
        });
    }

    const onRegister = () => {
        navigate('/register');
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
                    <Button type='submit' variant='contained' disabled={loading} fullWidth>{loading ? 'Iniciando sesión...' : 'Iniciar sesion'}</Button>
                    <Link to="/register" style={{
                        display: 'block',
                        marginTop: '16px',
                        textAlign: 'center',
                        textDecoration: 'none'
                    }}>
                        ¿No tienes una cuenta? Crea una aquí.
                    </Link>
                </Box>
            </form>
        </Container>

    )
}