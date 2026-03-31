import type { LangageDTO, SpeakingLevelDTO } from "@/api/recruitment/preselection/service";
import type { DocumentDTO } from "@/api/recruitment/service";
import {
    ErrorMessage,
    FormFieldCell,
    FormInput,
    FormLabelRequired,
    FormRow,
    FormSectionTitle,
    FormTable
} from "@/styles/form-container";
import { Separator } from "@/styles/login-styles";
import { StyledSelect } from "@/styles/table-styles";
import React from "react";

interface JobCriteriaFormProps {
    formData: {
        jobDescId: string;
        minLevelEducationId: string;
        minExperienceYears: number;
        langages: {
            langageId: string;
            levelId: string;
        }[];
    };

    levelEducations: DocumentDTO[];
    speakingLevels: SpeakingLevelDTO[];
    langages: LangageDTO[];

    fieldErrors?: { [key: string]: string[] };

    handleInputChange: (
        e: {
            target: {
                name: keyof JobCriteriaFormProps["formData"];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: any;
            };
        }
    ) => void;
}

const JobCriteriaForm: React.FC<JobCriteriaFormProps> = ({
    levelEducations,
    speakingLevels,
    langages,
    handleInputChange,
    formData,
    fieldErrors = {}
}) => {

    /* ========= LANGAGES ========= */
    const addLangage = () => {
        const newLangages = [...formData.langages, { langageId: "", levelId: "" }];
        handleInputChange({ target: { name: "langages", value: newLangages } });
    };

    const removeLangage = (index: number) => {
        const newLangages = [...formData.langages];
        newLangages.splice(index, 1);
        handleInputChange({ target: { name: "langages", value: newLangages } });
    };

    const updateLangage = (index: number, field: "langageId" | "levelId", value: string) => {
        const newLangages = [...formData.langages];
        newLangages[index] = {
            ...newLangages[index],
            [field]: value
        };
        handleInputChange({ target: { name: "langages", value: newLangages } });
    };

    return (
        <>
            <FormSectionTitle>Compétences de base</FormSectionTitle>

            <FormTable>
                <tbody>
                    {/* Niveau étude */}
                    <FormRow>
                        <FormFieldCell colSpan={2}>
                            <FormLabelRequired>Niveau d'étude minimum</FormLabelRequired>

                            <StyledSelect
                                value={formData.minLevelEducationId || ""}
                                onChange={(e) =>
                                    handleInputChange({
                                        target: {
                                            name: "minLevelEducationId",
                                            value: e.target.value
                                        }
                                    })
                                }
                            >
                                <option value="" disabled>-- Sélectionner un niveau --</option>

                                {levelEducations.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </StyledSelect>

                            {fieldErrors.minLevelEducationId && (
                                <ErrorMessage>
                                    {fieldErrors.minLevelEducationId.join(", ")}
                                </ErrorMessage>
                            )}
                        </FormFieldCell>
                    </FormRow>

                    {/* Expérience */}
                    <FormRow>
                        <FormFieldCell>
                            <FormLabelRequired>Années d'expérience professionnel</FormLabelRequired>

                            <FormInput
                                type="text"
                                value={formData.minExperienceYears.toString()}
                                onChange={(e) =>
                                    handleInputChange({
                                        target: {
                                            name: "minExperienceYears",
                                            value: Number(e.target.value)
                                        }
                                    })
                                }
                            />

                            {fieldErrors.minExperienceYears && (
                                <ErrorMessage>
                                    {fieldErrors.minExperienceYears.join(", ")}
                                </ErrorMessage>
                            )}
                        </FormFieldCell>
                    </FormRow>
                </tbody>
            </FormTable>

            <Separator />

            <FormSectionTitle>Compétences linguistiques</FormSectionTitle>

            <FormTable>
                <tbody>
                    {formData.langages.map((lang, index) => (
                        <FormRow key={index}>
                            <FormFieldCell colSpan={2}>
                                <FormLabelRequired>Langue</FormLabelRequired>

                                <StyledSelect
                                    value={lang.langageId}
                                    onChange={(e) =>
                                        updateLangage(index, "langageId", e.target.value)
                                    }
                                >
                                    <option value="" disabled>-- Sélectionner une langue --</option>
                                    {langages.map((l) => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </StyledSelect>
                            </FormFieldCell>

                            <FormFieldCell colSpan={2}>
                                <FormLabelRequired>Niveau</FormLabelRequired>

                                <StyledSelect
                                    value={lang.levelId}
                                    onChange={(e) =>
                                        updateLangage(index, "levelId", e.target.value)
                                    }
                                >
                                    <option value="" disabled>-- Sélectionner un niveau --</option>
                                    {speakingLevels.map((lvl) => (
                                        <option key={lvl.id} value={lvl.id}>
                                            {lvl.name} ({lvl.code})
                                        </option>
                                    ))}
                                </StyledSelect>
                            </FormFieldCell>

                            <FormFieldCell>
                                {index > 0 && (
                                    <button type="button" onClick={() => removeLangage(index)}>
                                        ❌
                                    </button>
                                )}
                            </FormFieldCell>
                        </FormRow>
                    ))}

                    {/* erreurs */}
                    {fieldErrors.langages?.length > 0 && (
                        <FormRow>
                            <FormFieldCell colSpan={4}>
                                <ErrorMessage>{fieldErrors.langages.join(", ")}</ErrorMessage>
                            </FormFieldCell>
                        </FormRow>
                    )}

                    {/* bouton add */}
                    <FormRow>
                        <FormFieldCell colSpan={4}>
                            <button type="button" onClick={addLangage}>
                                + Ajouter une langue
                            </button>
                        </FormFieldCell>
                    </FormRow>
                </tbody>
            </FormTable>
        </>
    );
};

export default JobCriteriaForm;