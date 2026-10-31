import { useEffect, useMemo, useState } from 'react'
import { useRole } from '../../hooks/useRole';
import { Box, Button, CircularProgress, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { ImageGallery } from '../dashboard/ImageGallery';
import { AddOutlined, DeleteOutlined, EditOutlined, EditSquare, UpdateOutlined } from '@mui/icons-material';
import type { Role } from '../../interfaces/role/Role';
import { RoleModal } from './RoleModal';
import { clearRoleError } from '../../store/slices/role/roleSlice';
import Swal from 'sweetalert2';


export const RoleList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const { roles, loading, getRoles, deleteRole } = useRole();

    useEffect(() => {
        getRoles();
    }, []);

    const handlerCloseModal = () => {
        setOpenModal(false);
    }
    9
    const handleOpenCreate = () => {
        clearRoleError();
        setSelectedRole(null);
        setOpenModal(true);

    }

    const handleEditOpen = (role: Role) => {
        clearRoleError();
        setSelectedRole(role);
        setOpenModal(true);
    }

    const handleDelete = async (role: Role) => {
        Swal.fire({
            title: '¿Desea eliminar el registro?',
            text: `Se eliminara el role ${role.name}. Esta acción no se puede deshacer`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#D32F2F',
            reverseButtons: true
        }).then(response => {
            if (response.isConfirmed) {
                deleteRole(role.roleId).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Role eliminado',
                        text: 'El role se eliminó correctamente',
                        confirmButtonText: 'Aceptar'
                    });
                }).catch(e => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar el registro',
                        text: e instanceof Error ? e.message : 'No fue posible eliminar el role',
                        confirmButtonText: 'Aceptar'
                    });

                })
            }
        });
    }

    const filterdRoles = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return roles;
        }
        return roles.filter(role =>
            [
                role.name
            ].some(value => (value ?? '').toLowerCase().includes(term)
            )
        );
    }, [roles, search]);

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ImageGallery />
                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>Gestion de Roles</Typography>
                    <Button variant='contained' startIcon={<AddOutlined />} onClick={handleOpenCreate}
                        sx={{ borderRadius: 2, px: 3, py: 1.3, textTransform: 'none', fontWeight: 700, boxShadow: 'none' }} >
                        Agregar
                    </Button>
                </Grid>
                <Grid size={12}>
                    <TextField type='text' variant='outlined' fullWidth placeholder='Ingrese nombre del rol' label='Buscar role' onChange={event => setSearch(event.target.value)} />
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ "& th": { fontWeight: "bold", fontSize: "1rem" } }}>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Accciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ?
                                    (
                                        <TableRow>
                                            <TableCell colSpan={2} align='center' sx={{ py: 5 }}>
                                                <CircularProgress size={30}></CircularProgress>
                                                <Typography>
                                                    Cargando roles...
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : filterdRoles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align='center' sx={{ py: 5 }}>
                                                {search ? 'No se encontraron roles con ese criterio' : 'No hay roles registrados.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filterdRoles.map((r: Role) => (
                                            <TableRow key={r.roleId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                <TableCell><Typography sx={{ fontWeight: "bold" }}>{r.name}</Typography></TableCell>
                                                <TableCell align='center'>
                                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                        <Tooltip title="Editar rol" arrow>
                                                            <IconButton color='primary' onClick={() => handleEditOpen(r)}><EditOutlined /></IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar rol" arrow>
                                                            <IconButton color='error' onClick={() => handleDelete(r)}><DeleteOutlined /></IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Asignar rol" arrow>
                                                            <IconButton color='success'><UpdateOutlined /></IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Quitar rol a usuario" arrow>
                                                            <IconButton color='warning'><EditSquare></EditSquare></IconButton>
                                                        </Tooltip>
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
            <RoleModal open={openModal} onClose={handlerCloseModal} role={selectedRole} />
        </Container >
    )

}
