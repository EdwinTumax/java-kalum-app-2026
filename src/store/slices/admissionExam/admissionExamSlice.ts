import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdmissionExam } from "../../../interfaces/exam/AdmissionExam";
import type { UpdateAdmissionExamRequest } from "../../../interfaces/exam/UpdateAdmissionExamRequest";

interface AdmissionExamState {
    admissionExams: AdmissionExam[];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    error: string | null;
}

const initialState: AdmissionExamState = {
    admissionExams: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null
}

const admissionExamSlice = createSlice({
    name: 'admissionExam',
    initialState,
    reducers: {
        getAdmissionExamsStart(state) {
            state.loading = true;
            state.error = null;
        },
        getAdmissionExamsSuccess(state, action: PayloadAction<AdmissionExam[]>) {
            state.loading = false;
            state.admissionExams = action.payload;
            state.error = null;
        },
        getAdmissionExamsError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        clearAdmissionExams(state) {
            state.admissionExams = [];
            state.error = null;
        },
        createAdmissionExamStart(state) {
            state.creating = true;
            state.error = null;
        },
        createAdmissionExamSuccess(state, action: PayloadAction<AdmissionExam>) {
            state.creating = false;
            const exists = state.admissionExams.some(admissionExam => admissionExam.examId === action.payload.examId);
            if (!exists) {
                state.admissionExams.push(action.payload);
            }
            state.error = null;
        },
        createAdmissionExamError(state, action: PayloadAction<string>) {
            state.creating = false;
            state.error = action.payload;
        },
        clearAdmissionExamError(state) {
            state.error = null;
        },
        updateAdmissionExamStart(state) {
            state.updating = true;
            state.error = null;
        },
        updateAdmissionExamSuccess(state, action: PayloadAction<{ examId: string; admissionExam: UpdateAdmissionExamRequest }>) {
            const index = state.admissionExams.findIndex(admissionExam => admissionExam.examId === action.payload.examId);
            if (index !== -1) {
                state.admissionExams[index] = {
                    ...state.admissionExams[index],
                    ...action.payload.admissionExam
                };
            }
            state.updating = false;
            state.error = null;
        },
        udpateAdmissionExamError(state, action: PayloadAction<string>) {
            state.updating = false;
            state.error = action.payload;
        },
        deleteAdmissionExamStart(state) {
            state.deleting = true;
            state.error = null;
        },
        deleteAdmissionExamSuccess(state, action: PayloadAction<string>) {
            state.admissionExams = state.admissionExams.filter(admissionExam => admissionExam.examId !== action.payload);
            state.deleting = false;
            state.error = null;
        },
        deleteAdmissionExamError(state, action: PayloadAction<string>) {
            state.deleting = false;
            state.error = action.payload;
        }
    }
});

export const {
    getAdmissionExamsStart, 
    getAdmissionExamsSuccess, 
    getAdmissionExamsError, 
    clearAdmissionExams, 
    createAdmissionExamStart, 
    createAdmissionExamSuccess, 
    createAdmissionExamError, 
    clearAdmissionExamError,
    updateAdmissionExamStart,
    updateAdmissionExamSuccess,
    udpateAdmissionExamError,
    deleteAdmissionExamStart,
    deleteAdmissionExamSuccess,
    deleteAdmissionExamError    
} = admissionExamSlice.actions;

export default admissionExamSlice.reducer;