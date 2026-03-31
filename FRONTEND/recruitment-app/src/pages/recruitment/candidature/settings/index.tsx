"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  PreselectionContainer,
  PreselectionFooter,
} from "@/styles/preselection-styles";

import { ButtonView } from "@/styles/table-styles";

import {
  useSearchCriteria,
  useUpdateCriteriaCoefficient,
  type PreselectionCriteriaDTO,
} from "@/api/recruitment/preselection/service";

import PreselectionHeader from "./components/PreselectionHeader";
import PreselectionTable from "./components/PreselectionTable";
import ProtectedRoute from "@/components/protected-route";

const PreselectionSetting: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useSearchCriteria();
  const updateCoefficient = useUpdateCriteriaCoefficient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = useState<number>(0);

  if (isLoading) return <div>Chargement...</div>;

  const settings: PreselectionCriteriaDTO = data?.data || {
    criteria: [],
    totalScore: 0
  };

  const startEdit = (id: string, coefficient: number) => {
    setEditingId(id);
    setValue(coefficient);
  };

  const save = () => {
    if (!editingId) return;

    updateCoefficient.mutate({
      id: editingId,
      coefficient: value,
    });

    setEditingId(null);
  };

  return (
    <PreselectionContainer>

      <PreselectionHeader />

      <PreselectionTable
        settings={settings}
        editingId={editingId}
        value={value}
        setValue={setValue}
        startEdit={startEdit}
        save={save}
      />

      <PreselectionFooter>
        <ButtonView
          style={{ background: "var(--info-bg)" }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Retour
        </ButtonView>
      </PreselectionFooter>

    </PreselectionContainer>
  );
};

const ProtectedPreselectionSetting: React.FC = () => (
  <ProtectedRoute requiredHabilitation="Gérer les paramétrages du recrutement">
    <PreselectionSetting />
  </ProtectedRoute>
);

export default ProtectedPreselectionSetting;
