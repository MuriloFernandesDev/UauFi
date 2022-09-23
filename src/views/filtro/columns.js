// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { deleteFiltro } from "./store"

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap"

// ** Third Party Components
import { Eye, Copy, Trash, MoreVertical } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

// ** renders filter column
const renderFiltro = (row) => {
  return (
    <Avatar
      color="light-primary"
      className="me-50"
      content={row.nome ? row.nome : ""}
      initials
    />
  )
}

// ** Modal de exclusão de filtro

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
      store.dispatch(deleteFiltro(row.id))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "O filtro foi removido.",
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
    name: "Filtro",
    minWidth: "450px",
    // selector: row => row.filtro.name,
    cell: (row) => {
      const nome = row.nome ? row.nome : "",
        idadeInicial = row.idade_inicial ? row.idade_inicial : "",
        idadeFinal = row.idade_final ? row.idade_final : ""
      const filtroInfo = `${idadeInicial} a ${idadeFinal} anos`
      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderFiltro(row)}
          <div className="d-flex flex-column">
            <Link to={`/filtro/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">{nome}</h6>
              <small className="text-truncate text-muted mb-0">
                {filtroInfo}
              </small>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: <div className="text-end w-100">Data de criação</div>,
    minWidth: "80px",
    cell: (row) => {
      const dataCriacao = row.data_criacao ? row.data_criacao : ""
      return (
        <div className="text-end w-100">
          <div className="d-inline-flex flex-column">
            <Link to={`/filtro/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">
                {`${dataCriacao.substring(8, 10)}/${dataCriacao.substring(
                  5,
                  7
                )}/${dataCriacao.substring(0, 4)} - ${dataCriacao.substring(
                  11,
                  16
                )}`}
              </h6>
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
          <Link to={`/filtro/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Eye size={17} className="mx-1" />
          </Link>
          <UncontrolledTooltip placement="top" target={`pw-tooltip-${row.id}`}>
            Visualizar
          </UncontrolledTooltip>

          <UncontrolledDropdown direction="start">
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
