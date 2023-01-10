// ** Third Party Components
import { Bar } from "react-chartjs-2"

// ** Reactstrap Imports
import { Card, CardHeader, Spinner } from "reactstrap"

const CardFaixaEtaria = (props) => {
  // ** State
  const vSeries = {
    labels:
      props.dados?.length > 0 ? props.dados?.map(({ label }) => label) : [],
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: "#28dac6",
        borderColor: "transparent",
        borderRadius: { topRight: 15, topLeft: 15 },
        data:
          props.dados?.length > 0 ? props.dados?.map(({ value }) => value) : [],
      },
    ],
  }

  const vOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: { color: "#b4b7bd" },
      },
      y: {
        min: 0,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#b4b7bd",
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  return (
    <Card>
      <CardHeader className="align-items-start pb-0">
        <h5>{props.titulo}</h5>
      </CardHeader>
      <div style={{ height: "300px" }}>
        {!props.proc ? (
          vOptions && vSeries?.labels?.length > 0 ? (
            <Bar data={vSeries} options={vOptions} height={300} />
          ) : null
        ) : (
          <div className="d-flex justify-content-center text-center align-items-center m-2">
            <Spinner type="grow" size="md" color="primary" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default CardFaixaEtaria
