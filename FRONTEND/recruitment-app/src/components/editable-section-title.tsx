import React, { useState } from "react";
import styled from "styled-components";
import { Pencil } from "lucide-react";

// === STYLE WRAPPER ===
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, var(--primary-color), transparent);
    border-radius: 1px;
  }
`;

const Title = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PointsText = styled.span`
  font-weight: 500;
  color: var(--text-color);
`;

const EditButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;

  &:hover {
    color: var(--primary-color);
  }
`;

const Input = styled.input`
  width: 80px;
  padding: 4px;
  font-size: 14px;
`;

// === PROPS ===
interface Props {
  title: string;
  value: number;
  onChange: (value: number) => void;
}

// === COMPONENT ===
const EditableSectionTitle: React.FC<Props> = ({
  title,
  value,
  onChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(localValue);
  };

  return (
    <Container>
      <Title>{title}</Title>

      <RightBlock>
        {isEditing ? (
          <Input
            type="number"
            value={localValue}
            onChange={(e) => setLocalValue(Number(e.target.value))}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <>
            <PointsText>{value} pts</PointsText>
            <EditButton onClick={() => setIsEditing(true)}>
              <Pencil size={16} />
            </EditButton>
          </>
        )}
      </RightBlock>
    </Container>
  );
};

export default EditableSectionTitle;
