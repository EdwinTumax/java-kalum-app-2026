import { SearchOutlined } from '@mui/icons-material'
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'

import React, { useState } from 'react'
import { ImageGallery } from './ImageGallery'
import Swal from 'sweetalert2'

interface Role {
    id: number,
    role: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: String;
    email: string;
    edad: number;
    sueldoBase: number,
    horas: number,
    costoHora: number,
    activo: boolean; 
    role: Role   
}



export const Dashboard: React.FC = () => {

    const [sueldo,setSueldo] = useState(0);

    const usuarios: Usuario[] = [
        {
            id: 1,
            nombre: 'Edwin',
            apellido: 'Tumax',
            email: 'edwintumax@gmail.com',
            edad: 43,
            sueldoBase: 1200,
            horas: 180,
            costoHora: 12.30,
            activo: true,
            role: {id: 0, role: ''}
        },
        {
            id: 2,
            nombre: 'Juan',
            apellido: 'Perez',
            email: 'juanperez@gmail.com',
            edad: 23,
            sueldoBase: 1800,
            horas: 160,
            costoHora: 10.30,
            activo: false,
            role: {id: 0, role: ''}

        },
        {
            id: 3,
            nombre: 'Marta',
            apellido: 'Martinez',
            email: 'martamartinez@gmail.com',
            edad: 45,
            sueldoBase: 4200,
            horas: 170,
            costoHora: 20.30,
            activo: true,
            role: {id: 0, role: ''}
        }
    ]

    const roles:  Role[] = [
        {
            id: 1,
            role: 'ROLE_ADMIN'
        },
        {
            id: 2,
            role: 'ROLE_USER'
        },
        {
            id: 3,
            role: 'ROLE_SUSPEND'
        }
    ]

    const baseUsuarios: Usuario[] = usuarios.map((u,i) => ({
        ...u,
        role: roles[i]
    }));

    const calcularSueldo = (u: Usuario) : number => {
        return u.sueldoBase + (u.horas * u.costoHora);
    }

    const obtenerNombreCompleto = (u: Usuario): string => {
        const {nombre,apellido} = u;
        return `${apellido} ${nombre}`
    }

    const handlerSubmit = () => {

    }


    return (
        <Grid container sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <ImageGallery />
            <Grid>
                <Typography sx={{ ml: 4, mr: 4 }}>Carreras Técnicas</Typography>
            </Grid>
            <Grid>
                <Button color='primary' sx={{ padding: 2 }} onClick={handlerSubmit}>
                    <SearchOutlined sx={{ fontSize: 30, mr: 2 }}></SearchOutlined>
                    Buscar
                </Button>
            </Grid>
            <Grid container size={12}>
                <TextField type='text' variant='filled' fullWidth placeholder='Ingrese carrera técnica' label='carreras' sx={{ border: 'none', ml: 4, mr: 4 }} />
            </Grid>
            <Grid>
                <TableContainer component={Paper} sx={{ ml: 4, mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Edad</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Sueldo Base</TableCell>
                                <TableCell>Sueldo Total</TableCell>
                                <TableCell>Rol</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {baseUsuarios.map((u: Usuario) => (
                                <TableRow key={u.id}>
                                    <TableCell>{obtenerNombreCompleto(u)}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.edad}</TableCell>
                                    <TableCell>{u.activo ? 'Usuario activo' : 'Usuario inactivo'}</TableCell>
                                    <TableCell>{((sueldoBase: number) => {
                                        return (
                                            <Typography sx={{fontWeight: 'bold'}} >{sueldoBase}</Typography>
                                        );
                                    })(u.sueldoBase)}</TableCell>
                                    <TableCell>
                                        <Typography sx={{fontWeight: 'bold', fontSize: 20}}>{calcularSueldo(u)}</Typography>                                    
                                    </TableCell>
                                    <TableCell>
                                        {u.role.role}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}


