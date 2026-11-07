
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRole } from '../../hooks/useRole';
import { clearRoleError } from '../../store/slices/role/roleSlice';
import type { Role } from '../../interfaces/role/Role';
import { RoleModal } from './RoleModal';
import Swal from 'sweetalert2';

import {
    Alert,
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

import {
    AddOutlined,
    DeleteOutlined,
    EditOutlined,
    GroupsOutlined,
    ShieldOutlined,
    ManageAccountsOutlined,
    SearchOutlined,
    RefreshOutlined,
    SecurityOutlined
} from '@mui/icons-material';

export const RoleList = () => {

    const dispatch = useDispatch();

    const {
        roles,
        loading,
        getRoles,
        deleteRole
    } = useRole();

    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    useEffect(() => {
        getRoles();
    }, []);

    // FILTRAR ROLES

    const filteredRoles = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return roles;

        return roles.filter(role =>
            String(role.name ?? '').toLowerCase().includes(term)
        );
    }, [roles, search]);

    // ESTADÍSTICAS

    const adminCount = useMemo(
        () => roles.filter(role =>
            role.name?.toLowerCase().includes('admin')
        ).length,
        [roles]
    );

    const otherRoles = roles.length - adminCount;

    // MODALES

    const handleOpenCreate = () => {
        dispatch(clearRoleError());
        setSelectedRole(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (role: Role) => {
        dispatch(clearRoleError());
        setSelectedRole(role);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRole(null);
    };

    // ELIMINAR ROL

    const handleDelete = async (role: Role) => {

        const result = await Swal.fire({
            title: '¿Eliminar rol?',
            text: `Se eliminará el rol ${role.name}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d32f2f',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await deleteRole(role.roleId);

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

    const getRoleColor = (
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
                        Gestión de roles
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Administra los roles y permisos de acceso al sistema.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Actualizar listado">
                        <span>
                            <IconButton
                                onClick={() => getRoles()}
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
                        Nuevo rol
                    </Button>
                </Box>
            </Box>

            {/* TARJETAS DE RESUMEN */}

            <Grid container spacing={2.5} sx={{ mb: 4 }}>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Total de roles"
                        value={roles.length}
                        subtitle="Roles registrados en el sistema"
                        icon={<GroupsOutlined />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Roles administrativos"
                        value={adminCount}
                        subtitle="Roles con permisos administrativos"
                        icon={<ShieldOutlined />}
                        color="#9c27b0"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Otros roles"
                        value={otherRoles}
                        subtitle="Roles adicionales del sistema"
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
                                Roles registrados
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Consulta y administra los roles disponibles.
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar rol..."
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
                                <TableCell>Rol</TableCell>
                                <TableCell>Identificador</TableCell>
                                <TableCell>Clasificación</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {loading ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} />

                                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                                            Cargando roles...
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : filteredRoles.length === 0 ? (

                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                        <SecurityOutlined
                                            sx={{
                                                fontSize: 48,
                                                color: 'text.disabled'
                                            }}
                                        />

                                        <Typography sx={{ fontWeight: 600 }}>
                                            No se encontraron roles
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {search
                                                ? 'Intenta con otro criterio de búsqueda.'
                                                : 'Aún no existen roles registrados.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                            ) : (

                                filteredRoles.map((role: Role, index: number) => (

                                    <TableRow
                                        key={role.roleId}
                                        hover
                                        sx={{
                                            '& td': {
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                py: 2
                                            }
                                        }}
                                    >

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
                                                    <ShieldOutlined />
                                                </Avatar>

                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        {role.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Rol del sistema
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {/* IDENTIFICADOR */}

                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {index + 1}
                                            </Typography>
                                        </TableCell>

                                        {/* CLASIFICACIÓN */}

                                        <TableCell>
                                            <Chip
                                                label={
                                                    role.name?.toLowerCase().includes('admin')
                                                        ? 'Administrativo'
                                                        : 'Estándar'
                                                }
                                                color={getRoleColor(role.name)}
                                                variant="outlined"
                                                size="small"
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
                                                <Tooltip title="Editar rol" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEdit(role)}
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Eliminar rol" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(role)}
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
                            Mostrando {filteredRoles.length} de {roles.length} roles registrados
                        </Typography>
                    </Box>
                )}

            </Paper>

            {/* MODAL */}

            <RoleModal
                open={openModal}
                onClose={handleCloseModal}
                role={selectedRole}
            />

        </Container>
    );
};
