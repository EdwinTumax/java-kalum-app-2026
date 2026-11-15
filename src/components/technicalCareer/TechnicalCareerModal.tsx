import React, { useEffect, useState } from 'react'
import type { TechnicalCareer } from '../../interfaces/career/TechnicalCareer';
import { useTechnicalCareer } from '../../hooks/useTechnicalCareer';
import type { UpdateTechnicalCareerRequest } from '../../interfaces/career/UpdateTechnicalCareerRequest';
import Swal from 'sweetalert2';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

interface TechnicalCareerModalProps {
    open: boolean;
    onClose: () => void;
    technicalCareer: TechnicalCareer | null
}

interface TechnicalCareerForm {
    name: string;
    description: string;
    subTitle: string;
    image: string;

}

const initialForm: TechnicalCareerForm = {
    name: '',
    description: '',
    subTitle: '',
    image: 'default.png'
}


export const TechnicalCareerModal = ({ open, onClose, technicalCareer = null }: TechnicalCareerModalProps) => {
    const { createTechnicalCareer, updateTechnicalCareer, creating, updating, clearTechnicalCareerError } = useTechnicalCareer();
    const [form, setForm] = useState<TechnicalCareerForm>(initialForm);
    const [formError, setFormError] = useState<string | null>(null);
    const saving = creating || updating;
    const isEditing = Boolean(technicalCareer);


    useEffect(() => {
        if (open) {
            setFormError(null);
            clearTechnicalCareerError();
            if (technicalCareer) {
                setForm({
                    name: technicalCareer.name,
                    description: technicalCareer.description,
                    subTitle: technicalCareer.subTitle,
                    image: technicalCareer.image ? 'technicalCareer.image' : 'default.png'
                });
            }
        } else {
            setForm(initialForm);
        }
    }, [open, technicalCareer]);

    const handleChange = (field: keyof TechnicalCareerForm, value: string) => {
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
        clearTechnicalCareerError();
        onClose()
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        try {
            if (isEditing && technicalCareer) {
                const updatePayload: UpdateTechnicalCareerRequest = {
                    name: form.name.trim(),
                    description: form.description.trim(),
                    subTitle: form.subTitle.trim(),
                    image: form.image
                };
                await updateTechnicalCareer(technicalCareer.careerId, updatePayload);
                await Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: 'Los cambios se guardaron correctamente',
                    confirmButtonText: 'Aceptar'
                });
                onClose();
            } else {
                const response = await createTechnicalCareer({ careerId: '', name: form.name.trim(), description: form.description.trim(), subTitle: form.subTitle.trim(), image: form.image.trim() })
                if (!response.success || !response.data) {
                    setFormError(response.errors?.[0] ?? response.message ?? 'No se pudo crear la carrera técnica');
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
                {isEditing ? 'Editar TechnicalCareer' : 'Creear TechnicalCareer'}
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
