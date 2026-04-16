import { Pie } from "react-chartjs-2";
import { useGetRequestsPerStatus } from "@/api/recruitment/dashboard/service";
// import colors from "./colors";

const statusColors: Record<string, string> = {
  "En cours": "#3498db",
  "En attente": "#e67e22",
  "Refusée": "#e74c3c",
  "Validée": "#2ecc71",
};

interface Props {
  direction?: string;
}

const RequestsPerStatus: React.FC<Props> = ({ direction }) => {
  const { data, isLoading, isError } = useGetRequestsPerStatus(direction);

  // LOADING
  if (isLoading) {
    return (
      <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  // ERROR
  if (isError || !data) {
    return (
      <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
        Erreur de chargement
      </div>
    );
  }

  // Transformation API → Chart.js
  const labels = data.map((item) => item.status);
  const values = data.map((item) => item.count);
  const backgroundColors = data.map((item) => 
    statusColors[item.status] || "#bdc3c7" // gris par défaut si inconnu
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
  };

  return (
    <div style={{ height: 250 }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default RequestsPerStatus;
