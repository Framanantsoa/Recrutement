import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import DetailsTab from "./components/DetailsTab";
import Modal from "@/components/modal";
import Alert from "@/components/alert";
import { ButtonView } from "@/styles/table-styles";

// 👉 à adapter selon ton API
import { useFinishCandidatureTreatment, useSearchCandidatureDetails } from "@/api/recruitment/candidatures/service";
import PointsTab from "./components/PointsTab";
import CommentsTab from "./components/CommentsTab";

type TabKey = "details" | "points" | "comments";

const CandidatureDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("details");
  // const [preselected, setPreselected] = useState(false);
  let preselected = false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info" as "success" | "info" | "error",
    message: ""
  });

  const { data, isLoading } = useSearchCandidatureDetails(id ?? "");
  const finishTreatment = useFinishCandidatureTreatment(id);

  if (data?.details!=undefined && data.criteria!=undefined) {
    preselected = data?.details.totalScore >= data?.criteria.totalScore/2;
  }

  const handleValidate = () => {
    finishTreatment.mutate(undefined, {
      onSuccess: () => {
        setAlert({
          isOpen: true,
          type: "success",
          message: "Candidature traitée avec succès",
        });
      },
      onError: () => {
        setAlert({
          isOpen: true,
          type: "error",
          message: "Erreur lors de la fin du traitement",
        });
      },
    });

    setIsModalOpen(false);
  };

  if (isLoading || !data) return <p>Chargement...</p>;

  return ( <>
    {/* ALERT */}
    {alert.isOpen && (
      <Alert {...alert} onClose={() => setAlert(a => ({ ...a, isOpen: false }))} />
    )}

    {/* MODAL */}
    {isModalOpen && (
      <Modal
        type="success"
        title="Confirmer"
        message="Voulez-vous terminer le traitement ?"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmAction={handleValidate}
        confirmLabel="Valider"
        cancelLabel="Annuler"
        showActions
      />
    )}

    <div className="request-page">
      {/* ===== TABS ===== */}
      <div className="tabs">
        <button
          className={activeTab === "details" ? "tab active" : "tab"}
          onClick={() => setActiveTab("details")}
        >
          Candidat(e)
        </button>

        <button
          className={activeTab === "points" ? "tab active" : "tab"}
          onClick={() => setActiveTab("points")}
        >
          Points obtenus
        </button>

        <button
          className={activeTab === "comments" ? "tab active" : "tab"}
          onClick={() => setActiveTab("comments")}
        >
          Commentaires
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      {activeTab === "details" && (
        <DetailsTab id={id} details={data.details} isPreselected={preselected}/>
      )}

      {activeTab === "points" && (
        <PointsTab criteria={data.criteria} details={data.details} />
      )}

      {activeTab === "comments" && (
        <CommentsTab candidatureId={id} />
      )}

      {/* ===== FOOTER ===== */}
      <div className="request-footer">
        <ButtonView style={{ background: "var(--info-bg)" }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Retour
        </ButtonView>

        {data.details.isTreated==false && (
          <div className="right-footer">
            <ButtonView style={{ background: "var(--primary-color)", color: "white" }}
              onClick={() => setIsModalOpen(true)}
            >
              <Check size={18} /> Terminer
            </ButtonView>
          </div>
        )}
        
      </div>
    </div>
  </>);
};

export default CandidatureDetailsPage;
