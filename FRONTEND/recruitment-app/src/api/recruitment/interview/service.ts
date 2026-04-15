import { formatParam } from "@/pages/recruitment/request/form";
import api from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { DocumentDTO } from "../service";

const CAN_PLAN_BASE_KEY = ['userCanPlanInterview'] as const;
const CAN_PLAN_CANDIDATURE_BASE_KEY = ['userCanPlanInterviewByCandidature'] as const;
const PLANINGS_BASE_KEY = ['jobInterviewPlanings'] as const;
const apiBaseUrl = "/api/recruitment/job-interviews";

export interface PlaningFormDTO {
    candidatureId: string;
    validatorId: string;
    dateTime: string;
}

export interface PlaningDTO {
    id: string;
    candidatureId: string;
    validatorId: string;
    dateTime: string | null;
    validator: DocumentDTO;
    candidature: DocumentDTO;
    createdAt: string;
    updatedAt: string | null;
}

export interface UpdateDateTimeDTO {
    planingId: string;
    dateTime: Date;
}

export const useCanUserPlanJobInterview = (userId: string, jobId: string) => {
    const queryKey = [...CAN_PLAN_BASE_KEY, { userId, jobId }] as const;

    return useQuery<{ canPlan: boolean; required: boolean }, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(
                    `${apiBaseUrl}/users/${userId}/can-plan/${formatParam(jobId)}`
                );

                return response.data.data;
            } 
            catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
        // Activer seulement si les deux existent
        enabled: !!userId && !!jobId,
    });
};

export const useCanUserPlanJobInterviewByCandidature = (userId: string, candId: string) => {
    const queryKey = [...CAN_PLAN_CANDIDATURE_BASE_KEY, { userId, candId }] as const;

    return useQuery<boolean, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(
                    `${apiBaseUrl}/users/${userId}/can-plan-candidature/${formatParam(candId)}`
                );

                return response.data.data;
            } 
            catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
        // Activer seulement si les deux existent
        enabled: !!userId && !!candId,
    });
};


export const useAddJobInterviewPlaning = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PlaningFormDTO) => {
            const response = await api.post(`${apiBaseUrl}/planings`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PLANINGS_BASE_KEY
            });
        }
    });
};

export const usePassToNextInterviewer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (candId: string) => {
            const response = await api.post(`${apiBaseUrl}/next-validator/${formatParam(candId)}`);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PLANINGS_BASE_KEY
            });
            queryClient.refetchQueries({
                queryKey: CAN_PLAN_CANDIDATURE_BASE_KEY
            })
        }
    });
};

export const useGetPlaningsToDoForUser = (userId?: string, filters?: {
    minDate?: string;
    maxDate?: string;
}, page?: number, pageSize?: number) => {

    const queryKey = [...PLANINGS_BASE_KEY, { userId,
        dateMin: filters?.minDate,
        dateMax: filters?.maxDate,
     page, pageSize }] as const;

    return useQuery<{planings:PlaningDTO[], totalCount: number}, Error>({
        queryKey,
        queryFn: async () => {
            if (!userId) throw new Error("userId requis");

            const response = await api.get(`${apiBaseUrl}/users/${userId}/planings`, {
                params: {
                    dateMin: filters?.minDate,
                    dateMax: filters?.maxDate,
                    page, pageSize
                }
            });
            return response.data.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 // 1 minute
    });
};


export const useUpdatePlaningDateTime = () => {
    const queryClient = useQueryClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useMutation<any, Error, UpdateDateTimeDTO>({
        mutationFn: async ({planingId, dateTime}) => {
            if(!planingId) throw new Error("ID de planification requis");
            if(!dateTime) throw new Error("Nouvelle date et heure requises");

            const response = await api.put(`${apiBaseUrl}/planings/${formatParam(planingId)}`,
            {
                dateTime: dateTime.toISOString()
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: PLANINGS_BASE_KEY
            });
        }
    });
};
