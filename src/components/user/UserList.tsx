import React, { useEffect, useMemo, useState } from 'react'
import { useUser } from '../../hooks/useUser'
import { CircularProgress, Alert, Typography, Container, Grid, Button, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box } from '@mui/material';
import { ImageGallery } from '../dashboard/ImageGallery';
import { AddOutlined, DeleteOutlined, EditOutlined, EditSquare, SearchOutlined, UpdateOutlined } from '@mui/icons-material';
import type { User } from '../../interfaces/user/User';
import { Tooltip } from '@mui/material';
import { UserModal } from './UserModal';
import Swal from 'sweetalert2';

export const UserList: React.FC = () => {
    const { users, loading, error, getUsers, clearUserError, deleteUser } = useUser();
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const filterdUsers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return users;
        }
        return users.filter(user =>
            [
                user.username,
                user.firstName,
                user.lastName,
                user.email,
                user.phoneNumber,
                user.applicationNumber,
                user.roles
            ].some(value => (value ?? '').toLowerCase().includes(term)
            )
        );
    }, [users, search]);

    const handleOpenCreate = () => {
        clearUserError();
        setSelectedUser(null);
        setOpenModal(true);
    }

    const handleOpenEdit = (user: User) => {
        clearUserError();
        setSelectedUser(user);
        setOpenModal(true);
    }

    const handleClose = () => {
        setOpenModal(false);
        setSelectedUser(null);
    }

    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            title: '¿Desea eliminar el usuario?',
            text: `Se eliminara el usuario ${user.username}. Esta acción no se puede deshacer`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d32f2f',
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteUser(user.userId);
            await Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario se eliminó correctamente',
                confirmButtonText: 'Aceptar'
            });
        } catch (error: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el registro',
                text: error instanceof Error ? error.message : 'No fue posible eliminar el usuario',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ImageGallery />
                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>Gestion de Usuarios</Typography>
                    <Button variant='contained' startIcon={<AddOutlined />} onClick={handleOpenCreate} sx={{ borderRadius: 2, px: 3, py: 1.2, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
                        Agregar
                    </Button>

                </Grid>
                <Grid size={12}>
                    <TextField type='text' variant='outlined' fullWidth placeholder='Ingrese carrera técnica' label='Buscar carrera' value={search} onChange={event => setSearch(event.target.value)} />
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
                                 {loading ? 
                                    (
                                        <TableRow>
                                            <TableCell colSpan={8} align='center' sx={{ py: 5 }}>
                                                <CircularProgress size={30} />
                                                <Typography>
                                                    Cargando usuarios...
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : filterdUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align='center' sx={{ py: 5 }}>
                                                {search ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filterdUsers.map(u => (
                                            <TableRow key={u.userId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                <TableCell><Typography sx={{ fontWeight: "bold" }}>{u.lastName}</Typography></TableCell>
                                                <TableCell><Typography sx={{ fontWeight: "bold" }}>{u.firstName}</Typography></TableCell>
                                                <TableCell>{u.username}</TableCell>
                                                <TableCell>{u.applicationNumber}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{u.phoneNumber}</TableCell>
                                                <TableCell>{u.roles}</TableCell>
                                                <TableCell align='center'>
                                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                        <Tooltip title="Editar usuario" arrow>
                                                            <IconButton color='primary' onClick={() => handleOpenEdit(u)}><EditOutlined /></IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar usuario">
                                                            <IconButton color='error' onClick={() => handleDelete(u)}><DeleteOutlined /></IconButton>
                                                        </Tooltip>
                                                        <IconButton color='success'><UpdateOutlined /></IconButton>
                                                        <IconButton color='warning'><EditSquare></EditSquare></IconButton>
                                                    </Box>

                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )
                                }
                            </TableBody>
                            
                        </Table>
                    </TableContainer>                    
                </Grid>
            </Grid>
            <UserModal open={openModal} onClose={handleClose} user={selectedUser}></UserModal>
        </Container >
    )
}
