"use client";

import React, { useState } from "react";
import { X, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import {
  FormLabelSearch,
  FiltersContainer,
  FiltersSection,
  ButtonSearch,
  ButtonReset,
  Separator,
} from "@/styles/table-styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ActionsContainer,
  ButtonText,
  DateFieldWrapper,
  FieldsContainer,
  FiltersContent,
  FormFieldWrapper
} from "@/styles/recruitment-styles";

export interface PlaningFiltersState {
  dateRange: [Date | null, Date | null];
}

export interface DraftPlaningFilterProps {
  filters: PlaningFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<PlaningFiltersState>>;
  isLoading: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

const DraftPlaningFilters: React.FC<DraftPlaningFilterProps> = ({
  filters,
  setFilters,
  isLoading,
  onSubmit,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setFilters(prev => ({ ...prev, dateRange: dates }));
  };

  const hasFilters =
    filters.dateRange[0] ||
    filters.dateRange[1];

  return (
    <FiltersContainer>
      <FiltersSection>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={18} />
            <strong>Filtres</strong>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(p => !p)}
            title={isOpen ? "Masquer les filtres" : "Afficher les filtres"}
          >
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {isOpen && (
          <>
            <Separator />

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              <FiltersContent>
                <FieldsContainer>

                {/* Date de demande */}
                  <FormFieldWrapper>
                    <FormLabelSearch>Date de réception</FormLabelSearch>
                    <DateFieldWrapper>
                      <DatePicker
                        selectsRange
                        startDate={filters.dateRange[0]}
                        endDate={filters.dateRange[1]}
                        onChange={handleDateChange}
                        isClearable
                        placeholderText="Début - Fin"
                        disabled={isLoading}
                        className="form-input"
                        dateFormat="dd/MM/yyyy"
                      />
                    </DateFieldWrapper>
                  </FormFieldWrapper>

                </FieldsContainer>

                <ActionsContainer>
                  <ButtonReset
                    type="button"
                    onClick={onReset}
                    disabled={!hasFilters || isLoading}
                  >
                    <X size={16} /><ButtonText>Effacer</ButtonText>
                  </ButtonReset>

                  <ButtonSearch type="submit" disabled={isLoading}>
                    <Search size={16} /><ButtonText>Rechercher</ButtonText>
                  </ButtonSearch>
                </ActionsContainer>
              </FiltersContent>
            </form>
          </>
        )}
      </FiltersSection>
    </FiltersContainer>
  );
};

export default DraftPlaningFilters;
