import React from "react";
import { Save, X } from "lucide-react";
import axios from "axios";

import {
  PopupOverlay, PagePopup, PopupHeader, PopupTitle,
  PopupClose, PopupContent, ButtonPrimary
} from "@/styles/popup-styles";

import Alert from "@/components/alert";
import {
  useSearchLangages,
  useSearchSpeakingLevels
} from "@/api/recruitment/preselection/service";
import { useGetAllLevelEducations } from "@/api/recruitment/service";
import { useAddJobCriteria } from "@/api/recruitment/preselection/service";
import useSaveCriteria from "./hooks/use-save-criteria";
import { 
    FormContainer, GenericForm, StepContent, StepItem, StepNavigation
} from "@/styles/form-container";
import JobCriteriaForm from "./components/job-criteria-form";

interface Props {
    isOpen: boolean;
    jobId: string;
    onClose: () => void;
}

const PreselectionCriteriaForm: React.FC<Props> = ({
    isOpen, jobId, onClose
}) => {
    const { data: langagesResp } = useSearchLangages();
    const { data: speakingResp } = useSearchSpeakingLevels();
    const { data: levelResp } = useGetAllLevelEducations();

    const [currentStep] = React.useState(1);

    const addCriteria = useAddJobCriteria();

    const {
        formData,
        fieldErrors,
        handleInputChange,
        validate
    } = useSaveCriteria(jobId);

    type AlertType = "error" | "info" | "success" | "warning";

    const [alert, setAlert] = React.useState<{
        isOpen: boolean;
        type: AlertType;
        message: string;
    }>({
        isOpen: false,
        type: "info",
        message: ""
    });

    if (!isOpen) return null;

    const showError = (message: string) =>
        setAlert({ isOpen: true, type: "error", message });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await addCriteria.mutateAsync(formData);

            setAlert({
                isOpen: true,
                type: "success",
                message: "Critères ajoutés avec succès"
            });

            setTimeout(() => onClose(), 1000);
        } 
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                showError(error.response?.data?.message || error.message);
            } 
            else if (error instanceof Error) {
                showError(error.message);
            } 
            else {
                showError("Erreur inconnue");
            }
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
                    {alert.isOpen && 
                        <Alert {...alert} onClose={() => setAlert(a => ({
                            ...a, isOpen: false 
                        }))} />
                    }
                    
                    <StepItem active={currentStep === 1}>
                        <span>1</span> Critères
                    </StepItem>

                    <FormContainer>
                        <GenericForm onSubmit={onSubmit}>

                            <StepContent active={currentStep === 1}>
                                <JobCriteriaForm
                                    formData={formData}
                                    fieldErrors={fieldErrors}
                                    handleInputChange={handleInputChange}
                                    levelEducations={levelResp?.data || []}
                                    speakingLevels={speakingResp?.data || []}
                                    langages={langagesResp?.data || []}
                                />

                                <StepNavigation>
                                    <ButtonPrimary type="submit">
                                        <Save size={16} /> Enregistrer
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
