import { useState } from "react";
import JobDetailsCard from "@/pages/recruitment/job-description/details";
import JobDescriptionForm from "@/pages/recruitment/job-description/form";
import { ButtonPrimary } from "@/styles/popup-styles";
import { Plus } from "lucide-react";
import type { JobCriteriaDTO, RequestDetailsDTO } from "@/api/recruitment/service";
import Alert from "@/components/alert";

const JobTabContent: React.FC<{
  requestId: string;
  details: RequestDetailsDTO;
  requestStatus: string;
  hasJobDescription?: boolean;
  onCriteriaLoad?: (criteria: JobCriteriaDTO) => void;
}> = ({ 
  requestId, 
  details, 
  requestStatus, 
  hasJobDescription, 
  onCriteriaLoad 
}) => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "info" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "info",
    message: ""
  });

  const showAlert = (type: "success" | "info" | "error", message: string) => {
    setAlert({ isOpen: true, type, message });
  };

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.userId || "";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [jobId, setJobId] = useState<string | null>(null);

  const canOpenJobDescriptionForm =  requestStatus.toLowerCase()==="validée";

  // 👉 création
  const openCreateForm = () => {
    setMode("create");
    setJobId(null);
    setIsFormOpen(true);
  };

  // 👉 modification
  const openEditForm = (id: string) => {
    setMode("edit");
    setJobId(id);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  return (<>
    {alert.isOpen && (
      <Alert {...alert} onClose={() => setAlert(a => ({ ...a, isOpen: false }))} />
    )}

    {!hasJobDescription ? (
      <div className="empty-state">
        <h3>Aucun terme de référence</h3>
        <p style={{ marginBottom:"2%" }}>Cette demande n’a pas encore de terme de référence.</p>

        { !canOpenJobDescriptionForm ? (
          <p className="text-note">La demande nécessite une validation complète.</p>
        ) : (
          details.applicantUserId==userId && (
            <ButtonPrimary className="primary-btn" onClick={openCreateForm}>
              <Plus /> Créer un terme de référence
            </ButtonPrimary>
          )
        )}        
      </div>
    ) : (
      <JobDetailsCard
        details={details}
        requestId={requestId}
        onEdit={openEditForm}
        onCriteriaLoad={onCriteriaLoad}
      />
    )}

    <JobDescriptionForm
      isOpen={isFormOpen}
      post={details.post}
      requestId={requestId}
      jobId={jobId}
      mode={mode}
      onClose={closeForm}
      onFormSuccess={showAlert}
    />
  </>);
};

export default JobTabContent;
