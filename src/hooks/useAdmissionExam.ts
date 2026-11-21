import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { clearAdmissionExamError, createAdmissionExamError, createAdmissionExamStart, createAdmissionExamSuccess, deleteAdmissionExamError, deleteAdmissionExamStart, deleteAdmissionExamSuccess, getAdmissionExamsError, getAdmissionExamsStart, getAdmissionExamsSuccess, udpateAdmissionExamError, updateAdmissionExamStart, updateAdmissionExamSuccess } from "../store/slices/admissionExam/admissionExamSlice";
import { admissionExamService } from "../services/admissionExamService";
import { ApiException } from "../core/exceptions/ApiException";
import type { UpdateAdmissionExamRequest } from "../interfaces/exam/UpdateAdmissionExamRequest";
import type { CreateAdmissionExamRequest } from "../interfaces/exam/CreateAdmissionExamRequest";

export const useAdmissionExam = () => {
    const { admissionExams, loading, creating, updating, deleting,  error } = useSelector((state: RootState) => state.admissionExam);

    const dispatch = useDispatch<AppDispatch>();

    const getAdmissionExams = async () => {
        dispatch(getAdmissionExamsStart());
        try {
            const response = await admissionExamService.getAdmissionExams();
            if (response.success) {
                dispatch(getAdmissionExamsSuccess(response.data));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al obtener la información de los examenes de admisión';
                dispatch(getAdmissionExamsError(message));
            }
            return response;
        } catch (error: any) {
            const apiError = error.response?.data;
            const message = apiError ?? error?.[0] ?? apiError?.message ?? 'Error al comunicarse al servicio de los examenes de admisión';
            dispatch(getAdmissionExamsError(message));
            throw error;
        }
    }

    const createAdmissionExam = async (admisionExam: CreateAdmissionExamRequest) => {
        dispatch(createAdmissionExamStart());
        try {
            const response = await admissionExamService.createAdmissionExam(admisionExam);
            if(response.success && response.data) {
                dispatch(createAdmissionExamSuccess(response.data))
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al crear el examen de admisión';
                dispatch(createAdmissionExamError(message));
            }
            return response;
        } catch(error: any) {
            const apiError = error.response?.data;
            const message = apiError?.message ?? apiError?.errors?.[0] ?? 'Error al comunciarse con el servicio de los examenes de admisión';
            dispatch(createAdmissionExamError(message));
            throw new ApiException(message, error.response?.status, apiError.errors);            
        }
    }

    const updateAdmissionExam = async(examId: string, admissionExam: UpdateAdmissionExamRequest) => {
        dispatch(updateAdmissionExamStart());
        try {
            const response = await admissionExamService.updateAdmissionExam(examId, admissionExam);
            dispatch(updateAdmissionExamSuccess({examId,admissionExam: response.data}));
        } catch(error: any) {
            const message = getErrorMessage(error,'Error al actualizar el examen de admisión');
            dispatch(udpateAdmissionExamError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const deleteAdmissionExam = async(admissionExamId: string) => {
        dispatch(deleteAdmissionExamStart());
        try {   
            await admissionExamService.deleteAdmissionExam(admissionExamId);
            dispatch(deleteAdmissionExamSuccess(admissionExamId));
        }catch(error: any) {
            const message = getErrorMessage(error, 'Error al eliminar el examen de admisión');
            dispatch(deleteAdmissionExamError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const clearAdmissionExamErrorHandle = () => {
        dispatch(clearAdmissionExamError());
    }

    return { 
        admissionExams, 
        loading,
        creating,
        updating,
        deleting,
        error, 
        getAdmissionExams, 
        createAdmissionExam, 
        updateAdmissionExam, 
        deleteAdmissionExam, 
        clearAdmissionExamError: clearAdmissionExamErrorHandle }
}

const getErrorMessage = (error: any, fallback: string) : string => {
    const apiError = error?.response?.data;
    return apiError?.errors?.[0] ?? apiError?.message ?? error?.message ?? fallback;
}