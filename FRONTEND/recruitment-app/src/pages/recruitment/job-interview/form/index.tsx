import React, { useState, useCallback } from "react";
import { Pin, X } from "lucide-react";
import axios from "axios";

import {
    PopupOverlay,
    PagePopup,
    PopupHeader,
    PopupTitle,
    PopupClose,
    PopupContent,
    ButtonPrimary,
} from "@/styles/popup-styles";

import {
    FormContainer,
    GenericForm,
    StepContent,
    StepItem,
    StepNavigation,
    StepperWrapper
} from "@/styles/form-container";

import Alert from "@/components/alert";
import PlaningContent from "./components/planing-content";
import { usePlaningValidation } from "./hooks/use-planing-validation";
import { useAddJobInterviewPlaning, type PlaningFormDTO } from "@/api/recruitment/interview/service";

interface PlaningFormProps {
    isOpen: boolean;
    candidatureId: string;
    validatorId: string;
    onClose: () => void;
}

const PlaningForm: React.FC<PlaningFormProps> = ({
    isOpen,
    candidatureId,
    validatorId,
    onClose
}) => {
    const [formData, setFormData] = useState({
        interviewDate: "",
        interviewTime: ""
    });
    const [currentStep, ] = useState(1);

    const [alert, setAlert] = useState({
        isOpen: false,
        type: "info" as "success" | "info" | "error",
        message: ""
    });

    const closeAlert = useCallback(
        () => setAlert(a => ({ ...a, isOpen: false })), []
    );

// HOOKS
    const { errors, validate, handleReset } = usePlaningValidation();
    const addjobInterviewPlaning = useAddJobInterviewPlaning();

    if (!isOpen) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showError = (message: string) => {
        setAlert({ isOpen: true, type: "error", message });
    };

    const resetForm = () => {
        setFormData({
            interviewDate: "",
            interviewTime: ""
        });

        handleReset(); // reset erreurs
    };

    const handleClose = () => {
        resetForm();
        onClose();

        closeAlert();
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ VALIDATION
        if (!validate(formData)) {
            showError("Veuillez corriger les champs");
            return;
        }

        try {
            const payload: PlaningFormDTO = {
                candidatureId,
                validatorId,
                dateTime: `${formData.interviewDate}T${formData.interviewTime}`
            };
            console.log("DATA =>", payload);

            await addjobInterviewPlaning.mutateAsync(payload);

            onClose();
            setAlert({
                isOpen: true,
                type: "success",
                message: "Entretien planifié avec succès !"
            });
        } 
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                showError(error.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                showError(error.message);
            } else {
                showError("Erreur inconnue");
            }
        }
    };

    return (
        <PopupOverlay>
            <PagePopup>
                <PopupHeader>
                    <PopupTitle>Planification d'un entretien</PopupTitle>

                    <PopupClose onClick={handleClose}>
                        <X size={20} />
                    </PopupClose>
                </PopupHeader>

                <PopupContent>
                    {alert.isOpen && (
                        <Alert {...alert} onClose={closeAlert} />
                    )}

                    <StepperWrapper>
                        <StepItem active={currentStep === 1}><span>1</span> Date et heure</StepItem>
                    </StepperWrapper>

                    <FormContainer>
                        <GenericForm onSubmit={onSubmit}>

                            <StepContent active={currentStep === 1}>
                                <PlaningContent
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    fieldErrors={errors}
                                    candidatureId={candidatureId}
                                />

                                <StepNavigation>
                                    <ButtonPrimary type="submit">
                                        <Pin size={16} /> Planifier
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

export default PlaningForm;
