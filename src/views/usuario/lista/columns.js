// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Icons Imports
import { MoreVertical, Eye, WifiOff } from "react-feather"

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap"
import { formatDateTime } from "@utils"

// ** Renders Client Columns
const renderClient = (row) => {
  if (row.foto?.length) {
    return <Avatar className="me-1" img={row.foto_url} width="32" height="32" />
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color="light-primary"
        content={row.nome || row.email || ""}
      />
    )
  }
}

export const columns = [
  {
    name: "Usuário",
    sortable: true,
    minWidth: "300px",
    sortField: "nome",
    selector: (row) => row.nome,
    cell: (row) => (
      <Link
        to={`/usuario/dados/${row.id}`}
        className="d-flex justify-content-left align-items-center"
      >
        {renderClient(row)}
        <div className="user_name text-truncate text-body">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.nome}</span>
            <small className="text-truncate text-muted mb-0">
              {row.celular ? `Cel: ${row.celular}` : ""}
            </small>
            <small className="text-truncate text-muted mb-0">
              {row.ultimo_quarto ? `Quarto: ${row.ultimo_quarto}` : ""}
            </small>
            <small className="text-truncate text-muted mb-0">
              {row.cpf ? `CPF: ${row.cpf}` : ""}
            </small>
          </div>
        </div>
      </Link>
    ),
  },
  {
    name: "Conexão",
    sortable: true,
    minWidth: "300px",
    sortField: "hotspot",
    selector: (row) => row.hotspot,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <span className="fw-bolder">{row.hotspot}</span>
          <small className="text-truncate text-muted mb-0">
            {formatDateTime(row.entrada) ?? ""}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: <div className="text-end w-100">Ações</div>,
    minWidth: "50px",
    cell: (row) => (
      <div className="text-end w-100">
        <div className="column-action d-inline-flex">
          <Link to={`/usuario/dados/${row.id}`} id={`pw-tooltip-${row.id}`}>
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
                }}
              >
                <WifiOff size={14} className="me-50" />
                <span className="align-middle">Desconectar</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    ),
  },
]
