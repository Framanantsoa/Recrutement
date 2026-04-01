/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type FieldErrors = {
  levelEducation?: { levelId?: string[], points?: string[] }[];
  formationsPoints?: string[];
  presentationsPoints?: string[];
  experiences?: { minimum?: string[], maximum?: string[], points?: string[], range?: string[], overlap?: string[] }[];
  langages?: { langageId?: string[], levelId?: string[], points?: string[] }[];
  totalPoints?: string[];
};

export interface LevelEducationCriteriaForm {
  levelId: string;
  points: number;
}

export interface ExperienceCriteriaForm {
  minimum: number;
  maximum: number;
  points: number;
}

export interface LangageSkillCriteriaForm {
  langageId: string;
  levelId: string;
  points: number;
}

export interface JobCriteriaFormDTO {
  jobDescId: string;
  levelEducation: LevelEducationCriteriaForm[];
  experiences: ExperienceCriteriaForm[];
  langages: LangageSkillCriteriaForm[];

  formationsPoints: number;
  presentationsPoints: number;
  experiencesPoints: number;
  langagesPoints: number;
  levelEducationsPoints: number;
}

const useSaveCriteria = (jobDescId: string) => {
  const initialState: JobCriteriaFormDTO = {
    jobDescId,
    levelEducation: [{ levelId: "", points: 0 }],
    experiences: [{ minimum: 0, maximum: 0, points: 0 }],
    langages: [{ langageId: "", levelId: "", points: 0 }],

    formationsPoints: 0,
    presentationsPoints: 0,
    experiencesPoints: 0,
    langagesPoints: 0,
    levelEducationsPoints: 0,
  };

  const initializeLevels = (levels: { id: string }[]) => {
    setFormData(prev => ({
      ...prev,
      levelEducation: levels.map(l => ({
        levelId: l.id,
        points: 0
      }))
    }));
  };

  const [formData, setFormData] = useState<JobCriteriaFormDTO>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearError = (path: string) => {
    setFieldErrors(prev => {
      const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
      const copy = { ...prev };

      let obj: any = copy;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in obj)) return prev;

        if (Array.isArray(obj[key])) obj[key] = [...obj[key]];
        else if (typeof obj[key] === 'object' && obj[key] !== null) obj[key] = { ...obj[key] };

        obj = obj[key];
      }

      const lastKey = keys[keys.length - 1];
      if (obj && lastKey in obj) {
        delete obj[lastKey];
      }

      // 🔹 Nettoyer tous les objets vides dans FieldErrors
      const clean = (o: any): any => {
        if (Array.isArray(o)) {
          const arr = o.map(clean).filter(item => {
            // supprimer les objets vides
            return item && (typeof item !== 'object' || Object.keys(item).length > 0);
          });
          return arr.length > 0 ? arr : undefined;
        } 
        else if (o && typeof o === 'object') {
          const newObj: Record<string, any> = {};
          Object.entries(o).forEach(([k, v]) => {
            const cleaned = clean(v);
            if (cleaned !== undefined) newObj[k] = cleaned;
          });
          return Object.keys(newObj).length > 0 ? newObj : undefined;
        }
        return o;
      };

      return (clean(copy) || {}) as FieldErrors;
    });
  };

  // 🔹 Réinitialise le formulaire
  const handleReset = () => {
    setFormData(initialState);
    setFieldErrors({});
  };

  // 🔹 Champs simples
  const handleFieldChange = (name: keyof JobCriteriaFormDTO, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name as string);
  };

  // 🔹 Niveau d'éducation
  const updateLevelEducation = (
    index: number,
    field: keyof LevelEducationCriteriaForm,
    value: any
  ) => {
    setFormData(prev => {
      const updated = [...prev.levelEducation];
      updated[index] = {
        ...updated[index],
        [field]: field === "points" ? Number(value) : value
      };
      return { ...prev, levelEducation: updated };
    });
  
    clearError(`levelEducation[${index}].${field}`);
  };

  // 🔹 Expériences
  const updateExperience = (index: number, field: keyof ExperienceCriteriaForm, value: number) => {
    setFormData(prev => {
      const updated = [...prev.experiences];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
    clearError(`experiences[${index}].${field}`);
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { minimum: 0, maximum: 0, points: 0 }]
    }));
    setFieldErrors(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), {}]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
    // Supprime l'erreur associée
    setFieldErrors(prev => {
      const copy = { ...prev };
      copy.experiences = copy.experiences?.filter((_, i) => i !== index);
      return copy;
    });
  };

  // 🔹 Langues
  const updateLangage = (index: number, field: keyof LangageSkillCriteriaForm, value: any) => {
    setFormData(prev => {
      const updated = [...prev.langages];
      updated[index] = { ...updated[index], [field]: field === "points" ? Number(value) : value };
      return { ...prev, langages: updated };
    });
    clearError(`langages[${index}].${field}`);
  };

  const addLangage = () => {
    setFormData(prev => ({
      ...prev,
      langages: [...prev.langages, { langageId: "", levelId: "", points: 0 }]
    }));
    setFieldErrors(prev => ({
      ...prev,
      langages: [...(prev.langages || []), {}]
    }));
  };

  const removeLangage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      langages: prev.langages.filter((_, i) => i !== index)
    }));
    setFieldErrors(prev => {
      const copy = { ...prev };
      copy.langages = copy.langages?.filter((_, i) => i !== index);
      return copy;
    });
  };

  // 🔹 Validation
  const validate = (): boolean => {
    const errors: FieldErrors = {};

    const levelErrors: FieldErrors["levelEducation"] = [];

  // Niveau d'étude
    formData.levelEducation.forEach((lvl, i) => {
      const e: any = {};

      if (!lvl.levelId) e.levelId = ["Veuillez choisir un niveau"];
      if (lvl.points <= 0) e.points = ["Points requis"];

      if (Object.keys(e).length > 0) levelErrors[i] = e;
    });
    if (levelErrors.length > 0) errors.levelEducation = levelErrors;

    // Formations / Présentations
    if (formData.formationsPoints == null || formData.formationsPoints <= 0) {
      errors.formationsPoints = ["Points de formation requis"];
    }

    if (formData.presentationsPoints == null || formData.presentationsPoints <= 0) {
      errors.presentationsPoints = ["Points de présentation requis"];
    }

    // Expériences
    const expErrors: FieldErrors["experiences"] = [];
    formData.experiences.forEach((exp, i) => {
      const e: typeof expErrors[0] = {};
      if (exp.minimum == null) e.minimum = ["Min requis"];
      if (exp.maximum == null) e.maximum = ["Max requis"];
      if (exp.points == null || exp.points <= 0) e.points = ["Points requis"];
      if (exp.minimum > exp.maximum) e.range = ["Min ne peut pas dépasser Max"];
    
      // Vérifier chevauchement
      formData.experiences.forEach((other, j) => {
        if (i === j) return;
        if (exp.minimum <= other.maximum && exp.maximum >= other.minimum) {
          e.overlap = ["Intervalle d'année d'expérience en chevauchement"];
        }
      });
    
      if (Object.keys(e).length > 0) expErrors[i] = e; // n'ajoute que si erreur
    });

    if (expErrors.length > 0) errors.experiences = expErrors;

    // Langages
    const langErrors: FieldErrors["langages"] = [];
    formData.langages.forEach((l, i) => {
      const e: typeof langErrors[0] = {};
      if (!l.langageId) e.langageId = ["Veuillez choisir une langue"];
      if (!l.levelId) e.levelId = ["Niveau requis"];
      if (l.points == null || l.points <= 0) e.points = ["Points de compétence linguistique requis"];

      if (Object.keys(e).length > 0) langErrors[i] = e;
    });

// Vérifier s'il y a des erreurs
    const hasErrors = Object.keys(errors).some(k => {
      const val = (errors as any)[k];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "object" && val !== null)
        return Object.values(val).some((v: any) => Array.isArray(v) ? v.length > 0 : false);
      return false;
    });

    const totalLangPoints = formData.langages.reduce(
      (sum, l) => sum + (l.points || 0),
      0
    );
    
    if (totalLangPoints > formData.langagesPoints) {
      errors.totalPoints = [
        ...(errors.totalPoints || []),
        "La somme des points des langues dépasse le maximum"
      ];
    }

    if (langErrors.length > 0) errors.langages = langErrors;

    setFieldErrors(errors);

    return !hasErrors;
  };

  return {
    formData,
    fieldErrors,

    handleFieldChange,
    updateLevelEducation,
    initializeLevels,

    updateExperience,
    addExperience,
    removeExperience,

    updateLangage,
    addLangage,
    removeLangage,

    validate,
    handleReset
  };
};

export default useSaveCriteria;