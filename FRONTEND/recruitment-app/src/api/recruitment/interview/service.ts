import { formatParam } from "@/pages/recruitment/request/form";
import api from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const CAN_PLAN_BASE_KEY = ['userCanPlanInterview'] as const;
const CAN_PLAN_CANDIDATURE_BASE_KEY = ['userCanPlanInterviewByCandidature'] as const;
const PLANINGS_BASE_KEY = ['jobInterviewPlanings'] as const;
const apiBaseUrl = "/api/recruitment/job-interviews";

export interface PlaningFormDTO {
    candidatureId: string;
    validatorId: string;
    dateTime: string;
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
