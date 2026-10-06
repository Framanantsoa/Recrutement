"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TableContainer,
  TableTitle,
  TableHeader,
} from "@/styles/table-styles";

import {
    type FilterPendedRequestDTO 
} from "@/api/recruitment/service";

import Alert from "@/components/alert";
import DraftPlaningFilters, { type PlaningFiltersState } from "./components/planing-filters";
import { formatDate } from "date-fns";
import type { TabValidationKey } from "./components/planing-tabs";
import PlaningTabs from "./components/planing-tabs";
import DraftPlaningCards from "./components/draft-planing-card";
import { useGetPlaningsToDoForUser } from "@/api/recruitment/interview/service";

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

    // const validator = JSON.parse(localStorage.getItem("user") || "{}");
    // const validatorId = validator?.userId || "";
    
    const [activeTab, setActiveTab] = useState<TabValidationKey>(() => {
        return sessionStorage.getItem("lastActiveInterviewTab") as TabValidationKey || "draft";
    });

    const [appliedFilters, setAppliedFilters] = useState<PlaningFiltersState>({ ...filters });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

// Préparer filtres pour le backend
    const formatDateOnly = (date: Date) =>
        date.toLocaleDateString("en-CA");

    const searchFilters: FilterPendedRequestDTO = useMemo(() => {
        const [startDate, endDate] = appliedFilters.dateRange;

        return {
            minDate: startDate ? formatDateOnly(startDate) : undefined,
            maxDate: endDate ? formatDateOnly(endDate) : undefined,
        };
    }, [appliedFilters]);

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.userId || "";


// Demandes de planification 
    const { data: requestResponse, isLoading, error, refetch: refetchRequest } 
        = useGetPlaningsToDoForUser(userId, searchFilters, page, pageSize);
    const requestsPlaning = useMemo(() => requestResponse?.planings || [], [requestResponse]);

// Planifications


// Mise à jour totalCount
    useEffect(() => {
        setTotalCount(requestResponse?.totalCount || 0);
    }, [requestResponse]);

// Refetch quand appliedFilters, page ou pageSize changent
    useEffect(() => {
        refetchRequest();
    }, [appliedFilters, page, pageSize, refetchRequest]);

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
                    <TableTitle>Liste des demandes de planification</TableTitle>
                </TableHeader>

                <DraftPlaningCards
                    planings={requestsPlaning}
                    isLoading={isLoading}
                    totalEntries={totalCount}
                    currentPage={page}
                    pageSize={pageSize}
                    handlePageChange={setPage}
                    handlePageSizeChange={handlePageSizeChange}
                    formatDate={(date) => formatDate(new Date(date), "dd/MM/yyyy à HH:mm")}
                    handleRowClick={(id) => {
                        console.log("Planing clicked:", id);
                    }}
                    setAlert={setAlert}
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
