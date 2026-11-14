import React, { useEffect, useMemo, useState } from 'react';

import {
    AddOutlined,
    ArrowForwardOutlined,
    GroupAddOutlined,
    SearchOutlined,
    VisibilityOutlined,
    SchoolOutlined,
    ImageOutlined,
    CloseOutlined
} from '@mui/icons-material';

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';

import Swal from 'sweetalert2';

import type { TechynicalCareer } from '../../interfaces/TechnicalCareer';
import { getTechnicalCareerService } from '../../services/TechnicalCareerService';
import type { CarreraTecnica } from '../../interfaces/career/CarreraTecnica';


export const Dashboard: React.FC = () => {
    const [careers, setCareers] = useState<TechynicalCareer[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const loadCareers = (): Promise<void> => {

        setLoading(true);

        return getTechnicalCareerService.getCareers()
            .then((response: CarreraTecnica[]) => {
                const careers: TechynicalCareer[] = response.map(career => ({
                    careerId: career.carreraId,
                    name: career.nombre,
                    description: career.descripcion,
                    subTitle: career.subTitulo,
                    image: career.imagen
                }));
                setCareers(careers);
            })
            .catch(error => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Carreras Técnicas',
                    text: error?.message || 'No fue posible cargar las carreras técnicas.'
                });

            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        loadCareers();
    }, []);

    const filteredCareers = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) {
            return careers;
        }
        return careers.filter((career) =>
            career.name.toLowerCase().includes(value)
        );
    }, [careers, search]);

    const totalCareers = careers.length;
    const careersWithImage = careers.filter(
        career => career.image
    ).length;

    const careersWithoutImage = totalCareers - careersWithImage;

    const handleDetail = (career: TechynicalCareer) => {
        console.log('Detalle:', career);
    };


    const handleAssign = (career: TechynicalCareer) => {
        console.log('Asignar:', career);
    };


    const handleNewCareer = () => {
        console.log('Nueva carrera');
    };


    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 4
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: {
                        xs: 'flex-start',
                        md: 'center'
                    },
                    flexDirection: {
                        xs: 'column',
                        md: 'row'
                    },
                    gap: 2,
                    mb: 4
                }}
            >

                <Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            mb: 0.5
                        }}
                    >
                        Educación
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: '#102A43'
                        }}
                    >
                        Carreras Técnicas
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mt: 0.5
                        }}
                    >
                        Explora y gestiona las carreras técnicas disponibles
                        en el portal.
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={handleNewCareer}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.3,
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: 'none'
                    }}
                >
                    Nueva carrera
                </Button>

            </Box>

            <Grid
                container
                spacing={2}
                sx={{
                    mb: 4
                }}
            >

                <Grid size={{ xs: 12, sm: 4 }}>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            height: '100%'
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >

                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2,
                                    backgroundColor: '#E8F1FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >

                                <SchoolOutlined
                                    sx={{
                                        color: 'primary.main',
                                        fontSize: 28
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#102A43'
                                    }}
                                >
                                    {totalCareers}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total de carreras
                                </Typography>

                            </Box>

                        </Box>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            height: '100%'
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >

                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2,
                                    backgroundColor: '#E5F8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >

                                <ImageOutlined
                                    sx={{
                                        color: '#16A979',
                                        fontSize: 28
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#102A43'
                                    }}
                                >
                                    {careersWithImage}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Con imagen
                                </Typography>

                            </Box>

                        </Box>

                    </Paper>

                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                            height: '100%'
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >

                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2,
                                    backgroundColor: '#FFF4D6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >

                                <ImageOutlined
                                    sx={{
                                        color: '#D99A00',
                                        fontSize: 28
                                    }}
                                />

                            </Box>


                            <Box>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#102A43'
                                    }}
                                >
                                    {careersWithoutImage}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Sin imagen
                                </Typography>

                            </Box>

                        </Box>

                    </Paper>

                </Grid>

            </Grid>

            <Box
                sx={{
                    mb: 3
                }}
            >

                <TextField
                    fullWidth
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar carrera técnica..."
                    variant="outlined"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: search && (
                                <InputAdornment position="end">

                                    <Tooltip title="Limpiar búsqueda">

                                        <IconButton
                                            size="small"
                                            onClick={() => setSearch('')}
                                        >
                                            <CloseOutlined fontSize="small" />
                                        </IconButton>

                                    </Tooltip>

                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: 'white'
                        }
                    }}
                />

            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {filteredCareers.length} carrera
                    {filteredCareers.length !== 1 ? 's' : ''} encontrada
                    {filteredCareers.length !== 1 ? 's' : ''}
                </Typography>

            </Box>

            {loading && (

                <Grid container spacing={3}>

                    {[1, 2, 3, 4, 5, 6].map((item) => (

                        <Grid
                            key={item}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3
                            }}
                        >

                            <Card
                                sx={{
                                    borderRadius: 3
                                }}
                            >

                                <Skeleton
                                    variant="rectangular"
                                    height={170}
                                />

                                <CardContent>

                                    <Skeleton width="40%" />

                                    <Skeleton
                                        width="85%"
                                        height={30}
                                    />

                                    <Skeleton width="100%" />
                                    <Skeleton width="80%" />

                                </CardContent>

                            </Card>

                        </Grid>

                    ))}

                </Grid>

            )}

            {!loading && filteredCareers.length === 0 && (

                <Paper
                    elevation={0}
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 3
                    }}
                >

                    <SearchOutlined
                        sx={{
                            fontSize: 55,
                            color: 'text.disabled',
                            mb: 1
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        No encontramos carreras
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Intenta realizar una búsqueda diferente.
                    </Typography>

                </Paper>

            )}

            {!loading && filteredCareers.length > 0 && (

                <Grid container spacing={3}>

                    {filteredCareers.map((career) => (

                        <Grid
                            key={career.careerId}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3
                            }}
                        >

                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden',
                                    transition: 'all 0.25s ease',

                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
                                        borderColor: 'primary.light'
                                    }
                                }}
                            >

                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={
                                        career.image
                                            ? `/assets/images/${career.image}`
                                            : '/assets/images/default-career.jpg'
                                    }
                                    alt={career.name}
                                    sx={{
                                        objectFit: 'cover'
                                    }}
                                />

                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        p: 2.5
                                    }}
                                >

                                    <Chip
                                        label="Carrera Técnica"
                                        size="small"
                                        sx={{
                                            mb: 1.5,
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            backgroundColor: '#E8F1FF'
                                        }}
                                    />


                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#102A43',
                                            lineHeight: 1.25,
                                            mb: 1
                                        }}
                                    >
                                        {career.name}
                                    </Typography>


                                    <Box
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',

                                            '& p': {
                                                margin: 0
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: career.description
                                        }}
                                    />

                                </CardContent>


                                {/* ACCIONES */}

                                <CardActions
                                    sx={{
                                        px: 2.5,
                                        pb: 2.5,
                                        pt: 0,
                                        gap: 1
                                    }}
                                >

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<VisibilityOutlined />}
                                        onClick={() => handleDetail(career)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 700
                                        }}
                                    >
                                        Detalle
                                    </Button>


                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<GroupAddOutlined />}
                                        onClick={() => handleAssign(career)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            boxShadow: 'none'
                                        }}
                                    >
                                        Asignar
                                    </Button>

                                </CardActions>

                            </Card>

                        </Grid>

                    ))}

                </Grid>

            )}

            {!loading && filteredCareers.length > 0 && (

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 4
                    }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Mostrando {filteredCareers.length} de {careers.length} carreras
                    </Typography>


                    <Button
                        endIcon={<ArrowForwardOutlined />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Ver todas
                    </Button>

                </Box>

            )}

        </Container>
    );
};


