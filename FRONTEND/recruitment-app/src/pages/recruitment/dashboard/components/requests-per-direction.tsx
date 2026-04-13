import { Bar } from "react-chartjs-2";
import colors from "./colors";
import { useGetRequestsPerDirection } from "@/api/recruitment/dashboard/service";

const RequestsPerDirection: React.FC = () => {
  const { data, isLoading, isError } = useGetRequestsPerDirection();

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

// TRI ALPHABÉTIQUE
  const sortedData = [...data].sort((a, b) =>
    a.direction.localeCompare(b.direction)
  );

// Transformation API → Chart.js
  const labels = sortedData.map((item) => item.direction);
  const values = sortedData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Demandes",
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
      },
    ],
  };

  return (
    <div style={{ height: 250 }}>
      <Bar
        data={chartData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
};

export default RequestsPerDirection;
