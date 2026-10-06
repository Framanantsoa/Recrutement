"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TableContainer,
  TableTitle,
  TableHeader,
} from "@/styles/table-styles";

import { useGetAllDirections } from "@/api/direction/services";

import Alert from "@/components/alert";
import { useHasHabilitation } from "@/api/users/services";
import { useSearchJobDescriptions, type JobDescriptionFilterDTO } from "@/api/recruitment/job-description/service";
import JobTabs, { type JobTabKey } from "./components/job-tabs";
import JobFilters from "./components/job-filters";
import JobDescriptionCard from "./components/job-card";
import { formatDate } from "date-fns";
import { useNavigate } from "react-router-dom";
import { formatParam } from "../../request/form";

interface AlertState {
    isOpen: boolean;
    type: "info" | "success" | "error" | "warning";
    message: string;
}

interface FiltersState {
  post: string | null;
  direction?: string;
  dateRange?: [Date | null, Date | null];
}

const JobDescriptionList: React.FC = () => {
    const [alert, setAlert] = useState<AlertState>({ isOpen: false, type: "info", message: "" });

    const [filters, setFilters] = useState<FiltersState>({
        post: "",
        direction: "",
        dateRange: [null, null],
    });

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.userId || "";

// Gestion des habilitations
    const canViewAllJobDescriptions = useHasHabilitation(userId, "Consulter toutes les tdr");
    
    const [activeTab, setActiveTab] = useState<JobTabKey>("mes");

    useEffect(() => {
        // Si l'utilisateur n'a pas accès à "Tous"
        if (!canViewAllJobDescriptions) {
            setActiveTab("mes");
            sessionStorage.setItem("lastJobListTab", "mes");
            return;
        }

        // Sinon on récupère le dernier tab sauvegardé
        const saved = sessionStorage.getItem("lastJobListTab") as JobTabKey | null;

        if (saved) {
            setActiveTab(saved);
        } else {
            setActiveTab("tous");
        }
    }, [canViewAllJobDescriptions]);

    const [appliedFilters, setAppliedFilters] = useState<FiltersState>({ ...filters });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

// Récupération des listes pour les filtres
    const { data: directionsResponse } = useGetAllDirections();
    const allDirections = useMemo(() => directionsResponse?.data || [], [directionsResponse]);

// Préparer filtres pour le backend
    const searchFilters: JobDescriptionFilterDTO = useMemo(() => {
        const [start, end] = appliedFilters.dateRange || [null, null];

        return {
            post: appliedFilters.post || undefined,
            direction: appliedFilters.direction || undefined,
            minDate: start ? start.toISOString().split("T")[0] : undefined,
            maxDate: end ? end.toISOString().split("T")[0] : undefined,
        } as JobDescriptionFilterDTO;
    }, [appliedFilters]);

// TDR disponibles
    const isAll = activeTab === "tous"; 

    const { data: jobDescResponse, error, isLoading, refetch } 
        = useSearchJobDescriptions(userId, searchFilters, isAll, page, pageSize);
    const jobDescriptions = useMemo(() => jobDescResponse?.list || [], [jobDescResponse]);

// Mise à jour totalCount
    useEffect(() => {
        setTotalCount(jobDescResponse?.totalCount || 0);
    }, [jobDescResponse]);

    useEffect(() => {
        refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAll]);

    const handleFilterSubmit = useCallback(() => {
        setAppliedFilters(filters);
        setPage(1);
    }, [filters]);

    const handleResetFilters = useCallback(() => {
        const reset: JobDescriptionFilterDTO = {
            post: "",
            minDate: null, maxDate: null,
            dateRange: [null, null]
        };
        setFilters(reset);
        setAppliedFilters(reset);
        setPage(1);
    }, []);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    if (error) return <div>Une erreur est survenue lors du chargement des données.</div>;

    return (<>
        <Alert
            type={alert.type}
            message={alert.message}
            isOpen={alert.isOpen}
            onClose={() => setAlert({ ...alert, isOpen: false })}
        />

    {/* Filtres */}
        <JobFilters
            filters={filters}
            setFilters={setFilters}
            isAllJobs={isAll}
            isLoading={isLoading}
            allDirections={allDirections}
            onSubmit={handleFilterSubmit}
            onReset={handleResetFilters}
        />

        <JobTabs
            activeTab={activeTab}
            onTabChange={tab => { 
                setActiveTab(tab);
                setPage(1); 
                sessionStorage.setItem("lastJobListTab", tab); 

                if(filters.direction) filters.direction = undefined;
            }}
            canViewJobDescriptions={canViewAllJobDescriptions}
        />

        <TableContainer>
            {activeTab === "mes" ? (<>
                <TableHeader>
                    <TableTitle>Liste des postes disponibles</TableTitle>
                </TableHeader>
            </>) : (
                <TableHeader>
                    <TableTitle>Liste de tous les postes</TableTitle>
                </TableHeader>
            )}
            
            <JobDescriptionCard
                jobs={jobDescriptions}
                isLoading={isLoading}
                totalEntries={totalCount}
                currentPage={page}
                pageSize={pageSize}
                handlePageChange={setPage}
                handlePageSizeChange={handlePageSizeChange}
                formatDate={(date) => formatDate(new Date(date), "dd/MM/yyyy à HH:mm")}
                handleRowClick={(id) => {
                    navigate(`/recrutement/candidatures/tdr/${formatParam(id)}`);
                }}
            />
        </TableContainer>
    </>);
};

export default JobDescriptionList;
