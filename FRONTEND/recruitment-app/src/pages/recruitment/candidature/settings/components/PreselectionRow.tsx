"use client";

import { Pencil } from "lucide-react";

import {
  PreselectionRow,
  PreselectionCriteriaName,
  PreselectionCoefficient,
  PreselectionScore,
  PreselectionActions,
  PreselectionEditButton,
  PreselectionSaveButton,
} from "@/styles/preselection-styles";
import type { PreselectionCriteriaItemDTO } from "@/api/recruitment/preselection/service";

interface Props {
  criteria: PreselectionCriteriaItemDTO;
  editingId: string | null;
  value: number;
  setValue: (v: number) => void;
  startEdit: (id: string, coefficient: number) => void;
  save: () => void;
}

const PreselectionRowComponent: React.FC<Props> = ({
  criteria,
  editingId,
  value,
  setValue,
  startEdit,
  save,
}) => {
  return (
    <PreselectionRow>
      <PreselectionCriteriaName>
        {criteria.criteria}
      </PreselectionCriteriaName>

      <PreselectionCoefficient>
        {editingId === criteria.id ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ) : (
          criteria.coefficient
        )}
      </PreselectionCoefficient>

      <PreselectionScore>{criteria.score} pts</PreselectionScore>

      <PreselectionActions>
        {editingId === criteria.id ? (
          <PreselectionSaveButton onClick={save}>
            Enregistrer
          </PreselectionSaveButton>
        ) : (
          <PreselectionEditButton
            onClick={() =>
              startEdit(criteria.id, criteria.coefficient)
            }
          >
            <Pencil size={16} />
          </PreselectionEditButton>
        )}
      </PreselectionActions>
    </PreselectionRow>
  );
};

export default PreselectionRowComponent;
