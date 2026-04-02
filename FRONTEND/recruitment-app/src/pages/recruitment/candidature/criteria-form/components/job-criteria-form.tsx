/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  LevelEducationCriteriaForm,
  ExperienceCriteriaForm,
  LangageSkillCriteriaForm,
  JobCriteriaFormDTO,
} from "../hooks/use-save-criteria";

import type { LangageDTO, SpeakingLevelDTO } from "@/api/recruitment/preselection/service";
import type { DocumentDTO } from "@/api/recruitment/service";
import EditableSectionTitle from "@/components/editable-section-title";

import {
  FormFieldCell,
  FormInput,
  FormLabelRequired,
  FormRow,
  FormTable,
  ErrorMessage,
  FormLabel
} from "@/styles/form-container";

import { Separator } from "@/styles/login-styles";
import { StyledSelect } from "@/styles/table-styles";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  formData: JobCriteriaFormDTO;
  fieldErrors?: { [key: string]: any };

  levelEducations: DocumentDTO[];
  speakingLevels: SpeakingLevelDTO[];
  langages: LangageDTO[];

  handleFieldChange: (name: keyof JobCriteriaFormDTO, value: any) => void;

  updateExperience: (
    index: number,
    field: keyof ExperienceCriteriaForm,
    value: number
  ) => void;

  updateLevelEducation: (
    index: number,
    field: keyof LevelEducationCriteriaForm,
    value: any
  ) => void;

  addExperience: () => void;
  removeExperience: (index: number) => void;

  updateLangage: (
    index: number,
    field: keyof LangageSkillCriteriaForm,
    value: any
  ) => void;

  addLangage: () => void;
  removeLangage: (index: number) => void;
}

const JobCriteriaForm: React.FC<Props> = ({
  formData,
  fieldErrors = {},
  levelEducations,
  speakingLevels,
  langages,

  handleFieldChange,

  updateLevelEducation,

  updateExperience,
  addExperience,
  removeExperience,

  updateLangage,
  addLangage,
  removeLangage
}) => {

  const getExperienceError = (index: number, field: keyof ExperienceCriteriaForm | string) => {
    return fieldErrors.experiences?.[index]?.[field]?.join(", ");
  };

  const getLangageError = (index: number, field: keyof LangageSkillCriteriaForm | string) => {
    return fieldErrors.langages?.[index]?.[field]?.join(", ");
  };

  console.log("Erreurs :", fieldErrors);

  return (
    <>
      {/* ================= EDUCATION ================= */}
      {fieldErrors.totalPoints && fieldErrors.totalPoints.length > 0 && (
        <ErrorMessage>{fieldErrors.totalPoints.join(", ")}</ErrorMessage>
      )}

      <EditableSectionTitle
        title="Niveau d'étude"
        value={formData.levelEducationsPoints}
        onChange={(val) => handleFieldChange("levelEducationsPoints", val)}
      />

      {formData.levelEducationsPoints > 0 && (
        <FormTable>
          <tbody>
            {formData.levelEducation.map((lvl, index) => {
              const levelName = levelEducations.find(l => l.id === lvl.levelId)?.name;

              return (
                <FormRow key={lvl.levelId}>
                  <FormFieldCell>
                    <FormLabelRequired>Niveau</FormLabelRequired>
                    <FormInput
                      type="text"
                      value={levelName || ""}
                      disabled
                    />
                  </FormFieldCell>

                  <FormFieldCell>
                    <FormLabelRequired>Points</FormLabelRequired>
                    <FormInput
                      type="number"
                      max={formData.levelEducationsPoints}
                      value={lvl.points}
                      onChange={(e) =>
                        updateLevelEducation(index, "points", Number(e.target.value))
                      }
                    />

                    {fieldErrors.levelEducation?.[index]?.points && (
                      <ErrorMessage>
                        {fieldErrors.levelEducation[index].points.join(", ")}
                      </ErrorMessage>
                    )}
                  </FormFieldCell>
                </FormRow>
              );
            })}
          </tbody>
        </FormTable>
      )}

      <Separator />

      {/* ================= EXPERIENCES ================= */}
      <EditableSectionTitle
        title="Expériences professionnelles"
        value={formData.experiencesPoints}
        onChange={(val) => handleFieldChange("experiencesPoints", val)}
      />

      {formData.experiencesPoints > 0 && (
        <FormTable>
          <tbody>
            {formData.experiences.map((exp, index) => (
              <FormRow key={index}>
                <FormFieldCell>
                  <FormLabel>Année minimum</FormLabel>
                  <FormInput
                    type="number"
                    value={exp.minimum}
                    onChange={(e) =>
                      updateExperience(index, "minimum", Number(e.target.value))
                    }
                    // min={index > 0 ? formData.experiences[index - 1].maximum + 1 : 0}
                    // readOnly
                  />

                  {getExperienceError(index, "minimum") && (
                    <ErrorMessage>{getExperienceError(index, "minimum")}</ErrorMessage>
                  )}
                  {getExperienceError(index, "range") && (
                    <ErrorMessage>{getExperienceError(index, "range")}</ErrorMessage>
                  )}
                  {getExperienceError(index, "overlap") && (
                    <ErrorMessage>{getExperienceError(index, "overlap")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  <FormLabelRequired>Année maximum</FormLabelRequired>
                  <FormInput
                    type="number"
                    value={exp.maximum}
                    onChange={(e) =>
                      updateExperience(index, "maximum", Number(e.target.value))
                    }
                  />

                  {getExperienceError(index, "maximum") && (
                    <ErrorMessage>{getExperienceError(index, "maximum")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  <FormLabelRequired>Points</FormLabelRequired>
                  <FormInput
                    type="number"
                    max={formData.experiencesPoints}
                    value={exp.points}
                    onChange={(e) =>
                      updateExperience(index, "points", Number(e.target.value))
                    }
                  />

                  {getExperienceError(index, "points") && (
                    <ErrorMessage>{getExperienceError(index, "points")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  {index > 0 && (
                    <button type="button" style={{ marginTop:"20px" }} onClick={() => removeExperience(index)}>
                      <Minus size={16} />
                    </button>
                  )}
                </FormFieldCell>
              </FormRow>
            ))}

            <FormRow>
              <FormFieldCell colSpan={4}>
                <button type="button" onClick={addExperience}>
                  <Plus size={16} /> Ajouter une expérience
                </button>
              </FormFieldCell>
            </FormRow>
          </tbody>
        </FormTable>
      )}

      <Separator />

      {/* ================= LANGUES ================= */}
      <EditableSectionTitle
        title="Compétences linguistiques"
        value={formData.langagesPoints}
        onChange={(val) => handleFieldChange("langagesPoints", val)}
      />

      {formData.langagesPoints > 0 && (
        <FormTable>
          <tbody>
            {formData.langages.map((lang, index) => (
              <FormRow key={index}>
                <FormFieldCell>
                  <StyledSelect
                    value={lang.langageId}
                    onChange={(e) =>
                      updateLangage(index, "langageId", e.target.value)
                    }
                  >
                    <option value="">-- Choisir une langue --</option>
                    {langages.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </StyledSelect>

                  {getLangageError(index, "langageId") && (
                    <ErrorMessage>{getLangageError(index, "langageId")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  <StyledSelect
                    value={lang.levelId}
                    onChange={(e) =>
                      updateLangage(index, "levelId", e.target.value)
                    }
                  >
                    <option value="">-- Choisir le niveau --</option>
                    {speakingLevels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </StyledSelect>

                  {getLangageError(index, "levelId") && (
                    <ErrorMessage>{getLangageError(index, "levelId")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  <FormInput
                    type="number"
                    max={formData.langagesPoints}
                    value={lang.points}
                    onChange={(e) =>
                      updateLangage(index, "points", Number(e.target.value))
                    }
                  />

                  {getLangageError(index, "points") && (
                    <ErrorMessage>{getLangageError(index, "points")}</ErrorMessage>
                  )}
                </FormFieldCell>

                <FormFieldCell>
                  {index > 0 && (
                    <button type="button" onClick={() => removeLangage(index)}>
                      <Minus size={16} />
                    </button>
                  )}
                </FormFieldCell>
              </FormRow>
            ))}

            <FormRow>
              <FormFieldCell colSpan={4}>
                <button type="button" onClick={addLangage}>
                  <Plus size={16} /> Ajouter une langue
                </button>
              </FormFieldCell>
            </FormRow>
          </tbody>
        </FormTable>
      )}

      <Separator />

      {/* ================= PRESENTATION ================= */}
      <EditableSectionTitle
        title="Clarté du CV + LM"
        value={formData.presentationsPoints}
        onChange={(val) => handleFieldChange("presentationsPoints", val)}
      />

      {/* ================= FORMATIONS ================= */}
      <EditableSectionTitle
        title="Diplômes et/ou Formations"
        value={formData.formationsPoints}
        onChange={(val) => handleFieldChange("formationsPoints", val)}
      />
    </>
  );
};

export default JobCriteriaForm;