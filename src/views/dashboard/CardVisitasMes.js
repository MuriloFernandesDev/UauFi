// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import Chart from "react-apexcharts"
import { UserCheck } from "react-feather"

// ** React Imports
import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Spinner } from "reactstrap"

const CardVisitasMes = () => {
  // ** State
  const [vProcessando, setProcessando] = useState(true)
  const [vSeries, setSeries] = useState(null)

  const vOptions = {
    chart: {
      id: "CardVisitasMes",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },
    colors: ["#28c76f"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100],
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      x: { show: false },
    },
  }

  const getDados = () => {
    setProcessando(true)
    return api
      .get("/usuario/visita_mes")
      .then((res) => {
        setSeries([
          {
            name: "Visitas",
            data: res.data?.map(({ value }) => value) ?? [],
          },
        ])
        setProcessando(false)
      })
      .catch(() => {
        setSeries([])
        //setDados(null)
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
        <div>
          <CardTitle tag="h4">Visitas mensais</CardTitle>
        </div>
        <Avatar
          className="avatar-stats p-50 m-0"
          color="light-success"
          icon={<UserCheck size={21} />}
        />
      </CardHeader>
      {!vProcessando ? (
        vOptions && vSeries ? (
          <Chart options={vOptions} series={vSeries} type="area" height={100} />
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
