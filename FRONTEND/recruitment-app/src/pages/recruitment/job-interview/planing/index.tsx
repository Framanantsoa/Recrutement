"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TableContainer,
  TableTitle,
  TableHeader,
} from "@/styles/table-styles";

import { 
    useCanValidateJobDescription, 
    useSearchPendedRequests, 
    type FilterPendedRequestDTO 
} from "@/api/recruitment/service";

import Alert from "@/components/alert";
import { useNavigate } from "react-router-dom";
import DraftRequestCards from "./components/draft-planing-card";
import DraftPlaningFilters, { type PlaningFiltersState } from "./components/planing-filters";
import { formatDate } from "date-fns";
import type { TabValidationKey } from "./components/planing-tabs";
import { formatRequestId } from "../../request/form";
import PlaningTabs from "./components/planing-tabs";

interface AlertState {
    isOpen: boolean;
    type: "info" | "success" | "error" | "warning";
    message: string;
}

const DraftPlaningList: React.FC = () => {
    const [alert, setAlert] = useState<AlertState>({ isOpen: false, type: "info", message: "" });

    const [filters, setFilters] = useState<PlaningFiltersState>({
        dateRange: [null, null],
    });

    const validator = JSON.parse(localStorage.getItem("user") || "{}");
    const validatorId = validator?.userId || "";

// Gestion des habilitations
    const {data: tdrValidator} = useCanValidateJobDescription(validatorId);
    const canViewJobDescriptions = tdrValidator?.hasValidation;
    
    const [activeTab, setActiveTab] = useState<TabValidationKey>(() => {
        let saved = sessionStorage.getItem("lastActiveInterviewTab") as TabValidationKey | null;
        if(canViewJobDescriptions) saved = "planing";
        else saved = "draft";

        return saved;
    });

    const [appliedFilters, setAppliedFilters] = useState<PlaningFiltersState>({ ...filters });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const navigate = useNavigate();

    // Préparer filtres pour le backend
    const searchFilters: FilterPendedRequestDTO = useMemo(() => {
        const [startDate, endDate] = appliedFilters.dateRange;
        return {
            minDate: startDate ? startDate.toISOString().split("T")[0] : undefined,
            maxDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
        };
    }, [appliedFilters]);

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.userId || "";

// Demandes en attente / TDR en attente
    const { data: requestResponse, isLoading, error, refetch } 
        = useSearchPendedRequests(userId, searchFilters, page, pageSize);
    const requests = useMemo(() => requestResponse?.list || [], [requestResponse]);

    // Mise à jour totalCount
    useEffect(() => {
        setTotalCount(requestResponse?.totalCount || 0);
    }, [requestResponse]);

    // Refetch quand appliedFilters, page ou pageSize changent
    useEffect(() => {
        refetch();
    }, [appliedFilters, page, pageSize, refetch]);

    const handleFilterSubmit = useCallback(() => {
        setAppliedFilters(filters);
        setPage(1);
    }, [filters]);

    const handleResetFilters = useCallback(() => {
        const reset: PlaningFiltersState = {
            dateRange: [null, null],
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
        <DraftPlaningFilters
            filters={filters}
            setFilters={setFilters}
            isLoading={isLoading}
            onSubmit={handleFilterSubmit}
            onReset={handleResetFilters}
        />

        <PlaningTabs
            activeTab={activeTab}
            onTabChange={(tab) => { 
                setActiveTab(tab); 
                setPage(1); 
                sessionStorage.setItem("lastActiveInterviewTab", tab); 
            }}
        />

        <TableContainer>
            {activeTab === "draft" && (<>
                <TableHeader>
                    <TableTitle>Liste des planifications</TableTitle>
                </TableHeader>

                <DraftRequestCards
                    data={requests}
                    isLoading={isLoading}
                    totalEntries={totalCount}
                    currentPage={page}
                    pageSize={pageSize}
                    handlePageChange={setPage}
                    handlePageSizeChange={handlePageSizeChange}
                    formatDate={(date) => formatDate(new Date(date), "dd/MM/yyyy à HH:mm")}
                    handleRowClick={(id) => {
                        navigate(`/recrutement/demandes/${formatRequestId(id)}/details?validateur=${userId}`);
                    }}
                />
            </>)}
            
            {activeTab === "planing" && (<>
                <TableHeader>
                    <TableTitle>Liste des entretiens</TableTitle>
                </TableHeader>

            </>)}
        </TableContainer>
    </>);
};

export default DraftPlaningList;
