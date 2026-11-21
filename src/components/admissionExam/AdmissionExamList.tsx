
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    AddOutlined,
    CalendarMonthOutlined,
    DeleteOutlined,
    EditOutlined,
    EventAvailableOutlined,
    FactCheckOutlined,
    QuizOutlined,
    RefreshOutlined,
    SearchOutlined
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import Swal from 'sweetalert2';

import { useAdmissionExam } from '../../hooks/useAdmissionExam';
import type { AdmissionExam } from '../../interfaces/exam/AdmissionExam';
import { clearAdmissionExamError } from '../../store/slices/admissionExam/admissionExamSlice';
import { AdmissionExamModal } from './AdmissionExamModal';

export const AdmissionExamList = () => {

    const dispatch = useDispatch();

    const {
        admissionExams,
        loading,
        getAdmissionExams,
        deleteAdmissionExam
    } = useAdmissionExam();

    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedAdmissionExam, setSelectedAdmissionExam] = useState<AdmissionExam | null>(null);

    useEffect(() => {
        getAdmissionExams();
    }, []);

    // FECHAS

    const getLocalDate = (date: string): Date => {
        const [year, month, day] = date.substring(0, 10).split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const formatExamDate = (date: string): string => {
        const parsedDate = getLocalDate(date);

        if (isNaN(parsedDate.getTime())) return 'Fecha inválida';

        return new Intl.DateTimeFormat('es-GT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(parsedDate);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ESTADÍSTICAS

    const upcomingExams = useMemo(
        () => admissionExams.filter(exam => {
            const date = getLocalDate(exam.examDate);
            return !isNaN(date.getTime()) && date >= today;
        }),
        [admissionExams]
    );

    const completedExams = useMemo(
        () => admissionExams.filter(exam => {
            const date = getLocalDate(exam.examDate);
            return !isNaN(date.getTime()) && date < today;
        }),
        [admissionExams]
    );

    // BÚSQUEDA

    const filteredAdmissionExams = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return admissionExams;

        return admissionExams.filter(exam =>
            exam.examId.toLowerCase().includes(term) ||
            formatExamDate(exam.examDate).toLowerCase().includes(term) ||
            exam.examDate.includes(term)
        );
    }, [admissionExams, search]);

    // MODALES

    const handleOpenCreate = () => {
        dispatch(clearAdmissionExamError());
        setSelectedAdmissionExam(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (admissionExam: AdmissionExam) => {
        dispatch(clearAdmissionExamError());
        setSelectedAdmissionExam(admissionExam);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAdmissionExam(null);
    };

    // ESTADO DEL EXAMEN

    const getExamStatus = (examDate: string) => {
        const date = getLocalDate(examDate);

        if (isNaN(date.getTime())) {
            return {
                label: 'Fecha inválida',
                color: 'default' as const
            };
        }

        return date >= today
            ? { label: 'Programado', color: 'success' as const }
            : { label: 'Finalizado', color: 'default' as const };
    };

    // ELIMINAR EXAMEN

    const handleDelete = async (admissionExam: AdmissionExam) => {

        const result = await Swal.fire({
            title: '¿Eliminar examen?',
            text: `Se eliminará el examen con fecha ${formatExamDate(admissionExam.examDate)}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d32f2f',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {

            await deleteAdmissionExam(admissionExam.examId);

            await Swal.fire({
                icon: 'success',
                title: 'Examen eliminado',
                text: 'El examen de admisión se eliminó correctamente.',
                confirmButtonText: 'Aceptar'
            });

        } catch (error: unknown) {

            await Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el examen',
                text: error instanceof Error
                    ? error.message
                    : 'No fue posible eliminar el examen de admisión.',
                confirmButtonText: 'Aceptar'
            });
        }
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
                            color,
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
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Gestión de Exámenes de Admisión
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Administra las fechas de los exámenes de admisión.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>

                    <Tooltip title="Actualizar listado">
                        <span>
                            <IconButton
                                onClick={() => getAdmissionExams()}
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
                        Nuevo Examen
                    </Button>

                </Box>
            </Box>

            {/* TARJETAS DE RESUMEN */}

            <Grid container spacing={2.5} sx={{ mb: 4 }}>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Total de exámenes"
                        value={admissionExams.length}
                        subtitle="Exámenes registrados"
                        icon={<QuizOutlined />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Programados"
                        value={upcomingExams.length}
                        subtitle="Exámenes pendientes de realizar"
                        icon={<EventAvailableOutlined />}
                        color="#2e7d32"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Finalizados"
                        value={completedExams.length}
                        subtitle="Exámenes cuya fecha ya pasó"
                        icon={<FactCheckOutlined />}
                        color="#ed6c02"
                    />
                </Grid>

            </Grid>

            {/* LISTADO */}

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
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Exámenes de admisión registrados
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Consulta y administra las fechas de los exámenes.
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar examen..."
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
                                <TableCell>Fecha del examen</TableCell>
                                <TableCell align="center">Estado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {loading ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} />

                                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                                            Cargando exámenes de admisión...
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : filteredAdmissionExams.length === 0 ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <QuizOutlined
                                            sx={{
                                                fontSize: 48,
                                                color: 'text.disabled'
                                            }}
                                        />

                                        <Typography sx={{ fontWeight: 600 }}>
                                            No se encontraron exámenes
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {search
                                                ? 'Intenta con otro criterio de búsqueda.'
                                                : 'Aún no existen exámenes de admisión registrados.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : (

                                filteredAdmissionExams.map((exam, index) => {

                                    const status = getExamStatus(exam.examDate);

                                    return (
                                        <TableRow
                                            key={exam.examId}
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

                                            {/* FECHA */}

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
                                                        <CalendarMonthOutlined />
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ fontWeight: 700 }}
                                                        >
                                                            {formatExamDate(exam.examDate)}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Examen de admisión
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* ESTADO */}

                                            <TableCell align="center">
                                                <Chip
                                                    label={status.label}
                                                    color={status.color}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 600,
                                                        borderRadius: 1.5
                                                    }}
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

                                                    <Tooltip title="Editar examen" arrow>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpenEdit(exam)}
                                                        >
                                                            <EditOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar examen" arrow>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(exam)}
                                                        >
                                                            <DeleteOutlined fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                </Box>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })

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
                            Mostrando {filteredAdmissionExams.length} de {admissionExams.length} exámenes registrados
                        </Typography>
                    </Box>
                )}

            </Paper>

            {/* MODAL */}

            <AdmissionExamModal
                open={openModal}
                onClose={handleCloseModal}
                admissionExam={selectedAdmissionExam}
            />

        </Container>
    );
};
