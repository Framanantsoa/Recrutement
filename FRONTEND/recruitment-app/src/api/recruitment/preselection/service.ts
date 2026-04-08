import api from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SEARCH_JOB_DESC_BASE_KEY, SEARCH_REQUEST_DETAILS_BASE_KEY } from "../service";
import type { JobCriteriaFormDTO } from "@/pages/recruitment/candidature/criteria-form/hooks/use-save-criteria";
import { formatParam } from "@/pages/recruitment/request/form";

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
    code: string;
    name: string;
}

export interface PreselectionCriteriaItemDTO {
    id: string;
    criteria: string;
    coefficient: number;
    score: number;
}

export interface PreselectionCriteriaDTO {
    criteria: PreselectionCriteriaItemDTO[];
    totalScore: number;
}

const LANGAGE_BASE_KEY = ['langages'] as const;
const SPEAKING_LEVEL_BASE_KEY = ['levels'] as const;
const PRESELECTION_CRITERIA_BASE_KEY = ['criteria'] as const;


export const useSearchLangages = () => {
    const queryKey = [...LANGAGE_BASE_KEY] as const;

    return useQuery<{data: LangageDTO[]}, Error>({
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

    return useQuery<{data: SpeakingLevelDTO[]}, Error>({
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

    return useQuery<ApiResponse<PreselectionCriteriaDTO>, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/Preselections/criterias`);
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


export const useUpdateCriteriaCoefficient = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponse<PreselectionCriteriaDTO>, Error,
     { id: string; coefficient: number }>({
        mutationFn: ({ id, coefficient }) => api.put(`/api/recruitment/Preselections/criterias/${id}`, { coefficient })
            .then(r => r.data),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: PRESELECTION_CRITERIA_BASE_KEY 
        }),
    });
};


export const useAddJobCriteria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: JobCriteriaFormDTO) =>
            api.post(`/api/recruitment/Preselections/job-criteria`, data)
             .then(r => r.data),

        onSuccess: (_, variables) => {
            const id = variables.jobDescId;

        // Refetch du détail
            queryClient.invalidateQueries({
                queryKey: [...SEARCH_JOB_DESC_BASE_KEY, id]
            });
        }
    });
};

export const useUpdateJobCriteria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ jobId, data }: {
            jobId: string; 
            requestId: string;
            data: JobCriteriaFormDTO;
        }) =>
            api.put(`/api/recruitment/Preselections/job-criteria/${formatParam(jobId)}`, data)
                .then(r => r.data),

        onSuccess: async (_, variables) => {
            const { requestId, jobId } = variables;
        
            await queryClient.invalidateQueries({
                queryKey: [...SEARCH_REQUEST_DETAILS_BASE_KEY, requestId]
            });
        
            await queryClient.invalidateQueries({
                queryKey: [...SEARCH_JOB_DESC_BASE_KEY, jobId]
            });
        }
    });
};


export const useConfirmJobCriteria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ jobId }: { jobId: string; }) =>
            api.put(`/api/recruitment/Preselections/job-criteria/${formatParam(jobId)}/confirm`)
                .then(r => r.data),

        onSuccess: async (_, variables) => {
            const { jobId } = variables;
        
            await queryClient.invalidateQueries({
                queryKey: [...SEARCH_JOB_DESC_BASE_KEY, jobId]
            });

            
        }
    });
};
