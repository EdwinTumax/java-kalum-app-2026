import { DeleteOutlined, EditOutlined, SearchOutlined, UpdateOutlined } from '@mui/icons-material'
import { Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ImageGallery } from './ImageGallery'
import Swal from 'sweetalert2'
import type { TechynicalCareer } from '../../interfaces/TechnicalCareer'
import { getTechnicalCareerService } from '../../services/TechnicalCareerService'



export const Dashboard: React.FC = () => {

    const [careers, setCareers] = useState<TechynicalCareer[]>([]);

    //Async & await
    const loadCareers = async (): Promise<void> => {
        try {
            const response = await getTechnicalCareerService();
            setCareers(response);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Carreras Técnicas",
                text: `${error}`,
                footer: "<a href=\"#\">Why do I have this issue?</a>"
            });
        }

    }

    //Promesas
    /*const loadCareers = (): Promise<void> => {
        return getTechnicalCareerService().then((response) => {
            setCareers(response);
        }).catch(error => {
            Swal.fire({
                icon: "error",
                title: "Carreras Técnicas",
                text: error,
                footer: "<a href=\"#\">Why do I have this issue?</a>"
            });
        });
    }*/


    useEffect(() => {
        loadCareers();
    }, []);


    return (
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ImageGallery />
                    <Typography variant='h4' sx={{ fontWeight: "bold" }}>Carreras Técnicas</Typography>
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
                                    <TableCell>Carrera</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>imagen</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {careers.map((c: TechynicalCareer) => (
                                    <TableRow key={c.careerId} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                        <TableCell><Typography sx={{ fontWeight: "bold" }}>{c.name}</Typography></TableCell>
                                        <TableCell><div dangerouslySetInnerHTML={{ __html: c.description }} /></TableCell>
                                        <TableCell><img src={`/assets/images/${c.image}`} alt={c.name} width={80} height={50} style={{ objectFit: "cover", borderRadius: "8px" }} /></TableCell>
                                        <TableCell>
                                            <IconButton color='primary'><EditOutlined /></IconButton>
                                            <IconButton color='error'><DeleteOutlined /></IconButton>
                                            <IconButton color='success'><UpdateOutlined /></IconButton>
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


