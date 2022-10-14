// ** React Imports
import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Third Party Components
import Chart from "react-apexcharts"

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Spinner,
  ButtonGroup,
  Button,
} from "reactstrap"

const NovosCad = (props) => {
  // ** State
  const [vDados, setDados] = useState(null)
  const [vPeriodo, setPeriodo] = useState("mes")
  const [vProcessando, setProcessando] = useState(true)
  const [vOptions, setOptions] = useState(null)
  const [vSeries, setSeries] = useState(null)

  const getDados = (p) => {
    setProcessando(true)
    setPeriodo(p)
    return api
      .get(`/usuario/cadastro_comparativo/${p}`)
      .then((res) => {
        setProcessando(false)
        setDados(res.data)
        setOptions({
          chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            type: "line",
            offsetX: -10,
          },
          stroke: {
            curve: "smooth",
            dashArray: [12, 0],
            width: [3, 4],
          },
          legend: {
            show: false,
          },
          colors: ["#ebe9f1", "#d0ccff"],
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              inverseColors: false,
              gradientToColors: ["#ebe9f1", props.primary],
              shadeIntensity: 1,
              type: "horizontal",
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100, 100, 100],
            },
          },
          markers: {
            size: 0,
            hover: {
              size: 5,
            },
          },
          xaxis: {
            labels: {
              style: {
                colors: "#b9b9c3",
                fontSize: "1rem",
              },
            },
            axisTicks: {
              show: false,
            },
            categories: res.data[0]?.dados?.map(({ label }) => label),
            axisBorder: {
              show: false,
            },
            tickPlacement: "on",
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: "#b9b9c3",
                fontSize: "1rem",
              },
              formatter(val) {
                return val > 999 ? `${(val / 1000).toFixed(0)}k` : val
              },
            },
          },
          grid: {
            borderColor: "#e7eef7",
            padding: {
              top: -20,
              bottom: -10,
              left: 20,
            },
          },
          tooltip: {
            x: { show: false },
          },
        })
        setSeries(
          res.data.length > 0
            ? res.data?.map(({ nome, dados }) => ({
                name: nome,
                data: dados?.map(({ value }) => value),
              }))
            : []
        )
      })
      .catch(() => {
        setDados(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista

    getDados("ano")
  }, [])

  const renderTitulo = () => {
    return vDados?.map(({ nome, total }) => {
      return (
        <div className="me-2" key={nome}>
          <CardText className="mb-50">{nome}</CardText>
          <h3 className="fw-bolder">
            <span className="text-primary">{total}</span>
          </h3>
        </div>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Novos cadastros</CardTitle>
        <ButtonGroup>
          <Button
            color="primary"
            onClick={() => getDados("mes")}
            active={vPeriodo === "mes"}
            outline
          >
            Mensal
          </Button>
          <Button
            color="primary"
            onClick={() => getDados("ano")}
            active={vPeriodo === "ano"}
            outline
          >
            Anual
          </Button>
        </ButtonGroup>
      </CardHeader>

      <CardBody>
        <div className="d-flex justify-content-start mb-2">
          {renderTitulo()}
        </div>
        {!vProcessando ? (
          <Chart options={vOptions} series={vSeries} type="line" height={195} />
        ) : (
          <div className="d-flex justify-content-center text-center align-items-center h-100">
            <Spinner type="grow" size="md" color="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
export default NovosCad
