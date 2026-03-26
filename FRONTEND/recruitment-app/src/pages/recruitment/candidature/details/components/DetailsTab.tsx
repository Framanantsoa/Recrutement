import React, { useState } from "react";
import { format as formatDate } from "date-fns";
import Alert from "@/components/alert";
import LabelValue from "@/pages/recruitment/request/details/components/LabelValue";
import { useAssignNoteForCandidat, type CandidatureDetailsDTO } from "@/api/recruitment/candidatures/service";
import LabelValueList from "@/pages/recruitment/job-description/details/components/LabelValueList";
import EditableScore from "@/components/EditableScore";
import { ButtonConfirm } from "@/styles/table-styles";
import { useNavigate } from "react-router-dom";
import { Palette } from "lucide-react";

interface Props {
  isPreselected: boolean;
  id?: string;
  details: CandidatureDetailsDTO;
}

const DetailsTab: React.FC<Props> = ({ id, details, isPreselected }) => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const navigate = useNavigate();

  const sendingDate = new Date(details.sendingDateTime + "Z"); // UTC
  const fSendingDate = formatDate(sendingDate, "dd/MM/yyyy 'à' HH:mm");

  const getPoint = (criterionId: string): number => {
    return (
      details.points?.find((p) => p.criterionId === criterionId)?.points ?? 0
    );
  };

  const [scores, setScores] = useState(() => ({
    candidature: getPoint("CRIT_005"),
    formation: getPoint("CRIT_002"),
  }));

  const handleSave = (criterionId: string, val: number) => {
    if (!id) return;

    updateNote.mutate(
      { criterionId, points: val },
      {
        onSuccess: () => {
          setAlert({
            isOpen: true,
            type: "success",
            message: "Note mise à jour avec succès",
          });
        },
        onError: () => {
          setAlert({
            isOpen: true,
            type: "error",
            message: "Erreur lors de la mise à jour",
          });
        },
      }
    );
  };

// HOOKS
  const updateNote = useAssignNoteForCandidat(id);
  
  return (<>
    {alert.isOpen && (
      <Alert
        {...alert}
        onClose={() => setAlert((a) => ({ ...a, isOpen: false }))}
      />
    )}

    <div className="request-details-vertical">

      {/* ===== STICKY HEADER ===== */}
      <div className="sticky-top-full">
        <div className="sticky-left">
          <LabelValue label="Présélectionné" value={isPreselected==true ? "OUI":"NON"} />
        </div>

        {isPreselected==true && (
          <div className="sticky-right">
            <div className="actions-bar">
              <ButtonConfirm style={{ background:"var(--primary-color)" }}
                onClick={() => navigate(`/recrutement/planifications/${id}`)}
              >
                <Palette size={15} /> Voir les planifications
              </ButtonConfirm>
            </div>
          </div>
        )}
      </div>

      {/* ===== INFORMATIONS GÉNÉRALES ===== */}
      <section className="details-section">
        <h3>Informations personnelles</h3>
        <LabelValue label="Référence" value={id?.replace("_", "/") ?? "N/A"} />
        <LabelValue label="Nom" value={details.lastName} />
        <LabelValue label="Prénom" value={details.firstName} />
        <LabelValue label="Contact" value={details.email} />
      </section>

      {/* ===== DOCUMENTS ===== */}
      <section className="details-section">
        <h3>Documents du candidat</h3>
        <nav>
          <LabelValue label="Curriculum Vitae (CV)" value={details.cvUrl ?? "N/A"} />
          <LabelValue label="Lettre de motivation (LM)" value={details.lmUrl ?? "N/A"} />
        </nav>

        {!details.isTreated && (
          <EditableScore
            label="Note - Clarté de CV et LM (Maximum : 5)"
            value={scores.candidature}
            onSave={(val) => {
              setScores((s) => ({ ...s, candidature: val }));
              handleSave("CRIT_005", val);
            }}
          />
        )}
      </section>

      {/* ===== INFOS SUPP ===== */}
      <section className="details-section">
        <h3>Parcours académiques et professionnels</h3>
        <LabelValue label="Niveau d'étude" value={details.levelEducation} />
        <LabelValue label="Expérience professionnel"
          value={
            details.yearsOfExperience > 0
            ? `${details.yearsOfExperience} an(s)`
            : "Aucune"
          }
        />
        <LabelValueList label="Diplômes et Formations" items={details.formations} />
        {!details.isTreated && (
          <EditableScore
            label="Note - Diplômes et formations (Maximum : 5)"
            value={scores.formation}
            onSave={(val) => {
              setScores((s) => ({ ...s, formation: val }));
              handleSave("CRIT_002", val);
            }}
          />
        )}

        <h3>Compétences linguistiques</h3>
        {details.langagesSkills?.length ? (
          details.langagesSkills.map((lSkill, index) => (
            <LabelValue key={index}
              label={lSkill.langage} value={lSkill.level}
            />
          ))
        ) : (
          <p>Aucune compétence linguistique</p>
        )}
      </section>

      {/* ===== AUTRES ===== */}
      <section className="details-section">
        <h3>Autres</h3>
        <LabelValue
          label="Date et heure de réception" value={fSendingDate}
        />
        <LabelValue
          label="Statut de la candidature"
          value={details.isTreated ? "Traitée" : "Non traitée"}
        />
      </section>
    </div>
  </>);
};

export default DetailsTab;
