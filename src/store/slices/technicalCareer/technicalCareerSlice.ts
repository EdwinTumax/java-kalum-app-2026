import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TechynicalCareer } from "../../../interfaces/TechnicalCareer";
import type { TechnicalCareer } from "../../../interfaces/career/TechnicalCareer";
import type { UpdateTechnicalCareerRequest } from "../../../interfaces/career/UpdateTechnicalCareerRequest";

interface TechnicalCareerState {
    technicalCareers: TechynicalCareer[];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;
}

const initialState: TechnicalCareerState = {
    technicalCareers: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null
}

const technicalCareerSlice = createSlice({
    name: 'technicalCareer',
    initialState,
    reducers: {
        getTechnicalCareersStart(state) {
            state.loading = true;
            state.error = null;
        },
        getTechnicalCareersSuccess(state, action: PayloadAction<TechnicalCareer[]>) {
            state.loading = false;
            state.technicalCareers = action.payload;
            state.error = null;
        },
        getTechnicalCareersError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        clearTechnicalCareers(state) {
            state.technicalCareers = [];
            state.error = null;
        },
        createTechnicalCareerStart(state) {
            state.creating = true;
            state.error = null;
        },
        createTechnicalCareerSuccess(state, action: PayloadAction<TechnicalCareer>) {
            state.creating = false;
            const exists = state.technicalCareers.some(technicalCareer => technicalCareer.careerId === action.payload.careerId);
            if (!exists) {
                state.technicalCareers.push(action.payload);
            }
            state.error = null;
        },
        createTechnicalCareerError(state, action: PayloadAction<string>) {
            state.creating = false;
            state.error = action.payload;
        },
        clearTechnicalCareerError(state) {
            state.error = null;
        },
        updateTechnicalCareerStart(state) {
            state.updating = true;
            state.error = null;
        },
        updateTechnicalCareerSuccess(state, action: PayloadAction<{ careerId: string; technicalCareer: UpdateTechnicalCareerRequest }>) {
            const index = state.technicalCareers.findIndex(technicalCareer => technicalCareer.careerId === action.payload.careerId);
            if (index !== -1) {
                state.technicalCareers[index] = {
                    ...state.technicalCareers[index],
                    ...action.payload.technicalCareer
                };
            }
            state.updating = false;
            state.error = null;
        },
        udpateTechnicalCareerError(state, action: PayloadAction<string>) {
            state.updating = false;
            state.error = action.payload;
        },
        deleteTechnicalCareerStart(state) {
            state.deleting = true;
            state.error = null;
        },
        deleteTechnicalCareerSuccess(state, action: PayloadAction<string>) {
            state.technicalCareers = state.technicalCareers.filter(technicalCareer => technicalCareer.careerId !== action.payload);
            state.deleting = false;
            state.error = null;
        },
        deleteTechnicalCareerError(state, action: PayloadAction<string>) {
            state.deleting = false;
            state.error = action.payload;
        }
    }
});

export const {
    getTechnicalCareersStart, 
    getTechnicalCareersSuccess, 
    getTechnicalCareersError, 
    clearTechnicalCareers, 
    createTechnicalCareerStart, 
    createTechnicalCareerSuccess, 
    createTechnicalCareerError, 
    clearTechnicalCareerError,
    updateTechnicalCareerStart,
    updateTechnicalCareerSuccess,
    udpateTechnicalCareerError,
    deleteTechnicalCareerStart,
    deleteTechnicalCareerSuccess,
    deleteTechnicalCareerError    
} = technicalCareerSlice.actions;

export default technicalCareerSlice.reducer;