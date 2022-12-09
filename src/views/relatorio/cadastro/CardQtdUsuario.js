// ** React Imports
import { useState } from "react"

import { useTranslation } from "react-i18next"

// ** Terceiros
import Select from "react-select"

// ** Third Party Components
import Chart from "react-apexcharts"

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, Spinner } from "reactstrap"

const CardNovosCad = (props) => {
  // ** Hooks
  const { t } = useTranslation()

  // ** State
  const vPeriodoArray = [
    { label: "Por hora", value: "hour" },
    { label: "Por dia", value: "day" },
    { label: "Por dia da semana", value: "week" },
    { label: "Por mês", value: "month" },
    { label: "Por ano", value: "year" },
  ]

  const [vPeriodo, setPeriodo] = useState(vPeriodoArray[1])
  const vOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      type: "line",
      offsetX: -10,
    },
    stroke: {
      curve: "smooth",
      width: [4],
    },

    colors: ["#d0ccff"],
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
          fontSize: "0.8rem",
        },
      },
      axisTicks: {
        show: false,
      },
      categories: props.dados?.map(({ label }) => label),
      axisBorder: {
        show: false,
      },
      tickPlacement: "on",
      tickAmount: 10,
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: "#b9b9c3",
          fontSize: "0.8rem",
        },
        show: true,
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
  }

  const vSeries = [
    {
      name: "",
      data:
        props.dados?.length > 0 ? props.dados?.map(({ value }) => value) : [],
    },
  ]

  return (
    <Card>
      <CardHeader className="pt-1 pe-1 pb-0">
        <h5>{props.titulo}</h5>
        {!props.selectOculto ? (
          <div style={{ width: "200px" }}>
            <Select
              noOptionsMessage={() => t("Vazio")}
              placeholder={""}
              className="react-select"
              classNamePrefix="select"
              value={vPeriodo}
              onChange={(e) => {
                setPeriodo(e)
                props.getdados(e.value)
              }}
              options={vPeriodoArray}
            />
          </div>
        ) : null}
      </CardHeader>

      <CardBody>
        <div style={{ height: "300px" }}>
          {!props.proc ? (
            vOptions && vSeries ? (
              <Chart
                options={vOptions}
                series={vSeries}
                type="line"
                height={300}
              />
            ) : null
          ) : (
            <div className="d-flex justify-content-center text-center align-items-center h-100 text-center w-100">
              <Spinner type="grow" size="md" color="primary" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
export default CardNovosCad
