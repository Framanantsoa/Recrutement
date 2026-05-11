import React from "react";
import { TableRow, TableCell } from "@/styles/table-styles";
import { Link } from "react-router-dom";
import type { CandidatureDTO } from "@/api/recruitment/candidatures/service";
import { formatParam } from "@/pages/recruitment/request/form";
// import { useCanUserPlanJobInterviewByCandidature } from "@/api/recruitment/interview/service";

interface CandidatureTableRowProps {
  candidature: CandidatureDTO;
  canViewDetails?: boolean;
  showActions?: boolean;
  userCanPlan?: boolean;
  userRequiredToPlan?: boolean;

  onPlanClick?: (candidatureId: string) => void;
  onModalOpen?: (id: string) => void;
}

const CandidatureTableRow: React.FC<CandidatureTableRowProps> = ({
  candidature,
  // showActions,
  // userCanPlan,
  // userRequiredToPlan,
  // onPlanClick,
  // onModalOpen,
}) => {
// récupérer userId
  // const userData = JSON.parse(localStorage.getItem("user") || "{}");
  // const userId = userData?.userId;

// HOOKS
  // const { data:checkResponse } = useCanUserPlanJobInterviewByCandidature(userId, candidature.id);

  const getScoreColorClass = (points: number, max: number): string => {
    if (points === 0) return "score-bad";

    const ratio = (points / max) * 100;

    if (ratio < 50) return "score-bad";
    if (ratio <= 75) return "score-warning";

    return "score-good";
  };


  return (<>
    {/* LIGNE TABLE */}
      <TableRow>
        <TableCell style={{ textAlign: "center" }}>
          <label style={{ display: "inline-block", position: "relative", width: 18, height: 18 }}>
            <input
              type="checkbox"
              checked={candidature.isTreated}
              readOnly
              style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
            />
            <span
              style={{
                display: "inline-block",
                width: "100%",
                height: "100%",
                backgroundColor: candidature.isTreated ? "var(--primary-color)" : "#fff",
                border: "1px solid #ccc",
                borderRadius: 4,
                position: "relative",
              }}
            >
              {candidature.isTreated && (
                <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              )}
            </span>
          </label>
        </TableCell>

        <TableCell>
          <Link style={{ textDecoration: "none" }}
            to={`/recrutement/candidatures/${formatParam(candidature.id)}/details`}>
            {candidature.id}
          </Link>
        </TableCell>

        <TableCell>{candidature.firstName}</TableCell>
        <TableCell>{candidature.lastName}</TableCell>
        <TableCell>{candidature.email}</TableCell>

        <TableCell style={{ textAlign: "center" }}>
          {candidature.sendingDateTime
            ? new Date(candidature.sendingDateTime).toLocaleDateString("fr-FR")
            : "N/A"}
        </TableCell>

        <TableCell
          style={{
            textAlign: candidature.isTreated ? "right" : "center",
          }}
          className={candidature.isTreated
            ? getScoreColorClass(candidature.totalScore, candidature.maxScore)
            : ""}
        >
          {candidature.isTreated
            ? `${candidature.totalScore.toFixed(2)}`
            : "-"}
        </TableCell>

        {/* {showActions && (
          <TableCell style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>

              {(userCanPlan && checkResponse) && (
                <ButtonConfirm onClick={() => onPlanClick?.(candidature.id)}>
                  <Pin size={16} />
                </ButtonConfirm>
              )}

              {(userRequiredToPlan && checkResponse) && (
                <ButtonConfirmSecondary onClick={() => {onModalOpen?.(candidature.id)}}>
                  <Check size={16} />
                </ButtonConfirmSecondary>
              )}

            </div>
          </TableCell>
        )} */}
      </TableRow>
    </>
  );
};

export default CandidatureTableRow;