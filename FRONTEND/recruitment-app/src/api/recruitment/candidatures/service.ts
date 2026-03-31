import { formatParam } from "@/pages/recruitment/request/form";
import api from "@/utils/axios-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PreselectionCriteriaDTO } from "../preselection/service";
import type { CreateRequestResponse } from "../service";
import type { User } from "@/api/auth/services";

export interface FilterCandidatureDTO {
    name?: string;
    isTreated?: boolean;
    sendingMaxDate?: string;
    sendingMinDate?: string;
    isPreselected?: boolean;
}

export interface CandidatureDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    cvUrl: string | null;
    lmUrl: string | null;
    sendingDateTime: string;
    isTreated: boolean;
    totalScore: number;
    maxScore: number;
}

export interface CandidatureBaseInfoDTO {
    contract: string;
    direction: string;
    post: string;
}

interface LangageSkillDTO {
    langage: string;
    level: string;
    points: number;
}

interface CandidatureNoteUpadateFormDTO {
    criteriaId: string;
    points: number;
}

interface CandidatureScore {
    id: string;
    criteriaId: string;
    points: number;
}

export interface CandidatureDetailsDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    lmUrl: string;
    cvUrl: string;

    yearsOfExperience: number;
    levelEducation: string;
    langagesSkills: LangageSkillDTO[];
    formations: string[];
    totalScore: number;

    points: CandidatureScore[];

    sendingDateTime: string;
    isTreated: boolean;
}

export interface CandidatureComment {
    id: string;
    candidatureId: string;
    comment: string;
    userId: string;
    user: User;

    createdAt: string;     // ISO date
    updatedAt?: string | null;

    isDeleted: boolean;
    deletedAt?: string | null;
}

export interface CandidatureCommentFormDTO {
    commentatorId?: string;
    comment: string;
}

const CANDIDATURE_BASE_KEY = ['candidatures'] as const;
const CANDIDATURE_DETAILS_KEY = ['candidatureDetails'] as const;
const CANDIDATURE_COMMENTS_KEY = ['candidature-comments'] as const;


// LISTE DES CANDIDATURES
export const useSearchCandidatures = (
    jobDescId: string,
    filters: FilterCandidatureDTO,
    page: number = 1, pageSize: number = 10
) => {
    const queryKey = [...CANDIDATURE_BASE_KEY, { 
        jobDescId, filters, page, pageSize 
    }] as const;

    return useQuery<{ details:CandidatureBaseInfoDTO, list:CandidatureDTO[]; totalCount:number }, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/candidatures/job-descriptions/${formatParam(jobDescId)}`, {
                    params: { ...filters, page, pageSize },
                });

                const apiData = response.data.data;

                return {
                    details: apiData.details,
                    list: apiData.candidatures,
                    totalCount: apiData.totalCount
                };
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        },
        enabled: !!jobDescId
    });
};


// DETAILS D'UNE CANDIDATURE
export const useSearchCandidatureDetails = (id: string) => {
    const queryKey = [...CANDIDATURE_DETAILS_KEY, { id }] as const;

    return useQuery<{criteria: PreselectionCriteriaDTO, details: CandidatureDetailsDTO}, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/candidatures/${formatParam(id)}`, {});
                const details = response.data.data.details;
                const criteria = response.data.data.criteria;

                return {criteria, details };
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        },
        enabled: !!id
    });
};


// UPDATE MANUEL DES NOTES
export const useAssignNoteForCandidat = (id?: string) => {
    const queryClient = useQueryClient();

    return useMutation<CreateRequestResponse, Error, CandidatureNoteUpadateFormDTO>({
        mutationFn: async (data) => 
            await api.put(`/api/recruitment/candidatures/${formatParam(id!)}`, data)
            .then(r => r.data),

        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: CANDIDATURE_DETAILS_KEY 
        }),
    });
};


// TERMINER LE TRAITEMENT DE CANDIDATURE
export const useFinishCandidatureTreatment = (id?: string) => {
    const queryClient = useQueryClient();

    return useMutation<CreateRequestResponse, Error>({
        mutationFn: async () => 
            await api.put(`/api/recruitment/candidatures/${formatParam(id!)}/finish`)
            .then(r => r.data),

        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: CANDIDATURE_DETAILS_KEY 
        }),
    });
};


// -----------------------------------------
// COMMENTAIRES
// -----------------------------------------

export const useGetCandidatureComments = (
    candidatureId: string,
    page: number = 1, 
    pageSize: number = 10
) => {
    const queryKey = [...CANDIDATURE_COMMENTS_KEY, { candidatureId, page, pageSize }] as const;

    return useQuery<{
        list: CandidatureComment[], totalCount: number
    }, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(
                    `/api/recruitment/candidatures/${candidatureId}/comments`,
                    { params: { page, pageSize } }
                );
                const apiData = response.data.data;

                return {
                    list: apiData.list,
                    totalCount: apiData.totalCount
                };
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || 'Erreur serveur');
                }
                throw error;
            }
        }
    });
};

export const useAddCandidatureComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ candidatureId, data }: {
            candidatureId: string,
            data: CandidatureCommentFormDTO
        }) => {
            const response = await api.post(
                `/api/recruitment/candidatures/${candidatureId}/comments`, data
            );
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [...CANDIDATURE_COMMENTS_KEY, { candidatureId: variables.candidatureId }]
            });
        }
    });
};

export const useUpdateCandidatureComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, data }: {
            commentId: string,
            candidatureId: string,
            data: CandidatureCommentFormDTO
        }) => {
            return await api.put(
                `/api/recruitment/candidatures/comments/${formatParam(commentId)}`,
                data
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [...CANDIDATURE_COMMENTS_KEY, { candidatureId: variables.candidatureId }]
            });
        }
    });
};

export const useDeleteCandidatureComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId }: {
            commentId: string,
            candidatureId: string
        }) => {
            return await api.delete(
                `/api/recruitment/candidatures/comments/${formatParam(commentId)}`
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [...CANDIDATURE_COMMENTS_KEY, { candidatureId: variables.candidatureId }]
            });
        }
    });
};
