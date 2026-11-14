
import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import type { User } from '../../interfaces/user/User';
import { UserModal } from './UserModal';
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
    Stack,
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
    EditOutlined,
    GroupsOutlined,
    ManageAccountsOutlined,
    SearchOutlined,
    ShieldOutlined,
    EmailOutlined,
    PhoneOutlined,
    RefreshOutlined
} from '@mui/icons-material';

import {
    DeleteOutlined, PersonOutlined
} from '@mui/icons-material';

export const UserList: React.FC = () => {

    const {
        users,
        loading,
        error,
        getUsers,
        clearUserError,
        deleteUser
    } = useUser();

    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return users;

        return users.filter(user =>
            [
                user.username,
                user.firstName,
                user.lastName,
                user.email,
                user.phoneNumber,
                user.applicationNumber,
                user.roles
            ].some(value =>
                String(value ?? '').toLowerCase().includes(term)
            )
        );
    }, [users, search]);

    const adminCount = useMemo(
        () => users.filter(user =>
            String(user.roles ?? '').toLowerCase().includes('admin')
        ).length,
        [users]
    );

    const handleOpenCreate = () => {
        clearUserError();
        setSelectedUser(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (user: User) => {
        clearUserError();
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    const handleDelete = async (user: User) => {
        const result = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: `Se eliminará el usuario ${user.username}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d32f2f',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUser(user.userId);

            await Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario se eliminó correctamente.',
                confirmButtonText: 'Aceptar'
            });

        } catch (error: unknown) {
            await Swal.fire({
                icon: 'error',
                title: 'No fue posible eliminar',
                text: error instanceof Error
                    ? error.message
                    : 'Ocurrió un error inesperado.'
            });
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
    };

    const getRoleColor = (role: string) => {
        if (role?.toLowerCase().includes('admin')) return 'primary';
        if (role?.toLowerCase().includes('teacher')) return 'success';
        return 'default';
    };

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
                <Stack direction="row" spacing={2}
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2">
                            {title}
                        </Typography>

                        <Typography variant="h4"  sx={{ my: 1, fontWeight: 800 }}>
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
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>

            {/* ENCABEZADO */}

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4,  justifyContent:"space-between", alignItems: { xs: 'flex-start', sm: 'center' }}}
            >
                <Box>
                    <Typography variant="h4" sx={{fontWeight:800}} >
                        Gestión de usuarios
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Administra las cuentas, perfiles y permisos de acceso.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Tooltip title="Actualizar listado">
                        <IconButton
                            onClick={() => getUsers()}
                            disabled={loading}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <RefreshOutlined />
                        </IconButton>
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
                        Nuevo usuario
                    </Button>
                </Stack>
            </Stack>

            {/* TARJETAS DE RESUMEN */}

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Total de usuarios"
                        value={users.length}
                        subtitle="Cuentas registradas"
                        icon={<GroupsOutlined />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Administradores"
                        value={adminCount}
                        subtitle="Usuarios con permisos administrativos"
                        icon={<ShieldOutlined />}
                        color="#9c27b0"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <SummaryCard
                        title="Usuarios estándar"
                        value={users.length - adminCount}
                        subtitle="Cuentas sin rol administrativo"
                        icon={<ManageAccountsOutlined />}
                        color="#2e7d32"
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
                <Box sx={{ p: 3 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{justifyContent:"space-between", alignItems: { xs: 'stretch', sm: 'center' }}}                        
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h6" sx={{fontWeight:700}}>
                                Usuarios registrados
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Consulta y administra los usuarios del sistema.
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar usuario..."
                            sx={{
                                width: { xs: '100%', sm: 320 },
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
                    </Stack>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        onClose={clearUserError}
                        sx={{ mx: 3, mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 900 }}>

                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: 'action.hover',
                                    '& th': {
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        fontSize: '0.78rem',
                                        textTransform: 'uppercase',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            >
                                <TableCell>Usuario</TableCell>
                                <TableCell>Identificación</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Rol asignado</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <CircularProgress size={32} />
                                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                                            Cargando usuarios...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <PersonOutlined
                                            sx={{
                                                fontSize: 48,
                                                color: 'text.disabled'
                                            }}
                                        />

                                        <Typography sx={{fontWeight:600}}>
                                            No se encontraron usuarios
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {search
                                                ? 'Intenta con otro criterio de búsqueda.'
                                                : 'Aún no existen usuarios registrados.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map(user => (
                                    <TableRow
                                        key={user.userId}
                                        hover
                                        sx={{
                                            '& td': {
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                                py: 2
                                            }
                                        }}
                                    >

                                        {/* USUARIO */}

                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        fontSize: 14,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {getInitials(user.firstName, user.lastName)}
                                                </Avatar>

                                                <Box>
                                                    <Typography sx={{fontWeight:700}} variant="body2">
                                                        {user.firstName} {user.lastName}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        @{user.username}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        {/* IDENTIFICACIÓN */}

                                        <TableCell>
                                            <Typography variant="body2">
                                                {user.applicationNumber || '—'}
                                            </Typography>
                                        </TableCell>

                                        {/* CORREO */}

                                        <TableCell>
                                            <Stack direction="row" sx={{alignItems:"center"}} spacing={1}>
                                                <EmailOutlined
                                                    fontSize="small"
                                                    color="action"
                                                />
                                                <Typography variant="body2">
                                                    {user.email || '—'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* TELÉFONO */}

                                        <TableCell>
                                            <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
                                                <PhoneOutlined
                                                    fontSize="small"
                                                    color="action"
                                                />
                                                <Typography variant="body2">
                                                    {user.phoneNumber || '—'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* ROL */}

                                        <TableCell>
                                            <Chip
                                                label={user.roles || 'Sin rol'}
                                                size="small"
                                                color={getRoleColor(user.roles)}
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 1.5
                                                }}
                                            />
                                        </TableCell>

                                        {/* ACCIONES */}

                                        <TableCell align="center">
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                sx={{justifyContent:"center"}}                                                
                                            >
                                                <Tooltip title="Editar usuario">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEdit(user)}
                                                    >
                                                        <EditOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Eliminar usuario">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        <DeleteOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>

                                    </TableRow>
                                ))
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>

                {/* PIE DE TABLA */}

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
                            Mostrando {filteredUsers.length} de {users.length} usuarios registrados
                        </Typography>
                    </Box>
                )}
            </Paper>

            <UserModal
                open={openModal}
                onClose={handleClose}
                user={selectedUser}
            />

        </Container>
    );
};
