// ** Third Party Components
import { Doughnut } from "react-chartjs-2"

// ** React Imports
import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Spinner } from "reactstrap"
import { Tablet } from "react-feather"

const CardGeneros = (props) => {
  // ** Props
  const { tooltipShadow } = props

  // ** State
  const [vProcessando, setProcessando] = useState(true)
  const [vSeries, setSeries] = useState(null)
  const [vDados, setDados] = useState(null)

  // ** Chart Options
  const vOptions = {
    maintainAspectRatio: false,
    cutout: 60,
    animation: {
      resize: {
        duration: 500,
      },
    },
    plugins: {
      legend: { display: false },
      tooltips: {
        callbacks: {
          label(context) {
            const label = context.label || ""
            return label
          },
        },
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: tooltipShadow,
        backgroundColor: "#fff",
        titleFontColor: "#000",
        bodyFontColor: "#000",
      },
    },
  }

  const getDados = () => {
    setProcessando(true)
    return api
      .get("/usuario/visita_genero")
      .then((res) => {
        setDados(res.data)
        setSeries({
          labels: ["Masculino", "Feminino", "Outro"],
          datasets: [
            {
              borderWidth: 0,
              label: "Pessoas",
              data: [res.data.male, res.data.female, res.data.other],
              backgroundColor: ["#0066CC", "#FF33BB", "#FF8000"],
              borderWidth: 0,
              pointStyle: "rectRounded",
            },
          ],
        })
        setProcessando(false)
      })
      .catch(() => {
        setSeries(null)
        setDados(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column">
        <h5>Usuários por gênero</h5>
      </CardHeader>
      <CardBody>
        <div style={{ height: "275px" }}>
          {!vProcessando ? (
            vOptions && vSeries ? (
              <Doughnut data={vSeries} options={vOptions} height={275} />
            ) : null
          ) : (
            <div className="d-flex justify-content-center text-center align-items-center h-100">
              <Spinner type="grow" size="md" color="primary" />
            </div>
          )}
        </div>
        {!vProcessando ? (
          <div>
            <div className="d-flex justify-content-between mt-2 mb-1">
              <div className="d-flex align-items-center">
                <Tablet size={17} className="text-primary" />
                <span className="fw-bold ms-75 me-25">Masculino</span>
              </div>
              <div>
                <span>{vDados?.male}%</span>
              </div>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <div className="d-flex align-items-center">
                <Tablet size={17} className="text-danger" />
                <span className="fw-bold ms-75 me-25">Feminino</span>
              </div>
              <div>
                <span>{vDados?.female}%</span>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <Tablet size={17} className="text-warning" />
                <span className="fw-bold ms-75 me-25">Outro</span>
              </div>
              <div>
                <span>{vDados?.other}%</span>
              </div>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default CardGeneros
