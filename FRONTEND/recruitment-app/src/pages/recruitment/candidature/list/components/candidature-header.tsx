import React from "react";
import styled from "styled-components";

interface Props {
  details?: {
    contract: string;
    direction: string;
    post: string;
  };
}

// 🎨 Styles
const HeaderContainer = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding: 20px 24px;
  margin-bottom: 20px;

  background: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
  padding-right: 20px;
  border-right: 1px solid #eee;

  &:last-child {
    border-right: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--text-muted, #666);
  font-size: 13px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary, #222);
`;

// 🧩 Composant
const CandidatureHeader: React.FC<Props> = ({ details }) => {
  if (!details) return null;

  return (
    <HeaderContainer>
      <Item>
        <Label>Poste</Label>
        <Value>{details.post}</Value>
      </Item>

      <Item>
        <Label>Direction</Label>
        <Value>{details.direction}</Value>
      </Item>

      <Item>
        <Label>Contrat</Label>
        <Value>{details.contract}</Value>
      </Item>
    </HeaderContainer>
  );
};

export default CandidatureHeader;
