import React, { useEffect, useState } from 'react'
import type { AdmissionExam } from '../../interfaces/exam/AdmissionExam';
import { useAdmissionExam } from '../../hooks/useAdmissionExam';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import type { UpdateAdmissionExamRequest } from '../../interfaces/exam/UpdateAdmissionExamRequest';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface AdmissionExamModalProps {
    open: boolean;
    onClose: () => void;
    admissionExam: AdmissionExam | null;
}

interface AdmissionExamForm {
    examDate: string;
}

const initialForm: AdmissionExamForm = {
    examDate: ''
};

export const AdmissionExamModal = ({ open, onClose, admissionExam }: AdmissionExamModalProps) => {
    const { createAdmissionExam, updateAdmissionExam, creating, updating, clearAdmissionExamError } = useAdmissionExam();
    const [form, setForm] = useState<AdmissionExamForm>(initialForm);
    const [formError, setFormError] = useState<string | null>(null);
    const saving = creating || updating;
    const isEditing = Boolean(admissionExam);
    const examDateValue: Dayjs | null = form.examDate ? dayjs(form.examDate) : null;

    useEffect(() => {
        if (open) {
            setFormError(null);
            clearAdmissionExamError();
            if (admissionExam) {
                setForm({
                    examDate: admissionExam.examDate
                });
            }
        } else {
            setForm(initialForm);
        }
    }, [open, admissionExam]);

    const handleChange = (field: keyof AdmissionExamForm, value: string) => {
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
        clearAdmissionExamError();
        onClose()
    }

    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        try {
            if (isEditing && admissionExam) {
                const updatePayload: UpdateAdmissionExamRequest = {
                    examDate: form.examDate.trim()
                };
                await updateAdmissionExam(admissionExam.examId, updatePayload);
                await Swal.fire({
                    icon: 'success',
                    title: 'La fecha de examen fue actualizada',
                    text: 'Los cambios se guardaron correctamente',
                    confirmButtonText: 'Aceptar'
                });
                onClose();
            } else {
                console.log(form);
                const response = await createAdmissionExam({ examDate: form.examDate.trim() })
                if (!response.success || !response.data) {
                    setFormError(response.errors?.[0] ?? response.message ?? 'No se pudo crear el examen de admisión');
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Gestion de examenes de admisión',
                    text: `Fecha de examen creado exitosamente`,
                    footer: '<a href=\"#\">Cualquier inconveniente contacte al administrador</a>'
                }).then(confirm => {
                    if (confirm.isConfirmed) {
                        handlerClose();
                    }
                });
            }
        } catch (error: any) {
            setFormError(error?.message ?? 'Ocurrio un error al guardar el examen de admisión');
        }
    }

    return (
        <Dialog open={open} onClose={handlerClose} fullWidth maxWidth="sm" >
            <DialogTitle>
                {isEditing ? 'Editar examen de admisión' : 'Creear nueva fecha de examen de admisión'}
            </DialogTitle>
            <Box component="form" onSubmit={handlerSubmit}>
                <DialogContent>
                    {formError &&
                        (
                            <Alert severity="error" sx={{ mb: 2 }}> {formError}</Alert>
                        )
                    }
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DateTimePicker
                            label="Fecha y hora del examen"
                            value={examDateValue}
                            onChange={(newValue: Dayjs | null) => {
                                handleChange(
                                    "examDate",
                                    newValue && newValue.isValid()
                                        ? newValue.format("YYYY-MM-DDTHH:mm:ss")
                                        : ""
                                );
                            }}
                            format="DD/MM/YYYY HH:mm"
                            ampm={false}
                            views={['year', 'month', 'day', 'hours', 'minutes']}
                            timeSteps={{ hours: 1, minutes: 5 }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    margin: "normal"
                                }
                            }}
                        />
                    </LocalizationProvider>
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
        </Dialog >
    )
}