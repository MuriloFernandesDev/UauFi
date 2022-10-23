// ** Third Party Components
import { Bar } from "react-chartjs-2"

// ** React Imports
import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Reactstrap Imports
import { Card, CardHeader, Spinner } from "reactstrap"

const CardVisitasMes = () => {
  // ** State
  const [vProcessando, setProcessando] = useState(true)
  const [vSeries, setSeries] = useState(null)

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

  const getDados = () => {
    setProcessando(true)
    return api
      .get("/usuario/visita_idade")
      .then((res) => {
        setProcessando(false)
        setSeries({
          labels:
            res.data.length > 0 ? res.data?.map(({ label }) => label) : [],
          datasets: [
            {
              maxBarThickness: 15,
              backgroundColor: "#28dac6",
              borderColor: "transparent",
              borderRadius: { topRight: 15, topLeft: 15 },
              data:
                res.data.length > 0 ? res.data?.map(({ value }) => value) : [],
            },
          ],
        })
      })
      .catch(() => {
        setSeries(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  return (
    <Card>
      <CardHeader className="align-items-start pb-0">
        <h5>Visitas por faixa etária</h5>
      </CardHeader>
      {!vProcessando ? (
        vOptions && vSeries?.labels?.length > 0 ? (
          <div style={{ height: "100px" }}>
            <Bar data={vSeries} options={vOptions} height={100} />
          </div>
        ) : null
      ) : (
        <div className="d-flex justify-content-center text-center align-items-center h-100 m-3">
          <Spinner type="grow" size="md" color="primary" />
        </div>
      )}
    </Card>
  )
}

export default CardVisitasMes
