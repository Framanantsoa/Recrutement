import { Line } from "react-chartjs-2";
import { useGetCandidaturesPerMonth } from "@/api/recruitment/dashboard/service";

interface Props {
    year: number;
    direction?: string;
}

const CandidaturesPerMonth: React.FC<Props> = ({ year, direction }) => {
// HOOKS
    const { data, isLoading, isError } = useGetCandidaturesPerMonth(direction, year);

    if (isLoading) {
        return (
            <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
                Chargement...
            </div>
        );
    }
    if (isError || !data) {
        return (
            <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
                Erreur de chargement
            </div>
        );
    }

// mois abrégés
    const monthNames = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];

// données dynamiques
    const labels = data.map(d => monthNames[d.month - 1]);
    const values = data.map(d => d.count);

    const chartData = {
        labels,
        datasets: [{
            label: `Candidatures (${year})`,
            data: values,
            borderColor: "#3498db",
            backgroundColor: "rgba(52,152,219,0.2)",
            tension: 0.3,
            fill: true,
        }],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                min: 0,
                ticks: { stepSize: 50 },
            },
        },
    };

    return (
        <div style={{ height: 380, width: "100%" }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default CandidaturesPerMonth;
