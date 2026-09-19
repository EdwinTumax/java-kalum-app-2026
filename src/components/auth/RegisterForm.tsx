import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const RegisterForm = () => {
    const navigate = useNavigate();
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
                navigate('/dashboard');
            }
        })

    }

    const handlerOnCancel = () => {
        navigate('/dashboard');
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
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button type='submit' variant='contained' startIcon={<SaveIcon />} sx={{minWidth: 140}}>Save</Button>
                    <Button type='button' variant='outlined' startIcon={<CancelIcon/>} sx={{minWidth: 140}} onClick={handlerOnCancel}>Cancel</Button>
                </Box>
            </form>
        </Container>
    )
}
