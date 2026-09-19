import React, { useEffect } from 'react'
import { useUser } from '../../hooks/useUser'
import { CircularProgress, Alert, Typography, Container, Grid, Button, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { ImageGallery } from '../dashboard/ImageGallery';
import { DeleteOutlined, EditOutlined, EditSquare, SearchOutlined, UpdateOutlined } from '@mui/icons-material';
import type { User } from '../../interfaces/user/User';

export const UserList: React.FC = () => {

    const { users, loading, error, getUsers } = useUser();

    useEffect(() => {
        getUsers();
    }, []);

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return (
            <Alert security='error'>
                {error}
            </Alert>
        )
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ImageGallery />
                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>Gestion de Usuarios</Typography>
                    <Button variant='contained' color='primary' startIcon={<SearchOutlined />} >
                        Buscar
                    </Button>
                </Grid>
                <Grid size={12}>
                    <TextField type='text' variant='outlined' fullWidth placeholder='Ingrese carrera técnica' label='Buscar carrera' />
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ "& th": { fontWeight: "bold", fontSize: "1rem" } }}>
                                    <TableCell>Apellidos</TableCell>
                                    <TableCell>Nombres</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Identificacion</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefono</TableCell>
                                    <TableCell>Roles</TableCell>
                                    <TableCell>Accciones</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u: User) => (
                                    <TableRow key={u.userId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell><Typography sx={{ fontWeight: "bold" }}>{u.lastName}</Typography></TableCell>
                                        <TableCell><Typography sx={{ fontWeight: "bold" }}>{u.firstName}</Typography></TableCell>
                                        <TableCell>{u.username}</TableCell>
                                        <TableCell>{u.applicationNumber}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.phoneNumber}</TableCell>
                                        <TableCell>{u.roles}</TableCell>
                                        <TableCell>
                                            <IconButton color='primary'><EditOutlined /></IconButton>
                                            <IconButton color='error'><DeleteOutlined /></IconButton>
                                            <IconButton color='success'><UpdateOutlined /></IconButton>
                                            <IconButton color='warning'><EditSquare></EditSquare></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container >
    )
}
