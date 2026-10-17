import React, { useEffect, useState } from 'react'
import type { User } from '../../interfaces/user/User';
import { useUser } from '../../hooks/useUser';
import type { UpdateUserRequest } from '../../interfaces/user/UpdateUserRequest';
import Swal from 'sweetalert2';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save';


interface UserModalProps {
    open: boolean;
    onClose: () => void;
    user?: User | null
}

interface UserForm {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: string;
}

const initialForm: UserForm = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: 'ROLE_USER'

}


export const UserModal = ({ open, onClose, user = null }: UserModalProps) => {
    const {
        createUser,
        updateUser,
        creating,
        updating,
        clearUserError
    } = useUser();

    const [form, setForm] = useState<UserForm>(initialForm);
    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(user);
    const saving = creating || updating;

    useEffect(() => {
        if(open) {
            setFormError(null);
            clearUserError();
            if(user) {
                setForm({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    password: '',
                    roles: user.roles
                });
            } else {
                setForm(initialForm);
            }
        }
    }, [open,user]);
        
    const handleChange = (field: keyof UserForm, value: string) => {
        setForm(previous => ({
            ...previous,
            [field]: value
        }));
    }

    const handleClose = () => {
        if(saving) {
            return;
        }
        setForm(initialForm);
        setFormError(null);
        clearUserError();
        onClose();
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        try {
            if(isEditing && user) {
                const updatePayload: UpdateUserRequest = {
                    username: form.username.trim(),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    roles: form.roles,
                    ...(form.password ? { password: form.password} : {})
                };
                
                const response = await updateUser(user.userId, updatePayload);
                
                if(!response.success) {
                    setFormError(response.errors?.[0] ?? response.message ?? 'No se pudo actualizar el usuario');
                    return;
                }

                if(!response.data) {
                    setFormError('El servidor no deolvió el usuario actaulziado. Verifica la respuesta de la Api.');
                    return;
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Usuario actualizado',
                    text: response.message || 'Los cambios se guardaron correctamente.'
                });

                onClose();

            } else {
                if(!form.password) {
                    setFormError('La contraseña es obligatoria al crear un usuario.');
                    return;
                }

                const response = await createUser({
                    username: form.username.trim(),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    password: form.password,
                    roles: form.roles
                });

                if(!response.success || !response.data) {
                    setFormError(response.errors?.[0] ?? response.message ?? 'No se pudo crear el usuario');
                    return;
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado',
                    text: response.message || 'El usuario se creo correctamente'
                });

                onClose();
            }

        } catch(error: any) {
            setFormError(error?.message ?? 'Ocurrió un error al guardar el usuario');
        }  
    }


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditing ? 'Editar usuario' : 'Crear usuario'}
            </DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    { formError && (
                        <Alert severity='error' sx={{ mb: 2}}>
                            {formError}
                        </Alert>
                    )}
                    <TextField label='Apellidos' fullWidth margin='normal' value={form.lastName} onChange={event => handleChange("lastName",event.target.value)} autoComplete='lastName' required/>
                    <TextField label='Nombres' fullWidth margin='normal' value={form.firstName} onChange={event => handleChange("firstName",event.target.value)} autoComplete='firstName' required/>
                    <TextField label='Username' fullWidth margin='normal' value={form.username} onChange={event => handleChange("username",event.target.value)} autoComplete='username' required/>
                    <TextField label='Email' fullWidth margin='normal' value={form.email} onChange={event => handleChange("email",event.target.value)} autoComplete='email' required/>
                    <TextField label='Telefono' fullWidth margin='normal' value={form.phoneNumber} onChange={event => handleChange("phoneNumber",event.target.value)} autoComplete='phoneNumber' required/>            
                    <TextField label='Contraseña' type='password' fullWidth margin='normal' value={form.password} onChange={event => handleChange("password",event.target.value)} autoComplete='new-password' required={!isEditing} helperText={isEditing ? 'Déjala vacia para conservar la contraseña actual' : 'Ingresa una contraseña inicial del usuario'}/>     
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3}}>
                    <Button type='button' variant='outlined' onClick={handleClose} disabled={saving} startIcon={<CancelIcon />}>
                        Cancelar
                    </Button>
                    <Button type='submit' variant='contained' disabled={saving} startIcon={<SaveIcon/>}>
                        { saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar' }
                    </Button>
                </DialogActions>

            </Box>
        </Dialog>
    )
}
