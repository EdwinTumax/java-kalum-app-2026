
import React, { useEffect, useState } from 'react';
import type { TechnicalCareer } from '../../interfaces/career/TechnicalCareer';
import { useTechnicalCareer } from '../../hooks/useTechnicalCareer';
import Swal from 'sweetalert2';

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

interface TechnicalCareerModalProps {
    open: boolean;
    onClose: () => void;
    technicalCareer: TechnicalCareer | null;
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
    image: ''
};

const ACADEMIC_SERVER_URL = `http://${import.meta.env.VITE_KALUM_API_ACADEMIC_HOST}:${import.meta.env.VITE_KALUM_API_ACADEMIC_PORT}`;


const getImageUrl = (imagePath: string) => {
    return `${ACADEMIC_SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};


export const TechnicalCareerModal = ({
    open,
    onClose,
    technicalCareer
}: TechnicalCareerModalProps) => {

    const {
        createTechnicalCareer,
        updateTechnicalCareer,
        creating,
        updating,
        clearTechnicalCareerError
    } = useTechnicalCareer();

    const [form, setForm] = useState<TechnicalCareerForm>(initialForm);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const saving = creating || updating;
    const isEditing = Boolean(technicalCareer);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormError(null);
        setSelectedImage(null);

        if (technicalCareer) {
            setForm({
                name: technicalCareer.name ?? '',
                description: technicalCareer.description ?? '',
                subTitle: technicalCareer.subTitle ?? '',
                image: technicalCareer.image ?? ''
            });

            setImagePreview(
                technicalCareer.image
                    ? getImageUrl(technicalCareer.image)
                    : null
            );
        } else {
            setForm(initialForm);
            setImagePreview(null);
        }

        clearTechnicalCareerError();

    }, [open, technicalCareer?.careerId]);

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (
        field: keyof Omit<TechnicalCareerForm, 'image'>,
        value: string
    ) => {
        setForm(previous => ({
            ...previous,
            [field]: value
        }));
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = event.target.files?.[0];

        if (!file) return;

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setFormError('Solamente se permiten imágenes JPG y PNG');
            event.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFormError('La imagen no debe superar los 5 MB');
            event.target.value = '';
            return;
        }

        setFormError(null);
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));

        event.target.value = '';
    };

    const handlerClose = () => {

        if (saving) return;

        setForm(initialForm);
        setSelectedImage(null);
        setImagePreview(null);
        setFormError(null);

        clearTechnicalCareerError();

        onClose();
    };

    const handlerSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setFormError(null);

        const formData = new FormData();

        formData.append('name', form.name.trim());
        formData.append('description', form.description.trim());
        formData.append('subTitle', form.subTitle.trim());

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {

            if (isEditing && technicalCareer) {

                await updateTechnicalCareer(
                    technicalCareer.careerId,
                    formData
                );

                await Swal.fire({
                    icon: 'success',
                    title: 'Carrera técnica actualizada',
                    text: 'Los cambios se guardaron correctamente',
                    confirmButtonText: 'Aceptar'
                });

                handlerClose();

            } else {

                const response = await createTechnicalCareer(formData);

                if (!response.success || !response.data) {

                    setFormError(
                        response.errors?.[0] ??
                        response.message ??
                        'No se pudo crear la carrera técnica'
                    );

                    return;
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Carrera técnica creada',
                    text: 'La carrera técnica se creó correctamente',
                    confirmButtonText: 'Aceptar'
                });

                handlerClose();
            }

        } catch (error: any) {

            setFormError(
                error?.response?.data?.message ??
                error?.message ??
                'Ocurrió un error al guardar la carrera técnica'
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handlerClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                {isEditing
                    ? 'Editar Carrera Técnica'
                    : 'Crear Carrera Técnica'}
            </DialogTitle>

            <Box component="form" onSubmit={handlerSubmit}>

                <DialogContent>

                    {formError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {formError}
                        </Alert>
                    )}

                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={form.name}
                        onChange={e =>
                            handleChange('name', e.target.value)
                        }
                        required
                    />

                    <TextField
                        label="Descripción"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={e =>
                            handleChange('description', e.target.value)
                        }
                        required
                    />

                    <TextField
                        label="Subtítulo"
                        fullWidth
                        margin="normal"
                        value={form.subTitle}
                        onChange={e =>
                            handleChange('subTitle', e.target.value)
                        }
                        required
                    />

                    <Box sx={{ mt: 3 }}>

                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1 }}
                        >
                            Imagen de la carrera técnica
                        </Typography>

                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            startIcon={<ImageOutlinedIcon />}
                        >
                            Seleccionar imagen

                            <input
                                type="file"
                                hidden
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                            />
                        </Button>

                        {imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>

                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="Imagen de carrera técnica"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 300,
                                        height: 180,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '1px solid #ddd'
                                    }}
                                />

                            </Box>
                        )}

                        {selectedImage && (
                            <Alert
                                severity="info"
                                sx={{ mt: 2 }}
                            >
                                Imagen seleccionada: {selectedImage.name}
                            </Alert>
                        )}

                        {!imagePreview && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 1 }}
                            >
                                Formatos permitidos: JPG y PNG. Máximo 5 MB.
                            </Typography>
                        )}

                    </Box>

                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handlerClose}
                        disabled={saving}
                        sx={{ minWidth: 140 }}
                        startIcon={<CancelIcon />}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        startIcon={<SaveIcon />}
                    >
                        {saving
                            ? 'Guardando...'
                            : isEditing
                                ? 'Actualizar'
                                : 'Guardar'}
                    </Button>

                </DialogActions>

            </Box>

        </Dialog>
    );
};
