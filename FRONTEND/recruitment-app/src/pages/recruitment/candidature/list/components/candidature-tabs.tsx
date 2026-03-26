import React, { useMemo } from "react";

export type TabKey = "all" | "preselected";

interface CandidatureTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  canViewPreselected?: boolean;
}

const CandidatureTabs: React.FC<CandidatureTabsProps> = ({ activeTab, onTabChange, 
  canViewPreselected = false}) => {
  const tabs = useMemo(() => [
    { key: "all" as TabKey, label: "Toutes les candidatures" },
    ...(canViewPreselected ? [{ key: "preselected" as TabKey, label: "Présélectionnées" }] : [])
  ], [canViewPreselected]);

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

export default CandidatureTabs;
