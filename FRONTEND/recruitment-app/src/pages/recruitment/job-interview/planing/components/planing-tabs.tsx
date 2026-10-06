import React, { useMemo } from "react";

export type TabValidationKey = "draft" | "planing";

interface PlaningTabsProps {
  activeTab: TabValidationKey;
  onTabChange: (tab: TabValidationKey) => void;
}

const PlaningTabs: React.FC<PlaningTabsProps> = ({ 
  activeTab, 
  onTabChange, 
}) => {
  const tabs = useMemo(() => [
    { key: "draft" as TabValidationKey, label: "Planifications" },
    { key: "planing" as TabValidationKey, label: "Entretiens" },
  ], []);

  return (
    <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: "8px 16px",
            background: tab.key === activeTab ? "var(--text-light)" : "#f0f0f0",
            color: tab.key === activeTab ? "#fff" : "#000",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PlaningTabs;
