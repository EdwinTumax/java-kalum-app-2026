import React, { useState } from 'react'
import { useRole } from '../../hooks/useRole';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';

interface RoleModalProps {
    open: boolean;
    onClose: () => void;
}


export const RoleModal = ({ open, onClose }: RoleModalProps) => {
    const { createRole, creating, clearRoleError } = useRole();
    const [name, setName] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await createRole({ name });
            if (response.success) {
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
        } catch (errorApi: any) {
            Swal.fire({
                icon: 'error',
                title: 'Gestion de roles',
                text: `${errorApi.message}`,
                footer: '<a href=\"#\">Cualquier inconveniente contacte al administrador</a>'
            }).then(confirm => {
                if (confirm.isConfirmed) {
                    dispatch(clearRoleError());
                }
            });
        }

    }

    const handlerClose = () => {
        setName('');
        onClose()
    }

    return (
        <Dialog open={open} onClose={handlerClose} fullWidth maxWidth="sm" >
            <DialogTitle>
                Crear Role
            </DialogTitle>
            <Box component="form" onSubmit={handlerSubmit}>
                <DialogContent>
                    <TextField label="Name" fullWidth margin='normal' value={name} onChange={(e) => setName(e.target.value)} required />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button type='button' variant='outlined' onClick={handlerClose} disabled={creating} sx={{ minWidth: 140 }} startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                    <Button type='button' variant='contained' disabled={creating} sx={{ minWidth: 140 }} startIcon={<SaveIcon />} onClick={handlerSubmit}>
                        {creating ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
