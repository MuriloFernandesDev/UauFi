// ** React Imports
import { useEffect, useState } from "react"

// ** Reactstrap Imports
import {
  UncontrolledTooltip,
  Badge,
  Spinner,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"

// ** Icons Imports
import { PieChart, ChevronDown, Download } from "react-feather"

import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"

// ** Charts
import PesquisaDados from "./PesquisaDados"

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss"

import { formatDateTime, formatInt } from "@utils"

// ** API
import api from "@src/services/api"

const RelatorioPesquisa = () => {
  const vDefault = [{ nome: "", valor: 0, qtd: 0, percentual: 0 }]
  const vParametrosGet = { sortColumn: "data_cadastro", sort: "desc" }
  // ** States
  const [vDados, setDados] = useState(vDefault)
  const [vCarregando, setCarregando] = useState(true)

  const [vModalQrCode, setModalQrCode] = useState(false)

  const toggleModal = (id) => {
    if (vModalQrCode !== id) {
      setModalQrCode(id)
    } else {
      setModalQrCode(null)
    }
  }

  const getLista = () => {
    setCarregando(true)
    return api
      .get("/pesquisa_captive/lista", { params: vParametrosGet })
      .then((res) => {
        setDados(res.data)
        setCarregando(false)
      })
      .catch(() => {
        setCarregando(false)
      })
  }

  // ** Table columns
  const columns = [
    {
      name: "Pergunta",
      minWidth: "400px",
      sortable: true,
      selector: (row) => row.nome,
      cell: (row) => {
        return (
          <div className="d-flex w-100 justify-content-left align-items-center">
            <Link
              className="d-flex w-100 flex-column"
              to={`/pesquisa_captive/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <h6 className="user-name mb-0">{row.nome}</h6>
            </Link>
          </div>
        )
      },
    },
    {
      name: "Data cadastro",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.data_cadastro,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center">
            <Link
              className="d-flex flex-column"
              to={`/pesquisa_captive/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <span className="text-secondary user-name mb-0">
                {formatDateTime(row.data_cadastro)}
              </span>
            </Link>
          </div>
        )
      },
    },
    {
      name: <div className="text-center w-100 ps-2">Respostas</div>,
      minWidth: "80px",
      sortable: true,
      selector: (row) => row.qtd_respostas,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center text-center w-100">
            <Link
              className="d-flex flex-column w-100"
              to={`/pesquisa_captive/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <div className="text-secondary user-name mb-0">
                {formatInt(row.qtd_respostas)}
              </div>
            </Link>
          </div>
        )
      },
    },
    {
      name: <div className="text-end w-100">Ações</div>,
      minWidth: "80px",
      cell: (row) => (
        <div className="text-end w-100">
          <div className="column-action d-inline-flex">
            <Modal
              key={row.id}
              isOpen={vModalQrCode === row.id}
              toggle={() => toggleModal(row.id)}
              className="modal-dialog-centered"
            >
              <ModalHeader toggle={() => toggleModal(row.id)}>
                {row.nome}
              </ModalHeader>
              <ModalBody className="text-center">
                <PesquisaDados id={row.id} />
              </ModalBody>
            </Modal>
            <Link
              to="/"
              id={`pw-grafico-${row.id}`}
              onClick={(e) => {
                e.preventDefault()
                toggleModal(row.id)
              }}
            >
              <PieChart size={17} className="mx-1" />
            </Link>

            <UncontrolledTooltip
              placement="top"
              target={`pw-grafico-${row.id}`}
            >
              Visualizar o gráfico
            </UncontrolledTooltip>
            <Link
              to={`/pesquisa_captive/${row.id}`}
              id={`pw-tooltip-export-${row.id}`}
            >
              <Download size={17} className="mx-1" />
            </Link>

            <UncontrolledTooltip
              placement="top"
              target={`pw-tooltip-export-${row.id}`}
            >
              Exportar usuários e respostas
            </UncontrolledTooltip>
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    // ** Requisitar listas

    getLista()
  }, [])

  return vCarregando ? (
    <div className="text-center">
      <Spinner color="primary" />
    </div>
  ) : (
    <Card>
      <CardBody>
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={vDados}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
        />
      </CardBody>
    </Card>
  )
}

export default RelatorioPesquisa
