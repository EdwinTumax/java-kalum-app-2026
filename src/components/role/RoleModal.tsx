import React, { useEffect, useState } from 'react'
import { useRole } from '../../hooks/useRole';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import type { Role } from '../../interfaces/role/Role';
import type { UpdateRoleRequest } from '../../interfaces/role/UpdateRoleRequest';

interface RoleModalProps {
    open: boolean;
    onClose: () => void;
    role: Role | null
}

interface RoleForm {
    name: string;
}

const initialForm: RoleForm = {
    name: ''
}


export const RoleModal = ({ open, onClose, role = null }: RoleModalProps) => {
    const { createRole, updateRole, creating, updating, clearRoleError } = useRole();
    const [form, setForm] = useState<RoleForm>(initialForm);
    const [formError, setFormError] = useState<string | null>(null);
    const saving = creating || updating;
    const isEditing = Boolean(role);


    useEffect(() => {
        if (open) {
            setFormError(null);
            clearRoleError();
            if (role) {
                setForm({
                    name: role.name
                });
                console.log(form);
            }
        } else {
            setForm(initialForm);
        }
    }, [open, role]);

    const handleChange = (field: keyof RoleForm, value: string) => {
        setForm(previous => ({
            ...previous,
            [field]: value
        }));
    }

    const handlerClose = () => {
        if (saving) {
            return;
        }
        setForm(initialForm),
            setFormError(null);
        clearRoleError();
        onClose()
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        try {
            if (isEditing && role) {
                const updatePayload: UpdateRoleRequest = {
                    name: form.name.trim()
                };
                await updateRole(role.roleId, updatePayload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: 'Los cambios se guardaron correctamente',
                    confirmButtonText: 'Aceptar'
                });
                onClose();
            } else {
                const response = await createRole({ name: form.name.trim() })
                if (!response.success || !response.data) {
                    setFormError(response.errors?.[0] ?? response.message ?? 'No se pudo crear el role');
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Gestion de roles',
                    text: `Rol creado exitosamente`,
                    footer: '<a href=\"#\">Cualquier inconveniente contacte al administrador</a>'
                }).then(confirm => {
                    if (confirm.isConfirmed) {
                        handlerClose();
                    }
                });
            }
        } catch (error: any) {
            setFormError(error?.message ?? 'Ocurrio un error al guardar el role');
        }
    }

    return (
        <Dialog open={open} onClose={handlerClose} fullWidth maxWidth="sm" >
            <DialogTitle>
                {isEditing ? 'Editar Role' : 'Creear Role'}
            </DialogTitle>
            <Box component="form" onSubmit={handlerSubmit}>
                <DialogContent>
                    { formError && (<Alert security='error' sx={{ mb: 2}}>
                        {formError}
                    </Alert>)}
                    <TextField label="Name" fullWidth margin='normal' value={form.name} onChange={e => handleChange("name", e.target.value)} required />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button type='button' variant='outlined' onClick={handlerClose} disabled={creating} sx={{ minWidth: 140 }} startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='contained' disabled={saving} startIcon={<SaveIcon />}>
                        {saving ? 'Saving...' : isEditing ? 'Actualizar' : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
