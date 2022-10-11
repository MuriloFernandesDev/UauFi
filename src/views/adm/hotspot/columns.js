// ** React Imports
import { Link } from "react-router-dom"

// ** Utils
import { formatDateTime } from "@utils"

// ** Store & Actions
import { store } from "@store/store"
import { cloneHotspot, deleteHotspot } from "./store"

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Badge,
} from "reactstrap"

// ** Third Party Components
import { Eye, Copy, Trash, MoreVertical } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

// ** Modal de exclusão de Hotspot

const handleDeleteConfirmation = (row) => {
  return MySwal.fire({
    title: "Tem certeza?",
    text: "Sua ação não poderá ser revertida!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, remover!",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-outline-danger ms-1",
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
    buttonsStyling: false,
  }).then(function (result) {
    if (result.value) {
      store.dispatch(deleteHotspot(row.id))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "O Hotspot foi removido.",
        customClass: {
          confirmButton: "btn btn-success",
          popup: "animate__animated animate__fadeIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      })
    }
  })
}

// ** Modal de clonagem de Hotspot

const handleClone = (row) => {
  MySwal.fire({
    title: "Copiar cadastro de Hotspot",
    text: "Quantas cópias deseja fazer?",
    input: "number",
    icon: "warning",
    inputAttributes: {
      min: 1,
    },
    customClass: {
      input: "mx-3",
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-danger ms-1",
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
    buttonsStyling: false,
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Copiar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      return new Promise((resolve) => {
        const numberValue = Number(value)
        if (numberValue <= 0 || numberValue > 50) {
          resolve("Digite um número entre 1 e 50.")
        } else if (numberValue % 1 !== 0) {
          resolve("Digite um número inteiro.")
        } else {
          resolve()
        }
      })
    },
  }).then(function (result) {
    const cloneParams = [row.id, result.value]
    let adaptedSentence
    if (Number(result.value) === 1) {
      adaptedSentence = `${result.value} cópia do Hotspot foi gerada.`
    } else {
      adaptedSentence = `${result.value} cópias do Hotspot foram geradas.`
    }
    if (result.value) {
      store.dispatch(cloneHotspot(cloneParams))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: adaptedSentence,
        customClass: {
          confirmButton: "btn btn-success",
          popup: "animate__animated animate__fadeIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      })
    }
  })
}

// ** Table columns
export const columns = [
  {
    name: "ID",
    sortable: true,
    maxWidth: "110px",
    minWidth: "110px",
    sortField: "id",
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link to={`/adm/hotspot/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">{row.id}</h6>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: "Nome",
    sortable: true,
    minWidth: "450px",
    sortField: "nome",
    cell: (row) => {
      const nome = row.nome ?? ""

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link to={`/adm/hotspot/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">{nome}</h6>
              <strong className="text-truncate text-muted mb-0">
                {row.mac}
              </strong>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: "Última comunicação",
    minWidth: "200px",
    sortField: "data_recebido",
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link to={`/adm/hotspot/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">
                {formatDateTime(row.data_recebido)}
              </h6>
              <small className="text-truncate text-muted mb-0">
                {row.online ? (
                  <Badge color="success">Online</Badge>
                ) : (
                  <Badge color="danger">Offline</Badge>
                )}
              </small>
            </Link>
          </div>
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
          <Link to={`/adm/hotspot/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Eye size={17} className="mx-1" />
          </Link>

          <UncontrolledTooltip placement="top" target={`pw-tooltip-${row.id}`}>
            Visualizar
          </UncontrolledTooltip>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault()
                  handleDeleteConfirmation(row)
                }}
              >
                <Trash size={14} className="me-50" />
                <span className="align-middle">Remover</span>
              </DropdownItem>

              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  e.preventDefault()
                  handleClone(row)
                }}
              >
                <Copy size={14} className="me-50" />
                <span className="align-middle">Duplicar</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    ),
  },
]
