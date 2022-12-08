// ** React Imports
import { useState } from "react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { useTranslation } from "react-i18next"

// ** Terceiros
import Select from "react-select"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Spinner } from "reactstrap"

const SimpleAreaChart = (props) => {
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

  const CustomTooltip = (data) => {
    if (data.active && data.payload) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="fw-bold mb-0">{data.label}</p>
          <hr />
          <div className="active">
            {data.payload.map((i) => {
              return (
                <div className="d-flex align-items-center" key={i.dataKey}>
                  <span
                    className="bullet bullet-sm bullet-bordered me-50"
                    style={{
                      backgroundColor: i.fill,
                    }}
                  ></span>
                  <span className="text-capitalize me-75">
                    {i.dataKey === "male"
                      ? t("Masculino")
                      : i.dataKey === "female"
                      ? t("Feminino")
                      : t("Outro")}{" "}
                    : {i.payload[i.dataKey]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  const [vPeriodo, setPeriodo] = useState(vPeriodoArray[1])

  return (
    <Card>
      <CardHeader className="flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-sm-center align-items-start">
        <CardTitle tag="h4">{props.titulo}</CardTitle>
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
      </CardHeader>

      <CardBody>
        <div className="recharts-wrapper" style={{ height: "250px" }}>
          {!props.proc ? (
            props.dados?.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={props.dados}>
                  <CartesianGrid />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Area
                    dataKey="female"
                    stackId="female"
                    stroke="0"
                    fill="rgb(255, 0, 0)"
                  />
                  <Area
                    dataKey="male"
                    stackId="male"
                    stroke="0"
                    fill="rgba(0, 0, 255, .5)"
                  />
                  <Area
                    dataKey="other"
                    stackId="other"
                    stroke="0"
                    fill="rgba(205, 255, 0, .5)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : null
          ) : (
            <div className="d-flex justify-content-center text-center align-items-center h-100">
              <Spinner type="grow" size="md" color="primary" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
export default SimpleAreaChart
