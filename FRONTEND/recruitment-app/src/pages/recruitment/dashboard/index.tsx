import React, { useState } from "react";
import GlobalStats from "./components/global-stats";
import Tabs from "./components/tabs";
import Card from "./components/card";
import RequestsPerDirection from "./components/requests-per-direction";
import RequestsPerStatus from "./components/requests-per-status";
import YearFilter from "./components/year-filter";
import CandidaturesPerMonth from "./components/candidatures-per-month";

export type TabType = "demandes" | "candidatures";

const Dashboard: React.FC = () => {
  const yearNow = new Date().getFullYear();

  const [tab, setTab] = useState<TabType>("demandes");
  const [year, setYear] = useState(yearNow);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const direction = user?.department?.toUpperCase();

  return (
    <div style={{ padding: 16, background: "#f5f6fa", minHeight: "100vh" }}>
      <h2>Dashboard</h2>

      <GlobalStats direction={direction} />

      <Tabs tab={tab} setTab={setTab} />

      {tab === "demandes" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          <Card title="Demandes par direction">
            <RequestsPerDirection />
          </Card>

          <Card title="Statut des demandes">
            <RequestsPerStatus direction={direction} />
          </Card>
        </div>
      )}

      {tab === "candidatures" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
            marginTop: 20,
          }}
        >
          {/* filtre full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <YearFilter yearNow={yearNow} year={year} setYear={setYear} />
          </div>

          {/* graphe full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Card title="Candidatures par mois">
              <CandidaturesPerMonth year={year} direction={direction} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
