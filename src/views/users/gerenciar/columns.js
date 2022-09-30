// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { deleteGerenciar } from "./store"

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
import { Eye, Trash, MoreVertical } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

// ** renders client column
const renderClient = (row) => {
  if (1 > 0) {
    return <Avatar className="me-50" img={row.logo} width="32" height="32" />
  } else {
    return (
      <Avatar
        color="light-primary"
        className="me-50"
        content={row.nome ? row.nome : ""}
        initials
      />
    )
  }
}

// ** Modal de exclusão de gerenciamento

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
      store.dispatch(deleteGerenciar(row.id))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "O gerenciamento foi removido.",
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
    name: "Nome",
    minWidth: "400px",
    sortable: true,
    selector: (row) => row.nome,
    cell: (row) => {
      const nome = "Noam Chomsky",
        gerenciarAtivo = "Conectado"

      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <Link
              to={`/usuario/gerenciar/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <h6 className="user-name text-truncate mb-0">{nome}</h6>
              <small className="text-truncate text-muted mb-0">
                <Badge color="success">{gerenciarAtivo}</Badge>
              </small>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: "Hotel",
    minWidth: "350px",
    sortable: true,
    selector: (row) => row.tipo_plano_id,
    cell: (row) => {
      const velocidadeDownload = "Ramada Hotel Aeroporto de Viracopos",
        velocidadeUpload = "RHVC"

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link
              to={`/usuario/gerenciar/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <h6 className="user-name text-truncate mb-0">
                {velocidadeDownload}
              </h6>
              <small className="text-truncate text-muted mb-0">
                {velocidadeUpload}
              </small>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: "Perfil",
    minWidth: "200px",
    sortable: true,
    selector: (row) => row.tipo_plano_id,
    cell: (row) => {
      const velocidadeDownload = "Visitante",
        velocidadeUpload = "MAC: 5C:CD:5B:B7:E3:1E"

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link
              to={`/usuario/gerenciar/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <h6 className="user-name text-truncate mb-0">
                {velocidadeDownload}
              </h6>
              <small className="text-truncate text-muted mb-0">
                {velocidadeUpload}
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
          <Link to={`/usuario/gerenciar/${row.id}`} id={`pw-tooltip-${row.id}`}>
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
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    ),
  },
]
