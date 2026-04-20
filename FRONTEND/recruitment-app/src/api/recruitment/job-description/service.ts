import api from "@/utils/axios-config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface JobDescriptionCardDTO {
  id: string;
  post: string;
  direction: string;
  applicantUser: string;
  hierarchicalManager: string;
  createdAt: string;
  lastStatus: string;
}

export interface JobDescriptionFilterDTO {
  post: string | null;
  direction?: string;
  minDate: string | null;
  maxDate: string | null;
  dateRange?: [Date|null , Date|null]
}

export const SEARCH_JOBS_BASE_KEY = ["search-jobs"];

export const useSearchJobDescriptions = (
  userId: string,
  filters: JobDescriptionFilterDTO,
  all?: boolean,
  page: number = 1,
  pageSize: number = 10
) => {
    const queryKey = [
        ...SEARCH_JOBS_BASE_KEY,
        { userId, filters, all, page, pageSize },
    ] as const;

    return useQuery<{ list: JobDescriptionCardDTO[]; totalCount: number }, Error>({
        queryKey,
        queryFn: async () => {
            try {
                const response = await api.get(`/api/recruitment/job-descriptions/users/${userId}`, {
                    params: {
                        all, page, pageSize,
                        ...(filters.post ? { post: filters.post } : {}),
                        ...(filters.direction ? { direction: filters.direction } : {}),
                        ...(filters.minDate ? { minDate: filters.minDate } : {}),
                        ...(filters.maxDate ? { maxDate: filters.maxDate } : {}),
                    },
                });
                const apiData = response.data.data;

                return {
                    list: apiData.results,
                    totalCount: apiData.totalCount,
                };
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    throw new Error(error.response.data?.message || "Erreur serveur");
                }
                throw error;
            }
        },
        enabled: !!userId
    });
};
