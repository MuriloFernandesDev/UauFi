import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Third Party Components
import Chart from "react-apexcharts"

import { useTranslation } from "react-i18next"

// ** Utils
import { formatInt } from "@utils"
import { Spinner } from "reactstrap"

const PesquisaDados = (dados) => {
  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setDados] = useState(null)
  const [vProcessando, setProcessando] = useState(true)
  const [vOptions, setOptions] = useState(null)

  const vID = dados.id

  const getDados = () => {
    setProcessando(true)
    //return
    return api
      .get(`/pesquisa_captive/grafico/${vID}`)
      .then((res) => {
        setProcessando(false)
        setDados(res.data)
        setOptions({
          legend: {
            show: true,
            position: "bottom",
          },
          labels: res.data?.map(({ texto }) => texto),

          dataLabels: {
            enabled: true,
            formatter(val) {
              return `${parseInt(val)}%`
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "2rem",
                    fontFamily: "Montserrat",
                  },
                  value: {
                    fontSize: "1rem",
                    fontFamily: "Montserrat",
                    formatter(val) {
                      return `${parseInt(val)}%`
                    },
                  },
                  total: {
                    show: true,
                    fontSize: "1.5rem",
                    label: res.data[0].texto ?? "",
                    formatter() {
                      return `${formatInt(res.data[0].perc)}%`
                    },
                  },
                },
              },
            },
          },
        })
      })
      .catch(() => {
        setDados(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  return !vProcessando ? (
    vDados?.length > 0 ? (
      <Chart
        options={vOptions}
        series={vDados?.map(({ perc }) => perc)}
        type="donut"
        height={400}
      />
    ) : (
      <h6 className="text-center">{t("Vazio")}</h6>
    )
  ) : (
    <Spinner type="grow" size="md" color="primary" />
  )
}

export default PesquisaDados
