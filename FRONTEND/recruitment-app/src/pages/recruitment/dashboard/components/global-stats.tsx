import { useGetGlobalStats } from "@/api/recruitment/dashboard/service";
import colors from "./colors";

interface Props {
  direction?: string;
}

const GlobalStats: React.FC<Props> = ({ direction }) => {
// HOOKS
    const { data, isLoading, isError } = useGetGlobalStats(direction);

    if (isLoading) {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i}
                        style={{
                            background: "#eee",
                            height: "75px",
                            borderRadius: 10,
                            animation: "pulse 1.5s infinite",
                        }}
                    />
                ))}
            </div>
        );
    }

// ERROR STATE
    if (isError || !data) {
        return <p>Erreur lors du chargement des statistiques</p>;
    }

// DATA
    const stats = [
        { label: "Demandes", value: data.totalRequests },
        { label: "Durée moyenne des processus", value: `${data.averageDay ?? 0}j` },
        { label: "Candidatures traitées", value: data.treatedCandidatures },
        { label: "Présélectionnés", value: data.preselectedCandidatures },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
            }}
        >
            {stats.map((s, i) => (
                <div
                    key={i}
                    style={{
                        background: "white",
                        padding: "12px 16px",
                        borderRadius: 10,
                        borderLeft: `5px solid ${colors[i]}`,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        height: "75px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <h4 style={{ margin: 0, fontSize: 14, color: "#555" }}>
                        {s.label}
                    </h4>
                    <h2 style={{ margin: 0, fontSize: 22 }}>
                        {s.value}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default GlobalStats;
