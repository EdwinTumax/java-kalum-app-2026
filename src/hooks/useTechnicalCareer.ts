import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { clearTechnicalCareerError, createTechnicalCareerError, createTechnicalCareerStart, createTechnicalCareerSuccess, deleteTechnicalCareerError, deleteTechnicalCareerStart, deleteTechnicalCareerSuccess, getTechnicalCareersError, getTechnicalCareersStart, getTechnicalCareersSuccess, udpateTechnicalCareerError, updateTechnicalCareerStart, updateTechnicalCareerSuccess } from "../store/slices/technicalCareer/technicalCareerSlice";
import { technicalCareerService } from "../services/TechnicalCareerService";
import type { CreateTechnicalCareerRequest } from "../interfaces/career/CreateTechnicalCareerRequest";
import { ApiException } from "../core/exceptions/ApiException";
import type { UpdateTechnicalCareerRequest } from "../interfaces/career/UpdateTechnicalCareerRequest";

export const useTechnicalCareer = () => {
    const { technicalCareers, loading, creating, updating, deleting,  error } = useSelector((state: RootState) => state.technicalCareer);

    const dispatch = useDispatch<AppDispatch>();

    const getTechnicalCareers = async () => {
        dispatch(getTechnicalCareersStart());
        try {
            const response = await technicalCareerService.getTechnicalCareers();
            if (response.success) {
                dispatch(getTechnicalCareersSuccess(response.data));
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al obtener la información de los technicalCareers';
                dispatch(getTechnicalCareersError(message));
            }
            return response;
        } catch (error: any) {
            const apiError = error.response?.data;
            const message = apiError ?? error?.[0] ?? apiError?.message ?? 'Error al comunicarse al servicio de technicalCareers';
            dispatch(getTechnicalCareersError(message));
            throw error;
        }
    }

    const createTechnicalCareer = async (technicalCareer: CreateTechnicalCareerRequest) => {
        dispatch(createTechnicalCareerStart());
        try {
            const response = await technicalCareerService.createTechnicalCareer(technicalCareer);
            if(response.success && response.data) {
                dispatch(createTechnicalCareerSuccess(response.data))
            } else {
                const message = response.errors?.[0] ?? response.message ?? 'Error al crear el role';
                dispatch(createTechnicalCareerError(message));
            }
            return response;
        } catch(error: any) {
            const apiError = error.response?.data;
            const message = apiError?.message ?? apiError?.errors?.[0] ?? 'Error al comunciarse con el servicio de technicalCareers';
            dispatch(createTechnicalCareerError(message));
            throw new ApiException(message, error.response?.status, apiError.errors);            
        }
    }

    const updateTechnicalCareer = async(careerId: string, technicalCareerData: UpdateTechnicalCareerRequest) => {
        dispatch(updateTechnicalCareerStart());
        try {
            await technicalCareerService.updateTechnicalCareer(careerId, technicalCareerData);
            dispatch(updateTechnicalCareerSuccess({careerId,technicalCareer: technicalCareerData}));
        } catch(error: any) {
            const message = getErrorMessage(error,'Error al actualizar el technicalCareer');
            dispatch(udpateTechnicalCareerError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const deleteTechnicalCareer = async(technicalCareerId: string) => {
        dispatch(deleteTechnicalCareerStart());
        try {   
            await technicalCareerService.deleteTechnicalCareer(technicalCareerId);
            dispatch(deleteTechnicalCareerSuccess(technicalCareerId));
        }catch(error: any) {
            const message = getErrorMessage(error, 'Error al eliminar el role');
            dispatch(deleteTechnicalCareerError(message));
            throw new ApiException(message, error.response?.status, error.response?.data?.errors);
        }
    }

    const clearTechnicalCareerErrorHandle = () => {
        dispatch(clearTechnicalCareerError());
    }

    return { 
        technicalCareers, 
        loading,
        creating,
        updating,
        deleting,
        error, 
        getTechnicalCareers, 
        createTechnicalCareer, 
        updateTechnicalCareer, 
        deleteTechnicalCareer, 
        clearTechnicalCareerError: clearTechnicalCareerErrorHandle }
}

const getErrorMessage = (error: any, fallback: string) : string => {
    const apiError = error?.response?.data;
    return apiError?.errors?.[0] ?? apiError?.message ?? error?.message ?? fallback;
}