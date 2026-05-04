"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import CandidatureTable from "./components/candidature-table";
import CandidatureAlert from "./components/candidature-alert";
import CandidatureFilters from "./components/candidature-filters";
import CandidatureHeader from "./components/candidature-header";
import { useSearchCandidatures, type FilterCandidatureDTO } from "@/api/recruitment/candidatures/service";
import { useNavigate, useParams } from "react-router-dom";
import CandidatureTabs, { type TabKey } from "./components/candidature-tabs";
import { ButtonView } from "@/styles/table-styles";
import { ArrowLeft } from "lucide-react";
import { useCanUserPlanJobInterview } from "@/api/recruitment/interview/service";

interface FiltersState {
  name: string;
  treated: boolean | null,
  status: "" | "treated" | "not_treated";
  dateRange: [Date | null, Date | null];
}

interface AlertState {
  isOpen: boolean;
  type: "info" | "success" | "error" | "warning";
  message: string;
}

const CandidatureList: React.FC = () => {
  const { jobId } = (useParams<{ jobId: string }>());

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.userId || "";

// Habilitations
  // const canViewPreselected = useHasHabilitation(userId, "Consulter des candidats présélectionnées");
  const canViewPreselected = true;

// Vérification
  const { data:checkResponse } = useCanUserPlanJobInterview(userId, jobId??"");

  const canPlan = checkResponse?.canPlan;
  const required = checkResponse?.required;

// Gestion des onglets
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const saved = sessionStorage.getItem("lastActiveCandidatureTab") as TabKey | null;
    
    if (!canViewPreselected) return "all";
    return saved==="preselected" ? saved : "all";
  });

  useEffect(() => {
    if ((!canViewPreselected && activeTab === "preselected")) {
      setActiveTab("all");
    }
  }, [canViewPreselected, activeTab]);

  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertState>({ isOpen: false, type: "info", message: "" });
  const [filters, setFilters] = useState<FiltersState>({
    name: "",
    treated: null,
    status: "",
    dateRange: [null, null],
  });
  
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({ ...filters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

// Construction du filtrage
  const searchFilters: FilterCandidatureDTO = useMemo(() => ({
    name: appliedFilters.name || undefined,

    treated:
      appliedFilters.status === ""
        ? undefined
        : appliedFilters.status === "treated",

    sendingMinDate: appliedFilters.dateRange[0]
      ? appliedFilters.dateRange[0].toLocaleDateString('sv-SE') // yyyy-MM-dd
      : undefined,

    sendingMaxDate: appliedFilters.dateRange[1]
      ? appliedFilters.dateRange[1].toLocaleDateString('sv-SE') // yyyy-MM-dd
      : undefined,

    isPreselected: activeTab === "preselected" ? true : undefined,
  }), [appliedFilters, activeTab]);

// Recherche avec filtre
  const { data: searchResponse, isLoading, error } = useSearchCandidatures(
    jobId!, searchFilters, page, pageSize
  );
  const candidatures = useMemo(() => 
    searchResponse?.list || [], [searchResponse]
  );

  const details = searchResponse?.details;

  useEffect(() => {
    setTotalCount(searchResponse?.totalCount || 0);
  }, [searchResponse]);

  const handleResetFilters = useCallback(() => {
    const reset: FiltersState = {
      name: "",
      treated: null,
      status: "",
      dateRange: [null, null],
    };
    setFilters(reset);
    setAppliedFilters(reset);
    setPage(1);
  }, []);


  const handleFilterSubmit = useCallback((values: FiltersState) => {
    setAppliedFilters(values);
    setPage(1);
  }, []);

  if (error) return <div>Une erreur est survenue lors du chargement des données.</div>;

  return (<>
    <CandidatureAlert alert={alert} onClose={() => setAlert({ ...alert, isOpen: false })} />

    <CandidatureHeader details={details} />
    
    <CandidatureFilters
      filters={filters}
      setFilters={setFilters}
      onSubmit={handleFilterSubmit}
      isLoading={isLoading}
      onReset={handleResetFilters}
    />

    <CandidatureTabs
     activeTab={activeTab}
     onTabChange={tab => { 
      setActiveTab(tab); setPage(1); 
      sessionStorage.setItem("lastActiveCandidatureTab", tab);
     }}
     canViewPreselected={canViewPreselected}
    />

    <CandidatureTable
      candidatures={candidatures}
      isLoading={isLoading}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize} // maintenant, ce sera un nombre
      showActions={activeTab === "preselected"}
      userCanPlan={canPlan}
      userRequiredToPlan={required}
    />

    <div className="request-footer">
      <ButtonView style={{ background:"var(--info-bg)" }} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </ButtonView>
    </div>
  </>);
};

export default CandidatureList;
