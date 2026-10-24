import React, { useEffect, useState } from 'react'
import { useRole } from '../../hooks/useRole';
import { Alert, Button, CircularProgress, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { ImageGallery } from '../dashboard/ImageGallery';
import { AddOutlined, DeleteOutlined, EditOutlined, EditSquare, UpdateOutlined } from '@mui/icons-material';
import type { Role } from '../../interfaces/role/Role';
import { RoleModal } from './RoleModal';


export const RoleList = () => {
    const [openModal, setOpenModal] = useState(false);

    const { roles, loading, error, getRoles } = useRole();

    useEffect(() => {
        getRoles();
    }, []);

    if (loading) {
        return <CircularProgress />
    }

    const handlerOpenModal = () => {
        setOpenModal(true);
    }

    const handlerCloseModal = () => {
        setOpenModal(false);
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ImageGallery />
                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>Gestion de Roles</Typography>
                    <Button variant='contained' startIcon={<AddOutlined />} onClick={handlerOpenModal} 
                        sx={{ borderRadius: 2, px: 3, py: 1.3, textTransform: 'none', fontWeight: 700, boxShadow: 'none'}} >
                        Agregar
                    </Button>
                </Grid>
                <Grid size={12}>
                    <TextField type='text' variant='outlined' fullWidth placeholder='Ingrese nombre del rol' label='Buscar role' />
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ "& th": { fontWeight: "bold", fontSize: "1rem" } }}>
                                    <TableCell>Codigo</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Accciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((r: Role) => (
                                    <TableRow key={r.roleId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell><Typography sx={{ fontWeight: "bold" }}>{r.roleId}</Typography></TableCell>
                                        <TableCell><Typography sx={{ fontWeight: "bold" }}>{r.name}</Typography></TableCell>
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
            <RoleModal open={openModal} onClose={handlerCloseModal}/>
        </Container >
    )

}
