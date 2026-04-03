import React from "react";
import type { CandidatureDetailsDTO } from "@/api/recruitment/candidatures/service";

interface Props {
  details: CandidatureDetailsDTO;
}

const PointsTab: React.FC<Props> = ({ details }) => {
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

        {details.scores.map((cand) => {
          return (
            <ScoreRow
              key={cand.criteriaId}
              label={cand.criteria}
              score={cand.points}
              max={cand.max}
            />
          );
        })}

        <div className="score-divider" />

        <ScoreRow
          label="Score total"
          score={details.totalScore}
          max={details.maxScore}
        />
      </section>

    </div>
  );
};

export default PointsTab;
