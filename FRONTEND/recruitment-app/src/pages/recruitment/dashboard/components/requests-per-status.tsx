import { Pie } from "react-chartjs-2";
import { useGetRequestsPerStatus } from "@/api/recruitment/dashboard/service";
import colors from "./colors";

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
  const backgroundColors = data.map((_, i) => colors[i % colors.length]);

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
