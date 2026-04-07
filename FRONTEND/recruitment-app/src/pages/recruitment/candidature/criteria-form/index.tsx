/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import {
  PopupOverlay, PagePopup, PopupHeader, PopupTitle,
  PopupClose, PopupContent, ButtonPrimary
} from "@/styles/popup-styles";

import Alert from "@/components/alert";
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
  criteria?: JobCriteriaDTO;
  onClose: () => void;
}

const PreselectionCriteriaForm: React.FC<Props> = ({
    isOpen,
    jobId,
    criteria,
    onClose
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

        validate
    } = useSaveCriteria(jobId, mode);

// Chargement des données
    useEffect(() => {
        if (levelResp?.data) {
          initializeLevels(levelResp.data);
        }
    }, [levelResp]);

    type AlertType = "error" | "info" | "success" | "warning";

    const [alert, setAlert] = useState<{
        isOpen: boolean;
        type: AlertType;
        message: string;
    }>({
        isOpen: false,
        type: "info",
        message: ""
    });

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
                await updateCriteria.mutateAsync({
                    jobId,
                    data: formData
                });

                setAlert({
                    isOpen: true,
                    type: "success",
                    message: "Critères mis à jour avec succès"
                });
            }

            onClose();
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
                    {alert.isOpen && (
                        <Alert {...alert} onClose={() =>
                        setAlert(a => ({ ...a, isOpen: false }))
                        } />
                    )}

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