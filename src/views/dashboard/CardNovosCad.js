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

const CardNovosCad = (props) => {
  // ** State
  const [vPeriodo, setPeriodo] = useState("mes")
  const [vProcessando, setProcessando] = useState(true)
  const [vOptions, setOptions] = useState(null)
  const [vSeries, setSeries] = useState(null)

  const getDados = (p) => {
    setProcessando(true)
    setPeriodo(p)
    return api
      .get(`/usuario/cadastro_${p}`)
      .then((res) => {
        setProcessando(false)
        setOptions({
          chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            type: "line",
            offsetX: -10,
          },
          stroke: {
            curve: "smooth",
            dashArray: [0, 12],
            width: [4, 3],
          },
          legend: {
            show: false,
          },
          colors: ["#d0ccff", "#ebe9f1"],
          dataLabels: {
            enabled: true,
            formatter(val) {
              return new Intl.NumberFormat().format(val)
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              inverseColors: false,
              gradientToColors: [props.primary, "#ebe9f1"],
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
            categories: res.data?.map(({ label }) => label),
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
              show: false,
              formatter(val) {
                return new Intl.NumberFormat().format(val)
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
            custom() {
              return null
            },
          },
        })
        setSeries([
          {
            data:
              res.data.length > 0 ? res.data?.map(({ value }) => value) : [],
          },
        ])
      })
      .catch(() => {
        setSeries(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista

    getDados("mes")
  }, [])

  return (
    <Card>
      <CardHeader className="pt-1 pe-1 pb-0">
        <h5>Novos cadastros</h5>
        <ButtonGroup>
          <Button
            color="primary"
            onClick={() => getDados("dia")}
            active={vPeriodo === "dia"}
            outline
          >
            Diário
          </Button>
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
        <div className="d-flex justify-content-start mb-0">
          <CardText className="mb-50">
            Últimos{" "}
            {vPeriodo === "mes"
              ? "12 meses"
              : vPeriodo === "dia"
              ? "30 dias"
              : "10 anos"}
          </CardText>
        </div>
        {!vProcessando ? (
          vOptions && vSeries ? (
            <Chart
              options={vOptions}
              series={vSeries}
              type="line"
              height={230}
            />
          ) : null
        ) : (
          <div className="d-flex justify-content-center text-center align-items-center h-100">
            <Spinner type="grow" size="md" color="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
export default CardNovosCad
