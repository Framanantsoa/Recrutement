import type { JobCriteriaDTO } from "@/api/recruitment/service";
import RecruitmentStatusTag from "@/components/recruitment-status";
import LabelValueList from "@/pages/recruitment/job-description/details/components/LabelValueList";
import LabelValue from "@/pages/recruitment/request/details/components/LabelValue";
import { ButtonConfirmSecondary } from "@/styles/table-styles";
import React from "react";
import { FaPen } from "react-icons/fa";

interface Props {
  criteria: JobCriteriaDTO;
}

const JobCriteriaTab: React.FC<Props> = ({ criteria }) => {
  if (!criteria) return <p>Aucun critère défini.</p>;

  return (
    <div className="request-details-vertical">

        {/* ===== STICKY HEADER ===== */}
        <div className="sticky-top-full">
            <div className="sticky-left">
                <LabelValue label="Points max" value={`${criteria.totalScore} pts`} />
            </div>

            <div className="sticky-right">
                <div className="actions-bar">
                    <ButtonConfirmSecondary
                        className="tdr-btn"
                        onClick={() => console.log("UPDATED")}
                        disabled={false}
                    >
                        <FaPen /> Modifier
                    </ButtonConfirmSecondary>
                    
                    <LabelValue label="Statut">
                        <RecruitmentStatusTag status={"brouillon"}/>
                    </LabelValue>
                </div>
            </div>
        </div>

        <section className="details-section">
            {criteria.levelEducations.length > 0 && (
                <LabelValueList
                label="Niveau d'études"
                items={criteria.levelEducations.map(
                    le => `${le.levelName} ( ${le.points} pts )`
                )}
                />
            )}

            {criteria.experiences.length > 0 && (
                <LabelValueList
                label="Expérience professionnelle"
                items={criteria.experiences.map(
                    exp => `${exp.minYear} - ${exp.maxYear} ans ( ${exp.points} pts )`
                )}
                />
            )}

            {criteria.langages.length > 0 && (
                <LabelValueList
                label="Compétences linguistiques"
                items={criteria.langages.map(
                    l => `${l.langage} - ${l.level} ( ${l.points} pts )`
                )}
                />
            )}

            <LabelValue label="Formations et/ou diplômes" value={`${criteria.formationsPoints} pts`} />
            <LabelValue label="Clarté de candidature" value={`${criteria.presentationsPoints} pts`} />
        </section>
    </div>
  );
};

export default JobCriteriaTab;
