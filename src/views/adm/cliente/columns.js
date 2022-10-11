// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { cloneCliente, deleteCliente } from "./store"

// ** Utils
import { getUserData } from "@utils"

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

const user = getUserData()

// ** renders client column
const renderClient = (row) => {
  if (row.logo.length) {
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

// ** Modal de exclusão de cliente

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
      store.dispatch(deleteCliente(row.id))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "O cliente foi removido.",
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

// ** Modal de clonagem de cliente

const handleClone = (row) => {
  MySwal.fire({
    title: "Copiar cadastro de cliente",
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
      adaptedSentence = `${result.value} cópia do cliente foi gerada.`
    } else {
      adaptedSentence = `${result.value} cópias do cliente foram geradas.`
    }
    if (result.value) {
      store.dispatch(cloneCliente(cloneParams))
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
    name: "Cliente",
    minWidth: "450px",
    // selector: row => row.client.name,
    cell: (row) => {
      const nome = row.nome ? row.nome : "",
        hotspot_id =
          user.perfil === "adm" ? (row.hotspot_id ? row.hotspot_id : "") : "",
        telefone = row.tel_1 ? `Telefone: ${row.tel_1}` : "",
        whatsapp = row.whatsapp ? ` WhatsApp: ${row.whatsapp}` : ""
      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <Link to={`/adm/cliente/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">
                {nome}
                <strong className="text-muted ms-1">{hotspot_id}</strong>
              </h6>
              <small className="text-truncate text-muted mb-0">
                {telefone + whatsapp}
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
          <Link to={`/adm/cliente/${row.id}`} id={`pw-tooltip-${row.id}`}>
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
