"use client";

import React from "react";
import {
    FormTable,
    FormRow,
    FormFieldCell,
    FormLabelRequired,
    FormInput,
    ErrorMessage,
    FormLabel
} from "@/styles/form-container";
import { addDays, format } from "date-fns";

interface Props {
    candidatureId: string;
    formData: {
        interviewDate: string;
        interviewTime: string;
    };
    fieldErrors?: { [key: string]: string[] };
    handleInputChange: (
        e: { target: { name: string; value: string } }
    ) => void;
}

const PlaningContent: React.FC<Props> = ({
    formData,
    candidatureId,
    fieldErrors = {},
    handleInputChange
}) => {
    const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

    return ( <>
        <FormTable>
            <tbody>
            {/* CANDIDATURE */}
                <FormRow>
                    <FormFieldCell colSpan={2}>
                        <FormLabel>Candidature</FormLabel>

                        <FormInput
                            disabled={true}
                            type="text"
                            name="candidature"
                            value={candidatureId}
                        />
                    </FormFieldCell>
                </FormRow>

            {/* DATE & HEURE */}
                <FormRow>
                    <FormFieldCell>
                        <FormLabelRequired>Date</FormLabelRequired>

                        <FormInput
                            type="date"
                            name="interviewDate"
                            min={minDate}
                            value={formData.interviewDate}
                            onChange={handleInputChange}
                        />

                        {fieldErrors.interviewDate && (
                            <ErrorMessage>
                                {fieldErrors.interviewDate.join(", ")}
                            </ErrorMessage>
                        )}
                    </FormFieldCell>
                
                    <FormFieldCell>
                        <FormLabelRequired>Heure (08:00 - 17:00)</FormLabelRequired>

                        <FormInput
                            type="time"
                            name="interviewTime"
                            value={formData.interviewTime}
                            onChange={handleInputChange}
                        />

                        {fieldErrors.interviewTime && (
                            <ErrorMessage>
                                {fieldErrors.interviewTime.join(", ")}
                            </ErrorMessage>
                        )}
                    </FormFieldCell>
                </FormRow>
            </tbody>
        </FormTable>
    </>);
};

export default PlaningContent;
