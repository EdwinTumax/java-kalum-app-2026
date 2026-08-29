import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Swal from 'sweetalert2';

export const RegisterForm = () => {
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!lastname.trim()) {
            setError('El apellido es obligatorio')
            return false
        }
        if (!firstname.trim()) {
            setError('El nombre es obligatorio')
            return false
        }

        if (!username.trim()) {
            setError('El username es obligatorio')
            return false
        }

        if (!password.trim()) {
            setError('El password es obligatorio')
            return false
        }

        if (!email.trim()) {
            setError('El email es obligatorio')
            return false
        }

        setError('');
        return true;

    }

    const handlerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()) {
            return;
        }

        Swal.fire({
            title: 'Registro de usuario',
            text: 'El registro fue creado con exito',
            icon: 'success'
        }).then(result => {
            if (result.isConfirmed) {
                window.location.href = '/dashboard';
            }
        })

    }

    const handlerOnCancel = () => {
        window.location.href = '/dashboard';
    }

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant='h4' gutterBottom>
                Iniciar sesion
            </Typography>
            <form onSubmit={handlerSubmit}>
                <TextField label="lastname" fullWidth margin='normal' value={lastname} onChange={(e) => setLastname(e.target.value)} />
                <TextField label="firstname" fullWidth margin='normal' value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                <TextField label="username" fullWidth margin='normal' value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField label="password" type='password' fullWidth margin='normal' value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextField label="email" fullWidth margin='normal' value={email} onChange={(e) => setEmail(e.target.value)} />
                {error && <Alert severity='error' sx={{ mt: 2 }} >{error}</Alert>}
                <Box sx={{ mt: 2 }}>
                    <Button type='submit' variant='contained' fullWidth>Save</Button>
                    <Button variant='contained' fullWidth onClick={handlerOnCancel}>Cancel</Button>
                </Box>
            </form>
        </Container>
    )
}
