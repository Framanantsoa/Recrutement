import React, { useState } from "react";
import { Filter, ChevronUp, ChevronDown, Search, X } from "lucide-react";
import {
  FormInputSearch,
  FormLabelSearch,
  FiltersContainer,
  FiltersSection,
  ButtonReset,
  ButtonSearch,
  Separator,
  StyledSelect,
} from "@/styles/table-styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ActionsContainer, ButtonText, DateFieldWrapper, FieldsContainer, FiltersContent, FormFieldWrapper } from "@/styles/recruitment-styles";

interface FiltersState {
  name: string;
  treated: boolean | null,
  status: "" | "treated" | "not_treated";
  dateRange: [Date | null, Date | null]; // remplacer dateMin/dateMax
}

interface CandidatureFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onSubmit: (values: FiltersState) => void;
  onReset: () => void;
  isLoading: boolean;
}

/* ================= COMPONENT ================= */

const CandidatureFilters: React.FC<CandidatureFiltersProps> = ({
  filters,
  setFilters,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(filters);
  };

  const hasFilters =
    Object.values(filters)
      .filter(v => typeof v !== "object")
      .some(v => v && v !== "") ||
    (filters.dateRange[0] || filters.dateRange[1]);

  return (
    <FiltersContainer>
      <FiltersSection>
        {/* HEADER */}
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

        {isOpen && (<>
          <Separator />

          <form onSubmit={handleSubmit}>
            <FiltersContent>
              <FieldsContainer>
                <FormFieldWrapper>
                  <FormLabelSearch>Nom</FormLabelSearch>
                  <FormInputSearch
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    placeholder="Rechercher par nom..."
                    disabled={isLoading}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper>
                  <FormLabelSearch>Statut</FormLabelSearch>
                  <StyledSelect
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Toutes</option>
                    <option value="treated">Traitée</option>
                    <option value="not_treated">Non traitée</option>
                  </StyledSelect>
                </FormFieldWrapper>

                <FormFieldWrapper>
                  <FormLabelSearch>Date de candidature</FormLabelSearch>
                  <DateFieldWrapper>
                    <DatePicker
                      selectsRange
                      startDate={filters.dateRange[0]}
                      endDate={filters.dateRange[1]}
                      onChange={(dates) =>
                        setFilters(prev => ({ ...prev, dateRange: dates as [Date | null, Date | null] }))
                      }
                      isClearable
                      placeholderText="Début - Fin"
                      disabled={isLoading}
                      className="form-input" // applique le style identique aux autres champs
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
        </>)}
      </FiltersSection>
    </FiltersContainer>
  );
};

export default CandidatureFilters;
