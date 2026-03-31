"use client";

import {
  PreselectionTable,
  PreselectionTableHeader,
  PreselectionTotalScore,
} from "@/styles/preselection-styles";

import PreselectionRow from "./PreselectionRow";
import type { PreselectionCriteriaDTO } from "@/api/recruitment/preselection/service";

interface Props {
  settings: PreselectionCriteriaDTO;
  editingId: string | null;
  value: number;
  setValue: (v: number) => void;
  startEdit: (id: string, coefficient: number) => void;
  save: () => void;
}

const PreselectionTableComponent: React.FC<Props> = ({
  settings,
  editingId,
  value,
  setValue,
  startEdit,
  save,
}) => {
  return (
    <PreselectionTable>
      <PreselectionTableHeader>
        <div>Critère</div>
        <div>Coefficient</div>
        <div>Barème</div>
        <div></div>
      </PreselectionTableHeader>

      {settings.criteria.map((c) => (
        <PreselectionRow
          key={c.id}
          criteria={c}
          editingId={editingId}
          value={value}
          setValue={setValue}
          startEdit={startEdit}
          save={save}
        />
      ))}

      <PreselectionTotalScore>
        Score total maximum : <span>{settings.totalScore}</span>
      </PreselectionTotalScore>
    </PreselectionTable>
  );
};

export default PreselectionTableComponent;
