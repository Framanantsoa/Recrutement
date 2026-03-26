import React from "react";
import type { CandidatureDetailsDTO } from "@/api/recruitment/candidatures/service";
import type { PreselectionCriterionDTO } from "@/api/recruitment/preselection/service";

interface Props {
  criteria: PreselectionCriterionDTO;
  details: CandidatureDetailsDTO;
}

const PointsTab: React.FC<Props> = ({ criteria, details }) => {

  const getPointsByCriterionId = (criterionId?: string): number => {
    if (!criterionId) return 0;

    return (
      details.points?.find((p) => p.criterionId === criterionId)?.points ?? 0
    );
  };

  const getScoreColorClass = (points: number, max: number): string => {
    if (points === 0) return "score-bad";

    const ratio = (points / max) * 100;

    if (ratio < 50) return "score-bad";
    if (ratio <= 75) return "score-warning";

    return "score-good";
  };

  const ScoreRow: React.FC<{
    label: string;
    score: number;
    max: number;
  }> = ({ label, score, max }) => {
    const colorClass = getScoreColorClass(score, max);

    return (
      <div className={`score-row ${colorClass}`}>
        <span className="score-label">{label}</span>
        <span className="score-value">
          {score.toFixed(2)} / {max}
        </span>
      </div>
    );
  };


  return (
    <div className="request-details-vertical">

      <section className="details-section">
        <h3>Évaluation du candidat</h3>

        {criteria.criteria.map((crit) => {
          const basePoints = getPointsByCriterionId(crit.id);
          const finalScore = basePoints * crit.coefficient;

          return (
            <ScoreRow
              key={crit.id}
              label={crit.criterion}
              score={finalScore}
              max={crit.score}
            />
          );
        })}

        <div className="score-divider" />

        <ScoreRow
          label="Score total"
          score={details.totalScore}
          max={criteria.totalScore}
        />
      </section>

    </div>
  );
};

export default PointsTab;
