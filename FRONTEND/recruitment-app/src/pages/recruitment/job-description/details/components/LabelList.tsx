import React from "react";
import styled from "styled-components";

// ===== Styled Components =====
const InfoCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;
`;

const ValueList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-dark);
  line-height: 1.8;
`;

const ValueListItem = styled.li`
  margin-bottom: 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

// ===== Composant =====
interface LabelListProps {
  items: string[];
}

const LabelList: React.FC<LabelListProps> = ({ items }) => {
  if (!items.length) return null;

  return (
    <InfoCardColumn>
      <ValueList>
        {items.map((item, i) => (
          <ValueListItem key={i}>{item}</ValueListItem>
        ))}
      </ValueList>
    </InfoCardColumn>
  );
};

export default LabelList;