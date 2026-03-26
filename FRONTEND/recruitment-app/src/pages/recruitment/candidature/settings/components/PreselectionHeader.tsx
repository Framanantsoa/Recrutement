"use client";

import {
  PreselectionHeader,
  PreselectionTitle,
  PreselectionSubtitle,
} from "@/styles/preselection-styles";

const PreselectionHeaderComponent: React.FC = () => {
  return (
    <PreselectionHeader>
      <PreselectionTitle>
        Paramétrage des critères de présélection
      </PreselectionTitle>

      <PreselectionSubtitle>
        Définissez le coefficient de chaque critère pour calculer le score de
        présélection des candidats.
      </PreselectionSubtitle>
    </PreselectionHeader>
  );
};

export default PreselectionHeaderComponent;
