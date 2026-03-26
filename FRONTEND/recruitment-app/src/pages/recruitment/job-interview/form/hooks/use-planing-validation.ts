import { useCallback, useState } from "react";
import {
  parseISO,
  isBefore,
  isEqual,
  setHours,
  setMinutes,
  isAfter
} from "date-fns";

interface FormData {
  interviewDate: string;
  interviewTime: string;
}

type Errors = {
  interviewDate?: string[];
  interviewTime?: string[];
};

export const usePlaningValidation = () => {
  const [errors, setErrors] = useState<Errors>({});

  const validate = (data: FormData): boolean => {
    const newErrors: Errors = {};

    // ✅ champs obligatoires
    if (!data.interviewDate) {
      newErrors.interviewDate = ["La date est obligatoire"];
    }

    if (!data.interviewTime) {
      newErrors.interviewTime = ["L'heure est obligatoire"];
    }

    // ✅ validation complète
    if (data.interviewDate && data.interviewTime) {
      const dateTime = parseISO(
        `${data.interviewDate}T${data.interviewTime}`
      );

      const now = new Date();

      // 🚫 passé
      if (isBefore(dateTime, now) || isEqual(dateTime, now)) {
        newErrors.interviewDate = [
          ...(newErrors.interviewDate || []),
          "La date doit être dans le futur"
        ];
      }

      // 🕐 plage horaire 08:00 → 17:00
      const start = setMinutes(setHours(dateTime, 8), 0);
      const end = setMinutes(setHours(dateTime, 17), 0);

      if (isBefore(dateTime, start) || isAfter(dateTime, end)) {
        newErrors.interviewTime = [
          ...(newErrors.interviewTime || []),
          "L'heure doit être entre 08:00 et 17:00"
        ];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    handleReset
  };
};
