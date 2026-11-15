import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useTechnicalCareer } from '../../hooks/useTechnicalCareer';
import type { TechnicalCareer } from '../../interfaces/career/TechnicalCareer';
import { clearTechnicalCareerError } from '../../store/slices/technicalCareer/technicalCareerSlice';
import Swal from 'sweetalert2';
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { AddOutlined, DeleteOutlined, EditOutlined, GroupsOutlined, ManageAccountsOutlined, RefreshOutlined, SearchOutlined, SecurityOutlined, ShieldOutlined, Work } from '@mui/icons-material';
import { TechnicalCareerModal } from './TechnicalCareerModal';


export const TechnicalCareerList = () => {

    const dispatch = useDispatch();

    const {
        technicalCareers,
        loading,
        getTechnicalCareers,
        deleteTechnicalCareer
    } = useTechnicalCareer();

    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedTechnicalCareer, setSelectedTechnicalCareer] = useState<TechnicalCareer | null>(null);

    useEffect(() => {
        getTechnicalCareers();
    }, []);

    // FILTRAR ROLES

    const filteredTechnicalCareers = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return technicalCareers;

        return technicalCareers.filter(technicalCareer =>
            String(technicalCareer.name ?? '').toLowerCase().includes(term)
        );
    }, [technicalCareers, search]);

    // ESTADÍSTICAS

    const adminCount = useMemo(
        () => technicalCareers.filter(technicalCareer =>
            technicalCareer.name?.toLowerCase().includes('admin')
        ).length,
        [technicalCareers]
    );

    const otherTechnicalCareers = technicalCareers.length - adminCount;

    // MODALES

    const handleOpenCreate = () => {
        dispatch(clearTechnicalCareerError());
        setSelectedTechnicalCareer(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (technicalCareer: TechnicalCareer) => {
        dispatch(clearTechnicalCareerError());
        setSelectedTechnicalCareer(technicalCareer);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTechnicalCareer(null);
    };

    // ELIMINAR ROL

    const handleDelete = async (technicalCareer: TechnicalCareer) => {

        const result = await Swal.fire({
            title: '¿Eliminar rol?',
            text: `Se eliminará el rol ${technicalCareer.name}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d32f2f',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await deleteTechnicalCareer(technicalCareer.careerId);

            await Swal.fire({
                icon: 'success',
                title: 'Rol eliminado',
                text: 'El rol se eliminó correctamente.',
                confirmButtonText: 'Aceptar'
            });

        } catch (error: unknown) {
            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el rol',
                text: error instanceof Error
                    ? error.message
                    : 'No fue posible eliminar el rol.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    // COLOR DEL ROL

    const getTechnicalCareerColor = (
        name: string
    ): 'primary' | 'success' | 'default' => {

        if (name?.toLowerCase().includes('admin')) {
            return 'primary';
        }

        if (name?.toLowerCase().includes('user')) {
            return 'success';
        }

        return 'default';
    };

    // TARJETAS DE RESUMEN

    const SummaryCard = ({
        title,
        value,
        subtitle,
        icon,
        color
    }: {
        title: string;
        value: number;
        subtitle: string;
        icon: React.ReactNode;
        color: string;
    }) => (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                height: '100%'
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 800, my: 1 }}
                        >
                            {value}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            bgcolor: `${color}18`,
                            color: color,
                            width: 52,
                            height: 52
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>

            {/* ENCABEZADO */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 800 }}
                    >
                        Gestión de Carreras Técnicas
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Administra las carreras técnicas de estudios en el sistema.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Actualizar listado">
                        <span>
                            <IconButton
                                onClick={() => getTechnicalCareers()}
                                disabled={loading}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <RefreshOutlined />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={handleOpenCreate}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: 'none'
                        }}
                    >
                        Nuevo Carrera Técnica
                    </Button>
                </Box>
            </Box>

            {/* TARJETAS DE RESUMEN */}

            <Grid container spacing={2.5} sx={{ mb: 4 }}>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Total de carreras Técnicas"
                        value={technicalCareers.length}
                        subtitle="Carreras técnicas registradas en el sistema"
                        icon={<GroupsOutlined />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Carreras Técnicas administrativas"
                        value={adminCount}
                        subtitle="Carreras técnicas con permisos administrativos"
                        icon={<ShieldOutlined />}
                        color="#9c27b0"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Otros carreras técnicas"
                        value={otherTechnicalCareers}
                        subtitle="Carreras Técnicas adicionales del sistema"
                        icon={<ManageAccountsOutlined />}
                        color="#2e7d32"
                    />
                </Grid>

            </Grid>

            {/* LISTADO DE ROLES */}

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >

                {/* ENCABEZADO DEL LISTADO */}

                <Box sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700 }}
                            >
                                Carreras Técnicas registradas
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Consulta y administra los carreras técnicas disponibles.
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar carrera..."
                            sx={{
                                width: { xs: '100%', sm: 300 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlined color="action" />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* TABLA */}

                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 600 }}>

                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: 'action.hover',
                                    '& th': {
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        fontSize: '0.78rem',
                                        textTransform: 'uppercase'
                                    }
                                }}
                            >
                                <TableCell>#</TableCell>
                                <TableCell>CARRERA TÉCNICA</TableCell>
                                <TableCell>DESCRIPCIÓN</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {loading ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} />

                                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                                            Cargando carreras técnicas...
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : filteredTechnicalCareers.length === 0 ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <SecurityOutlined
                                            sx={{
                                                fontSize: 48,
                                                color: 'text.disabled'
                                            }}
                                        />

                                        <Typography sx={{ fontWeight: 600 }}>
                                            No se encontraron carreras técnicas
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {search
                                                ? 'Intenta con otro criterio de búsqueda.'
                                                : 'Aún no existen carreras técnicas registradas.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : (

                                filteredTechnicalCareers.map((technicalCareer: TechnicalCareer, index: number) => (

                                    <TableRow
                                        key={technicalCareer.careerId}
                                        hover
                                        sx={{
                                            '& td': {
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                py: 2
                                            }
                                        }}
                                    >
                                        {/* IDENTIFICADOR */}
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {index + 1}
                                            </Typography>
                                        </TableCell>

                                        {/* NOMBRE */}

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        width: 42,
                                                        height: 42,
                                                        bgcolor: 'primary.main',
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <Work />
                                                </Avatar>

                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        {technicalCareer.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {technicalCareer.subTitle}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* CLASIFICACIÓN */}

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                dangerouslySetInnerHTML={{__html: technicalCareer.description}}                                            
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </TableCell>

                                        {/* ACCIONES */}

                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <Tooltip title="Editar rol" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEdit(technicalCareer)}
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Eliminar rol" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(technicalCareer)}
                                                    >
                                                        <DeleteOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                ))

                            )}

                        </TableBody>
                    </Table>
                </TableContainer>

                {/* PIE DEL LISTADO */}

                {!loading && (
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Mostrando {filteredTechnicalCareers.length} de {technicalCareers.length} carreras técnicas registradas
                        </Typography>
                    </Box>
                )}

            </Paper>

            {/* MODAL */}

            <TechnicalCareerModal
                open={openModal}
                onClose={handleCloseModal}
                technicalCareer={selectedTechnicalCareer}
            />

        </Container>
    );

}
