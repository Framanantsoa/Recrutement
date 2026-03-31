import { useState, useCallback } from "react";

type FieldErrors = { [key: string]: string[] };

export interface LangageForm {
  langageId: string;
  levelId: string;
}

export interface JobCriteriaForm {
  jobDescId: string;
  minLevelEducationId: string;
  minExperienceYears: number;
  langages: LangageForm[];
}

const useSaveCriteria = (jobDescId: string) => {
  const [formData, setFormData] = useState<JobCriteriaForm>({
    jobDescId,
    minLevelEducationId: "",
    minExperienceYears: 0,
    langages: [{ langageId: "", levelId: "" }]
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearError = (name: string) => {
    setFieldErrors(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "minExperienceYears" ? Number(value) : value
    }));

    clearError(name);
  }, []);

  // Langages (ARRAY)
  const handleLangageChange = (
    index: number,
    field: "langageId" | "levelId",
    value: string
  ) => {
    setFormData(prev => {
      const updated = [...prev.langages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, langages: updated };
    });

    clearError("langages");
  };

  const addLangage = () => {
    setFormData(prev => ({
      ...prev,
      langages: [...prev.langages, { langageId: "", levelId: "" }]
    }));
  };

  const removeLangage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      langages: prev.langages.filter((_, i) => i !== index)
    }));
  };

  // VALIDATION
  const validate = () => {
    const errors: FieldErrors = {};

    if (!formData.minLevelEducationId) {
      errors.minLevelEducationId = ["Champ obligatoire"];
    }

    if (formData.minExperienceYears < 0) {
      errors.minExperienceYears = ["Valeur invalide"];
    }

    if (!formData.langages.length) {
      errors.langages = ["Ajoutez au moins une langue"];
    } else if (
      formData.langages.some(l => !l.langageId || !l.levelId)
    ) {
      errors.langages = ["Toutes les langues doivent être complétées"];
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    fieldErrors,
    handleInputChange,
    handleLangageChange,
    addLangage,
    removeLangage,
    validate
  };
};

export default useSaveCriteria;
