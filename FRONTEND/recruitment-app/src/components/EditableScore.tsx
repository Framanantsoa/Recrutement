import React, { useState } from "react";
import styled from "styled-components";
import { Pencil, Check, X } from "lucide-react";

interface Props {
  label: string;
  value?: number;
  max: number;
  onSave: (value: number) => void;
}

/* ================= STYLES ================= */

const Row = styled.div<{ $editing: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;

  background: ${({ $editing }) =>
    $editing ? "#f0fdf4" : "#f9fafb"};

  border: 1px solid
    ${({ $editing }) =>
      $editing ? "#10b981" : "var(--border-soft)"};

  transition: all 0.2s ease;
`;

const Label = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-dark);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
`;

const Input = styled.input`
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const Button = styled.button<{ variant?: "edit" | "save" | "cancel" }>`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;

  color: ${({ variant }) => {
    if (variant === "save") return "#10b981";
    if (variant === "cancel") return "#ef4444";
    return "#6b7280";
  }};

  &:hover {
    opacity: 0.7;
  }
`;

/* ================= COMPONENT ================= */

const EditableScore: React.FC<Props> = ({ label, value = 0, max, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState<number>(value);

  const handleSave = () => {
    onSave(score);
    setEditing(false);
  };

  const handleCancel = () => {
    setScore(value); // reset
    setEditing(false);
  };

  return (
    <Row $editing={editing}>
      <Label>{label}</Label>

      <Right>
        {editing ? (
          <>
            <Input
              type="number"
              value={score}
              min={0}
              max={max}
              onChange={(e) => setScore(Number(e.target.value))}
            />

            <Button variant="save" onClick={handleSave}>
              <Check size={18} />
            </Button>

            <Button variant="cancel" onClick={handleCancel}>
              <X size={18} />
            </Button>
          </>
        ) : (
          <>
            <Value>{value}</Value>

            <Button variant="edit" onClick={() => setEditing(true)}>
              <Pencil size={18} />
            </Button>
          </>
        )}
      </Right>
    </Row>
  );
};

export default EditableScore;
