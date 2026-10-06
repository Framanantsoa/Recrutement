import api from "@/utils/axios-config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DashboardStatsDTO {
    totalRequests: number;
    averageDay: number | null;
    treatedCandidatures: number;
    preselectedCandidatures: number;
}

export interface RequestPerDirectionDTO {
    direction: string;
    count: number;
}

export interface RequestPerStatusDTO {
    status: string;
    count: number;
    percentage: number;
}

export interface CandidaturePerMonthDTO {
    year: number;
    month: number;
    count: number;
}

const GET_DASHBOARD_STATS_KEY = ["get-dashboard-stats"] as const;
const GET_REQUESTS_PER_DIRECTION_KEY = ["get-requests-per-direction"] as const;
const GET_REQUESTS_PER_STATUS_KEY = ["get-requests-per-status"] as const;
const GET_CANDIDATURES_PER_MONTH_KEY = ["get-candidatures-per-month"] as const;
const apiBaseUrl = "/api/recruitment/Dashboard";


export const useGetGlobalStats = (direction?: string) => {
    const queryKey = [...GET_DASHBOARD_STATS_KEY, { direction }] as const;

    return useQuery<DashboardStatsDTO, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`${apiBaseUrl}/stats/${direction}`);

                return response.data.data;
            } 
            catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
    // Activer seulement si la direction existe
        enabled: !!direction,
    });
};

export const useGetRequestsPerDirection = () => {
    const queryKey = [...GET_REQUESTS_PER_DIRECTION_KEY] as const;

    return useQuery<RequestPerDirectionDTO[], Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`${apiBaseUrl}/requests-per-direction`);

                return response.data.data;
            } 
            catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
    });
};

export const useGetRequestsPerStatus = (direction?: string) => {
    const queryKey = [...GET_REQUESTS_PER_STATUS_KEY, { direction }] as const;

    return useQuery<RequestPerStatusDTO[], Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`${apiBaseUrl}/requests-per-status/${direction}`);
                return response.data.data;
            }
            catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
    // Activer seulement si la direction existe
        enabled: !!direction,
    });
};

export const useGetCandidaturesPerMonth = (direction?: string, year?: number) => {
    const queryKey = [...GET_CANDIDATURES_PER_MONTH_KEY, { direction, year }] as const;

    return useQuery<CandidaturePerMonthDTO[], Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`${apiBaseUrl}/candidatures-per-month/${direction}/${year}`);
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
        enabled: !!direction && !!year,
    });
};
