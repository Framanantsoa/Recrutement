import React from "react";
import DOMPurify from "dompurify";
import styled from "styled-components";

// ===== Styled Components =====
const InfoCard = styled.div`
  display: flex;
  align-items: center; /* centre verticalement */
  gap: 6px;
`;

const Label = styled.span`
  display: inline-flex;
  align-self: center; /* centre le texte verticalement par rapport au Value */
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const Value = styled.span`
  display: inline-flex;
  align-self: center; /* idem */
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-dark);
  word-break: break-word;
`;

// ===== Composant =====
interface LabelValueProps {
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}

const LabelValue: React.FC<LabelValueProps> = ({ label, value, children }) => {
  const content = children ?? value ?? "—";

  const sanitizedContent =
    typeof content === "string" ? DOMPurify.sanitize(content) : content;

  return (
    <InfoCard>
      <Label>{label} : </Label>
      {typeof sanitizedContent === "string" ? (
        <Value dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      ) : (
        <Value>{sanitizedContent}</Value>
      )}
    </InfoCard>
  );
};

export default LabelValue;