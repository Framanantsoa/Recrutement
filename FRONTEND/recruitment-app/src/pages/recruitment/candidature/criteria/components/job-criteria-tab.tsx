import type { JobCriteriaDTO } from "@/api/recruitment/service";
import RecruitmentStatusTag from "@/components/recruitment-status";
import LabelValueList from "@/pages/recruitment/job-description/details/components/LabelValueList";
import LabelValue from "@/pages/recruitment/request/details/components/LabelValue";
import { ButtonConfirm, ButtonConfirmSecondary } from "@/styles/table-styles";
import React, { useState } from "react";
import { FaCheckCircle, FaPen } from "react-icons/fa";
import PreselectionCriteriaForm from "..";

import Alert from "@/components/alert";
import Modal from "@/components/modal";
import { useConfirmJobCriteria } from "@/api/recruitment/preselection/service";
import { useHasHabilitation } from "@/api/users/services";

interface Props {
    jobId: string;
    requestId: string;
    criteria: JobCriteriaDTO;
}

const JobCriteriaTab: React.FC<Props> = ({ jobId, requestId, criteria }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [criteriaState, setCriteriaState] = useState(criteria);

    const [alert, setAlert] = useState<{
        isOpen: boolean;
        type: "error" | "info" | "success" | "warning";
        message: string;
    }>({ isOpen: false, type: "info", message: "" });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.userId;

// HOOKS
    const jobConfirm = useConfirmJobCriteria();
    const canConfirmCriteria = useHasHabilitation(userId, "Gérer les paramétrages du recrutement");

// Confirmation
    const handleConfirm = async() => {
        if (!jobId) return;

        try {
            await jobConfirm.mutateAsync({ jobId });

            setAlert({
                isOpen: true,
                type: "success",
                message: "Critères confirmés avec succès"
            });

            setIsModalOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setAlert({
                isOpen: true,
                type: "error",
                message: error?.response?.data?.message
                 || error?.message || "Erreur lors de la confirmation"
            });

            setIsModalOpen(false);
        }
    }

    if (!criteria) return <p>Aucun critère défini.</p>;

    return (<>
        {alert.isOpen && (
            <Alert {...alert}
                onClose={() => setAlert(a => ({ ...a, isOpen: false }))}
            />
        )}

        {/* MODAL */}
        {isModalOpen && (
            <Modal
            type="success"
            title="Confirmer"
            message="Voulez-vous vraiment confirmer les critères ?"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            confirmAction={handleConfirm}
            confirmLabel="Confirmer"
            cancelLabel="Annuler"
            showActions
            />
        )}

        <div className="request-details-vertical">

            {/* ===== STICKY HEADER ===== */}
            <div className="sticky-top-full">
                <div className="sticky-left">
                    <LabelValue label="Points max" value={`${criteriaState.totalScore} pts`} />
                </div>

                <div className="sticky-right">
                    <div className="actions-bar">
                        {(criteriaState.status.toLowerCase() !== "validée"
                         && canConfirmCriteria===true) && (
                            <ButtonConfirm className="tdr-btn"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaCheckCircle /> Confirmer
                            </ButtonConfirm>
                        )}

                        {canConfirmCriteria===true && (
                            <ButtonConfirmSecondary className="tdr-btn"
                                onClick={() => setIsOpen(true)}
                                disabled={criteria.status.toLowerCase() === "validée"}
                            >
                                <FaPen /> Modifier
                            </ButtonConfirmSecondary>
                        )}
                        
                        <LabelValue label="Statut">
                            <RecruitmentStatusTag status={criteria.status}/>
                        </LabelValue>
                    </div>
                </div>
            </div>

            <section className="details-section">
                {criteriaState.levelEducations.length > 0 && (
                    <LabelValueList
                    label="Niveau d'études"
                    items={criteriaState.levelEducations.map(
                        le => `${le.levelName} ( ${le.points} pts )`
                    )}
                    />
                )}

                {criteriaState.experiences.length > 0 && (
                    <LabelValueList
                    label="Expérience professionnelle"
                    items={criteriaState.experiences.map(
                        exp => `${exp.minYear} - ${exp.maxYear} ans ( ${exp.points} pts )`
                    )}
                    />
                )}

                {criteriaState.langages.length > 0 && (
                    <LabelValueList
                    label="Compétences linguistiques"
                    items={criteriaState.langages.map(
                        l => `${l.langage} - ${l.level} ( ${l.points} pts )`
                    )}
                    />
                )}

                <LabelValue label="Formations et/ou diplômes" value={`${criteriaState.formationsPoints} pts`} />
                <LabelValue label="Clarté de candidature" value={`${criteriaState.presentationsPoints} pts`} />
            </section>
        </div>

        <PreselectionCriteriaForm
            isOpen={isOpen}
            jobId={jobId}
            requestId={requestId}
            criteria={criteriaState}
            onClose={() => setIsOpen(false)}
            onUpdated={(updatedCriteria) => setCriteriaState(updatedCriteria)}
            setAlert={setAlert}
        />
    </>);
};

export default JobCriteriaTab;
