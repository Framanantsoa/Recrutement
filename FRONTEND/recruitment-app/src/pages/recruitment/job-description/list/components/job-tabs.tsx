import React, { useMemo } from "react";

export type JobTabKey = "mes" | "tous";

interface JobTabsProps {
  activeTab: JobTabKey;
  onTabChange: (tab: JobTabKey) => void;
  canViewJobDescriptions?: boolean;
}

const JobTabs: React.FC<JobTabsProps> = ({ activeTab, onTabChange, 
  canViewJobDescriptions = false }) => {
  const tabs = useMemo(() => [
    {key: "mes", label:"Ma direction"},
    ...(canViewJobDescriptions ? [{ key: "tous" as JobTabKey, label: "Tous" }] : []),
  ], [canViewJobDescriptions]);

  return (
    <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key as JobTabKey)}
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

export default JobTabs;
