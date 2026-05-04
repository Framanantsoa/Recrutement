import React, { useState } from "react";
import { DataTable, TableContainer, TableHeader, TableTitle, TableHeadCell, Loading, NoDataMessage } from "@/styles/table-styles";
import CandidatureTableRow from "./candidature-table-row";
import Pagination from "@/components/pagination";
import type { CandidatureDTO } from "@/api/recruitment/candidatures/service";
import PlaningForm from "@/pages/recruitment/job-interview/form";
import Modal from "@/components/modal";
import { usePassToNextInterviewer } from "@/api/recruitment/interview/service";

interface CandidatureTableProps {
  candidatures: CandidatureDTO[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  canViewDetails?: boolean;
  showActions?: boolean;
  userCanPlan?: boolean;
  userRequiredToPlan?: boolean;
}

const CandidatureTable: React.FC<CandidatureTableProps> = ({
  candidatures,
  isLoading,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  canViewDetails,
  showActions,
  userCanPlan,
  userRequiredToPlan
}) => {
// HOOKS
  const passToNextInterviewer = usePassToNextInterviewer();

// Transforme un event en nombre pour PageSize
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    onPageSizeChange(value);
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<string | null>(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState<string | null>(null);
  const [selectedCandidatureToPass, setSelectedCandidatureToPass] = useState<string | null>(null);

// userId
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.userId;

  const handleConfirmToPassInterview = async() => {
    try {
      await passToNextInterviewer.mutateAsync(selectedCandidatureToPass || "");

      setIsModalOpen(false);
      setSelectedCandidatureToPass(null);
    } 
    catch (error) {
      console.error("Erreur lors du passage à l'entretien suivant :", error);
      setSelectedCandidatureToPass(null);
    }
  }

  return (<>
    {isModalOpen && (
      <Modal
        type="success"
        title="Confirmer"
        message="Voulez-vous faire passer ce candidat à l'entretien suivant ?"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false); setSelectedCandidatureToPass(null);
        }}
        confirmAction={handleConfirmToPassInterview}
        confirmLabel="Oui"
        cancelLabel="Non"
        showActions
      />
    )}

    <PlaningForm
      isOpen={!!selectedCandidature}
      candidatureId={selectedCandidature || ""}
      candidateName={selectedCandidateName || ""}
      validatorId={userId}
      onClose={() => {
        setSelectedCandidature(null);
        setSelectedCandidateName(null);
      }}
    />

    <TableContainer>
      <TableHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TableTitle>Liste des candidatures reçues</TableTitle>
      </TableHeader>

      <DataTable>
        <thead>
          <tr>
            <TableHeadCell style={{ textAlign:"center" }}></TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Référence</TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Prénom</TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Nom</TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Contact</TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Date de réception</TableHeadCell>
            <TableHeadCell style={{ textAlign:"center" }}>Points</TableHeadCell>
            {/* {showActions && (
              <TableHeadCell style={{ textAlign:"center", width:"40px" }}>Actions</TableHeadCell>
            )} */}
            
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={showActions ? 8 : 7}><Loading>Chargement des données...</Loading></td></tr>
          ) : candidatures.length > 0 ? (
            candidatures.map(cand => (
              <CandidatureTableRow
                key={cand.id}
                candidature={cand}
                canViewDetails={canViewDetails}
                showActions={showActions}
                userCanPlan={userCanPlan}
                userRequiredToPlan={userRequiredToPlan}
                onPlanClick={(id) => {
                  setSelectedCandidature(id);
                  setSelectedCandidateName(cand.firstName + " " + cand.lastName);
                }}
                onModalOpen={(id) => {
                  setSelectedCandidatureToPass(id);
                  setIsModalOpen(true);
                }}
              />
            ))
          ) : (
            <tr>
              <td colSpan={showActions ? 8 : 7}><NoDataMessage>Aucune candidature trouvée.</NoDataMessage></td>
            </tr>
          )}
        </tbody>
      </DataTable>

      <Pagination
        currentPage={page}
        pageSize={pageSize}
        totalEntries={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </TableContainer>
  </>);
};

export default CandidatureTable;
