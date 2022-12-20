// ** Third Party Components
import { Bar } from "react-chartjs-2"

// ** Reactstrap Imports
import { Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

// ** Utils
import { formatInt, formatMoeda, formatDateTime } from "@utils"
import { Fragment } from "react"
import DataTable from "react-data-table-component"
import { ChevronDown } from "react-feather"

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss"

const PesquisaDados = (dados) => {
  const labelColor = "#6e6b7b",
    gridLineColor = "rgba(200, 200, 200, 0.2)",
    success = "#28dac6"

  // ** Hooks
  const { t } = useTranslation()

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor,
        },
        ticks: {
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  // ** Chart data
  const data = {
    labels: dados.valores?.map(({ nome }) => nome),
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: success,
        borderColor: "transparent",
        borderRadius: { topRight: 15, topLeft: 15 },
        data: dados.valores?.map(({ qtd }) => qtd),
      },
    ],
  }

  // ** Table columns
  const columns = [
    {
      name: "Nome",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.nome,
      cell: (row) => {
        return (
          <div className="d-flex w-100 justify-content-left align-items-center">
            <Link
              className="d-flex w-100 flex-column"
              to={`/campanha_${dados.tipo}/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <h6 className="user-name text-truncate mb-0">{row.nome}</h6>
              <small className="text-truncate text-muted mb-0">
                {row.cliente ?? ""}
              </small>
              <small className="text-truncate text-muted mb-0">
                {row.tipo ?? ""}
              </small>
            </Link>
          </div>
        )
      },
    },
    {
      name: "Mensagem",
      minWidth: "450px",
      sortable: true,
      selector: (row) => row.mensagem,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center">
            <Link
              className="d-flex flex-column"
              to={`/campanha_${dados.tipo}/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <span className="text-secondary user-name mb-0">
                {row.mensagem}
              </span>
            </Link>
          </div>
        )
      },
    },
    {
      name: <div className="text-center w-100 ps-2">Envios</div>,
      minWidth: "100px",
      sortable: true,
      selector: (row) => row.qtd,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center text-center w-100">
            <Link
              className="d-flex flex-column w-100"
              to={`/campanha_${dados.tipo}/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <div className="text-secondary user-name mb-0">
                {formatInt(row.qtd)}
              </div>
              <div className="text-secondary user-name mb-0">
                {formatDateTime(row.data_envio)}
              </div>
            </Link>
          </div>
        )
      },
    },
    {
      name: <div className="text-end w-100">Valor</div>,
      minWidth: "100px",
      sortable: true,
      selector: (row) => row.valor,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center w-100 text-end pe-2">
            <Link
              className="d-flex flex-column w-100"
              to={`/campanha_${dados.tipo}/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <span className="text-secondary user-name mb-0">
                {formatMoeda(row.valor)}
              </span>
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <Fragment>
      <Card>
        <CardBody>
          {dados?.valores?.length > 0 ? (
            <div style={{ height: "400px" }}>
              <Bar data={data} options={options} height={400} />
            </div>
          ) : (
            <h6 className="text-center">{t("Vazio")}</h6>
          )}
        </CardBody>
      </Card>
      {dados?.valores?.length > 0 ? (
        <Card>
          <CardBody>
            <DataTable
              noHeader
              responsive
              columns={columns}
              data={dados.valores}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
            />
          </CardBody>
        </Card>
      ) : null}
    </Fragment>
  )
}

export default PesquisaDados
