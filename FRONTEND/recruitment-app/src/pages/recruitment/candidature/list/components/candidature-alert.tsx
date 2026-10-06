import React from "react";
import Alert from "@/components/alert";

interface CandidatureAlertProps {
  alert: {
    isOpen: boolean;
    type: "info" | "success" | "error" | "warning";
    message: string;
  };
  onClose: () => void;
}

const CandidatureAlert: React.FC<CandidatureAlertProps> = ({ alert, onClose }) => {
  if (!alert.isOpen) return null;
  return <Alert type={alert.type} message={alert.message} isOpen={alert.isOpen} onClose={onClose} />;
};

export default CandidatureAlert;
