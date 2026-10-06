/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import {
  PopupOverlay, PagePopup, PopupHeader, PopupTitle,
  PopupClose, PopupContent, ButtonPrimary
} from "@/styles/popup-styles";

import {
  useSearchLangages,
  useSearchSpeakingLevels
} from "@/api/recruitment/preselection/service";
import { useGetAllLevelEducations, type JobCriteriaDTO } from "@/api/recruitment/service";
import { useAddJobCriteria, useUpdateJobCriteria } from "@/api/recruitment/preselection/service";
import useSaveCriteria from "./hooks/use-save-criteria";

import {
  FormContainer, GenericForm, StepContent,
  StepItem, StepNavigation
} from "@/styles/form-container";
import JobCriteriaForm from "./components/job-criteria-form";

interface Props {
  isOpen: boolean;
  jobId: string;
  requestId: string;
  criteria?: JobCriteriaDTO;
  onClose: () => void;
  onUpdated?: (updatedCriteria: JobCriteriaDTO) => void;
  setAlert: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    type: "error" | "info" | "success" | "warning";
    message: string;
  }>>;
}

const PreselectionCriteriaForm: React.FC<Props> = ({
    isOpen,
    jobId,
    requestId,
    criteria,
    onClose, onUpdated, 
    setAlert
}) => {
    const [mode, setMode] = useState<"create" | "edit">("create");

    const { data: langagesResp } = useSearchLangages();
    const { data: speakingResp } = useSearchSpeakingLevels();
    const { data: levelResp } = useGetAllLevelEducations();

    const addCriteria = useAddJobCriteria();
    const updateCriteria = useUpdateJobCriteria();

    const {
        formData,
        fieldErrors,
        initializeLevels,

        handleFieldChange,

        updateExperience,
        addExperience,
        removeExperience,

        updateLevelEducation,

        updateLangage,
        addLangage,
        removeLangage,

        validate,
        setFromExistingData,
    } = useSaveCriteria(jobId);

    useEffect(() => {
        if (criteria) {
            setMode("edit");
    
            setFromExistingData({
                jobDescId: jobId,
                levelEducation: criteria.levelEducations.map(l => ({
                    levelId: l.levelId,
                    points: l.points
                })),
                experiences: criteria.experiences.map(e => ({
                    minimum: e.minYear,
                    maximum: e.maxYear,
                    points: e.points
                })),
                langages: criteria.langages.map(l => ({
                    langageId: l.langageId,
                    levelId: l.levelId,
                    points: l.points
                })),
                formationsPoints: criteria.formationsPoints,
                presentationsPoints: criteria.presentationsPoints,
                experiencesPoints: criteria.experiencesPoints,
                langagesPoints: criteria.langagesPoints,
                levelEducationsPoints: criteria.levelEducationsPoints,
            });
        } else {
            setMode("create");
        }
    }, [criteria]);

// Chargement des données
    useEffect(() => {
        if (levelResp?.data) {
          initializeLevels(levelResp.data);
        }
    }, [levelResp]);

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) {
            setAlert({
                isOpen: true,
                type: "error",
                message: "Veuillez corriger les erreurs du formulaire"
            });
            return;
        }

        try {
            if (mode === "create") {
                await addCriteria.mutateAsync(formData);

                setAlert({
                    isOpen: true,
                    type: "success",
                    message: "Critères ajoutés avec succès"
                });
            } else {
                const updated = await updateCriteria.mutateAsync({
                    jobId, requestId,
                    data: formData
                });

                setAlert({
                    isOpen: true,
                    type: "success",
                    message: "Critères mis à jour avec succès"
                });
                if (onUpdated) onUpdated(updated.data || formData);
            }
            onClose()
        } 
        catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Erreur";

            setAlert({
                isOpen: true,
                type: "error",
                message
            });
        }
    };

    return (
        <PopupOverlay>
            <PagePopup>
                <PopupHeader>
                    <PopupTitle>Critères de présélection</PopupTitle>
                    <PopupClose onClick={onClose}>
                        <X size={20} />
                    </PopupClose>
                </PopupHeader>

                <PopupContent>
                    <StepItem active>
                        <span>1</span> Définition des critères
                    </StepItem>

                    <FormContainer>
                        <GenericForm onSubmit={onSubmit}>
                            <StepContent active>

                                <JobCriteriaForm
                                formData={formData}
                                fieldErrors={fieldErrors}

                                levelEducations={levelResp?.data || []}
                                speakingLevels={speakingResp?.data || []}
                                langages={langagesResp?.data || []}

                                handleFieldChange={handleFieldChange}
                                updateLevelEducation={updateLevelEducation}

                                updateExperience={updateExperience}
                                addExperience={addExperience}
                                removeExperience={removeExperience}

                                updateLangage={updateLangage}
                                addLangage={addLangage}
                                removeLangage={removeLangage}
                                />

                                <StepNavigation>
                                    <ButtonPrimary type="submit">
                                        <Save size={16} />
                                        {mode === "create" ? "Enregistrer" : "Mettre à jour"}
                                    </ButtonPrimary>
                                </StepNavigation>

                            </StepContent>
                        </GenericForm>
                    </FormContainer>

                </PopupContent>
            </PagePopup>
        </PopupOverlay>
    );
};

export default PreselectionCriteriaForm;