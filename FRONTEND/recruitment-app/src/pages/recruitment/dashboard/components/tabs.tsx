import type { TabType } from "..";

const Tabs: React.FC<{
  tab: string;
  setTab: (t: "demandes" | "candidatures") => void;
}> = ({ tab, setTab }) => {
  return (
    <div style={{ display: "flex", marginTop: 20, gap: 10 }}>
      {["demandes", "candidatures"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t as TabType)}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: tab === t ? "var(--primary-color)" : "white",
            color: tab === t ? "white" : "#333",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {t === "demandes" ? "Demandes" : "Candidatures"}
        </button>
      ))}
    </div>
  );
};

export default Tabs;