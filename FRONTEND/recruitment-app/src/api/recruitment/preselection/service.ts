import api from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface LangageDTO {
    id: string;
    name: string;
}

export interface SpeakingLevelDTO {
    id: string;
    name: string;
}

export interface PreselectionCriterionItemDTO {
    id: string;
    criterion: string;
    coefficient: number;
    score: number;
}

export interface PreselectionCriterionDTO {
    criteria: PreselectionCriterionItemDTO[];
    totalScore: number;
}

const LANGAGE_BASE_KEY = ['langages'] as const;
const SPEAKING_LEVEL_BASE_KEY = ['levels'] as const;
const PRESELECTION_CRITERIA_BASE_KEY = ['criteria'] as const;


export const useSearchLangages = () => {
    const queryKey = [...LANGAGE_BASE_KEY] as const;

    return useQuery<LangageDTO[], Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/Preselections/langages`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        }
    });
};


export const useSearchSpeakingLevels = () => {
    const queryKey = [...SPEAKING_LEVEL_BASE_KEY] as const;

    return useQuery<SpeakingLevelDTO[], Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/Preselections/speaking-levels`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        }
    });
};


export const useSearchCriteria = () => {
    const queryKey = [...PRESELECTION_CRITERIA_BASE_KEY] as const;

    return useQuery<ApiResponse<PreselectionCriterionDTO>, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/Preselections/criterions`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        }
    });
};


export const useUpdateCriterionCoefficient = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<PreselectionCriterionDTO>, Error,
     { id: string; coefficient: number }>({
        mutationFn: ({ id, coefficient }) => api.put(`/api/recruitment/Preselections/criterions/${id}`, { coefficient })
            .then(r => r.data),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: PRESELECTION_CRITERIA_BASE_KEY 
        }),
    });
};
