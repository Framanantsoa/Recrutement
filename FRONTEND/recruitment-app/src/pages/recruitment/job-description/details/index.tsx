import React, { useEffect, useState } from "react";
import { useGetJobDescriptionDetails, type JobCriteriaDTO, type RequestDetailsDTO } from "@/api/recruitment/service";
import { exportJobDescriptionToPDF } from "../../utils/pdfExport";
import { FaFilePdf, FaList, FaPen, FaPenAlt } from "react-icons/fa";
import LabelValue from "../../request/details/components/LabelValue";
import LabelList from "./components/LabelList";
import { ButtonConfirm, ButtonConfirmSecondary } from "@/styles/table-styles";
import LabelValueList from "./components/LabelValueList";
import { formatDate } from "date-fns";
import RecruitmentStatusTag from "@/components/recruitment-status";
import { useNavigate } from "react-router-dom";
import { formatParam } from "../../request/form";
import PreselectionCriteriaForm from "../../candidature/criteria";

import Alert from "@/components/alert";

interface Props {
  requestId: string;
  details: RequestDetailsDTO;
  onEdit: (jobId: string) => void;
  onCriteriaLoad?: (criteria: JobCriteriaDTO) => void;
}

const JobDetailsCard: React.FC<Props> = ({ requestId, details, onEdit, onCriteriaLoad }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetJobDescriptionDetails(requestId);

  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.userId || "";

  const [alert, setAlert] = useState<{
      isOpen: boolean;
      type: "error" | "info" | "success" | "warning";
      message: string;
  }>({ isOpen: false, type: "info", message: "" });


  useEffect(() => {
    if (data?.data?.criteria && onCriteriaLoad) {
      onCriteriaLoad(data.data.criteria);
    }
  }, [data?.data?.criteria, onCriteriaLoad]);

  // --- Rendu conditionnel ---
  if (isLoading) return <p>Chargement du TDR...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!data) return <p>Aucun TDR trouvé.</p>;

  const job = data.data;
  const createdAt = new Date(job.createdAt);
  const createdAtDateStr = formatDate(createdAt, "dd/MM/yyyy à HH:mm");

  return (<>
    {alert.isOpen && (
        <Alert {...alert}
            onClose={() => setAlert(a => ({ ...a, isOpen: false }))}
        />
    )}

    <div className="request-details-vertical">

      {/* ===== STICKY HEADER ===== */}
      <div className="sticky-top-full">
        <div className="sticky-left">
          <LabelValue label="Nom du poste" value={job.post} />
        </div>

        <div className="sticky-right">
          <div className="actions-bar">
            {/* {canExportPDF && ( */}
              <ButtonConfirm
              style={{ background: "var(--pdf-color)" }}
                onClick={async () => await exportJobDescriptionToPDF(details, job)}
                >
                <FaFilePdf /> Exporter PDF
              </ButtonConfirm>
            {/* )} */}

            {(job.lastStatus.toLowerCase() === "en attente") ? (
              <ButtonConfirmSecondary
                className="tdr-btn"
                onClick={() => onEdit(job.id)}
                disabled={userId!==details.applicantUserId}
              >
                <FaPen /> Modifier
              </ButtonConfirmSecondary>
            )
             : job.criteria === null ? (
              <ButtonConfirmSecondary
                onClick={() => { setIsCriteriaOpen(true) }}
              >
                <FaPenAlt /> Définir les critères
              </ButtonConfirmSecondary>
            )
             : (
              <ButtonConfirm
                onClick={() => {
                  navigate(`/recrutement/candidatures/tdr/${formatParam(job.id)}`)
                }}
              >
                <FaList /> Voir les candidatures
              </ButtonConfirm>
            )}
            
            <LabelValue label="Statut">
              <RecruitmentStatusTag status={job.lastStatus}/>
            </LabelValue>
          </div>
        </div>
      </div>

      {/* INFOS DE BASE */}
      <section className="details-section">
        <h3>Informations de base</h3>
        <LabelValue label="Référence" value={job.id} />
        <LabelValue label="Type du poste" value={job.postTypeName} />
        <LabelValue label="Rattachement hiérarchique" value={details.hierarchicalManager} />
        <LabelValue label="Lieu(x) de travail" value={details.sites.join(", ")} />
        <LabelValue label="Type de contrat" value={details.contract??details.contractPrecision} />
        <LabelValue label="Créé le" value={createdAtDateStr} />
      </section>

      {/* ===== MISSION ===== */}
      <section className="details-section">
        <h3>Mission</h3>
        <LabelValue label="Objectif" value={job.mission} />
      </section>

      {/* ===== ATTRIBUTIONS ===== */}
      <section className="details-section">
        <h3>Attributions</h3>
        <LabelList items={job.attributions} />
      </section>

      {/* ===== PROFIL IDEAL ===== */}
      <section className="details-section">
        <h3>Profil idéal</h3>
        <LabelValueList 
          label="Formations" items={job.formations} 
        />
        
        <LabelValueList 
          label="Expériences proffessionelles" items={job.experiences} 
        />
        
        <LabelValueList 
          label="Qualités personnelles requises" items={job.softSkills} 
        />

        <LabelValueList 
          label="Compétences requises" items={job.skills} 
        />
      </section>
    </div>

    <PreselectionCriteriaForm
      isOpen={isCriteriaOpen}
      jobId={job.id}
      requestId={requestId}
      onClose={() => setIsCriteriaOpen(false)}
      setAlert={setAlert}
    />
  </>);
};

export default JobDetailsCard;
