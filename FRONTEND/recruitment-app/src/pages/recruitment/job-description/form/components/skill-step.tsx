"use client";

import React from "react";
import {
    FormSectionTitle,
    FormTable,
    FormRow,
    FormFieldCell,
    FormInput,
    ErrorMessage
} from "@/styles/form-container";
import { Plus, Minus } from "lucide-react";

interface FormData {
    softSkills: string[];
    skills: string[];
}

interface FieldErrors {
    [key: string]: string[];
}

interface Props {
    formData: FormData;
    fieldErrors?: FieldErrors;
    handleInputChange: (
        e: { 
            target: { name: keyof FormData; value: string[] } 
        }
    ) => void;
}

const SkillStep: React.FC<Props> = ({ formData, fieldErrors = {}, handleInputChange }) => {
    // const { data: softSkillsResponse } = useGetAllSoftSkills();
    // const allSoftSkills = useMemo(() => softSkillsResponse?.data || [], [softSkillsResponse]);

    /* ========= SOFT SKILLS ========= */
    const addSoftSkill = () => {
        const newSoftSkills: string[] = [...formData.softSkills, ""];
        handleInputChange({ target: { name: "softSkills", value: newSoftSkills } });
    };

    const removeSoftSkill = (index: number) => {
        const newSoftSkills = [...formData.softSkills];
        newSoftSkills.splice(index, 1);
        handleInputChange({ target: { name: "softSkills", value: newSoftSkills } });
    };

    const updateSoftSkill = (index: number, value: string) => {
        const newSoftSkills = [...formData.softSkills];
        newSoftSkills[index] = value;
        handleInputChange({ target: { name: "softSkills", value: newSoftSkills } });
    };

    /* ========= COMPETENCES ========= */
    const addSkill = () => {
        const newSkills: string[] = [...formData.skills, ""]; // <- ajout d'une string vide
        handleInputChange({ target: { name: "skills", value: newSkills } });
    };

    const updateSkill = (index: number, value: string) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value; // ok
        handleInputChange({ target: { name: "skills", value: newSkills } });
    };

    const removeSkill = (index: number) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        handleInputChange({ target: { name: "skills", value: newSkills } });
    };

    return ( <>
        <FormSectionTitle>Qualités personnelles</FormSectionTitle>
        <FormTable>
            <tbody>
                {formData.softSkills.map((softSkill, index) => (
                    <FormRow key={index}>
                        <FormFieldCell>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ width: 24, textAlign: "center", fontWeight: 500 }}>{index + 1}</span>
                                <FormInput
                                    type="text"
                                    value={softSkill}
                                    placeholder="Qualité personnelle"
                                    onChange={(e) => updateSoftSkill(index, e.target.value)}
                                    style={{ flex: 1, borderColor: fieldErrors.softSkills ? "red" : undefined }}
                                />
                                {index > 0 && (
                                    <button type="button" onClick={() => removeSoftSkill(index)} style={{ padding: "0 8px" }}>
                                        <Minus size={16} />
                                    </button>
                                )}
                            </div>
                        </FormFieldCell>
                    </FormRow>
                ))}
                {fieldErrors.softSkills?.length > 0 && (
                    <FormRow>
                        <FormFieldCell>
                            <ErrorMessage>{fieldErrors.softSkills.join(", ")}</ErrorMessage>
                        </FormFieldCell>
                    </FormRow>
                )}

                <FormRow>
                    <FormFieldCell>
                        <button
                            type="button"
                            onClick={addSoftSkill}
                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px" }}
                        >
                            <Plus size={16} /> Ajouter une qualité personnelle
                        </button>
                    </FormFieldCell>
                </FormRow>
            </tbody>
        </FormTable>

        <FormSectionTitle>Compétences</FormSectionTitle>
        <FormTable>
            <tbody>
                {formData.skills.map((skill, index) => (
                    <FormRow key={index}>
                        <FormFieldCell>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ width: 24, textAlign: "center", fontWeight: 500 }}>{index + 1}</span>
                                <FormInput
                                    type="text"
                                    value={skill}
                                    placeholder="Compétence"
                                    onChange={(e) => updateSkill(index, e.target.value)}
                                    style={{ flex: 1, borderColor: fieldErrors.skills ? "red" : undefined }}
                                />
                                {index > 0 && (
                                    <button type="button" onClick={() => removeSkill(index)} style={{ padding: "0 8px" }}>
                                        <Minus size={16} />
                                    </button>
                                )}
                            </div>
                        </FormFieldCell>
                    </FormRow>
                ))}
                {fieldErrors.skills?.length > 0 && (
                    <FormRow>
                        <FormFieldCell>
                            <ErrorMessage>{fieldErrors.skills.join(", ")}</ErrorMessage>
                        </FormFieldCell>
                    </FormRow>
                )}

                <FormRow>
                    <FormFieldCell>
                        <button
                            type="button"
                            onClick={addSkill}
                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px" }}
                        >
                            <Plus size={16} /> Ajouter une compétence
                        </button>
                    </FormFieldCell>
                </FormRow>
            </tbody>
        </FormTable>
    </> );
};

export default SkillStep;
