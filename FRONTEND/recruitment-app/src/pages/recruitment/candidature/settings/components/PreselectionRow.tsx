"use client";

import { Pencil } from "lucide-react";

import {
  PreselectionRow,
  PreselectionCriterionName,
  PreselectionCoefficient,
  PreselectionScore,
  PreselectionActions,
  PreselectionEditButton,
  PreselectionSaveButton,
} from "@/styles/preselection-styles";
import type { PreselectionCriterionItemDTO } from "@/api/recruitment/preselection/service";
interface Props {
  criterion: PreselectionCriterionItemDTO;
  editingId: string | null;
  value: number;
  setValue: (v: number) => void;
  startEdit: (id: string, coefficient: number) => void;
  save: () => void;
}

const PreselectionRowComponent: React.FC<Props> = ({
  criterion,
  editingId,
  value,
  setValue,
  startEdit,
  save,
}) => {
  return (
    <PreselectionRow>
      <PreselectionCriterionName>
        {criterion.criterion}
      </PreselectionCriterionName>

      <PreselectionCoefficient>
        {editingId === criterion.id ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        ) : (
          criterion.coefficient
        )}
      </PreselectionCoefficient>

      <PreselectionScore>{criterion.score} pts</PreselectionScore>

      <PreselectionActions>
        {editingId === criterion.id ? (
          <PreselectionSaveButton onClick={save}>
            Enregistrer
          </PreselectionSaveButton>
        ) : (
          <PreselectionEditButton
            onClick={() =>
              startEdit(criterion.id, criterion.coefficient)
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
