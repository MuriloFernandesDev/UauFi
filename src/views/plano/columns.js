// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { store } from "@store/store"
import { deletePlano } from "./store"

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap"

// ** Third Party Components
import { Eye, Trash, MoreVertical } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

// ** Modal de exclusão de plano

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
      store.dispatch(deletePlano(row.id))
      MySwal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "O plano de conexão foi removido.",
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
    minWidth: "450px",
    cell: (row) => {
      const nome = row.nome ?? "",
        planoAtivo = `${row.ativo ? "Ativo" : "Inativo"}. ` ?? "",
        tempoConexao = `Tempo máximo de conexão: ${row.tempo}` ?? ""
      let tempoUnidade
      if (row.unidade_tempo === "m") {
        tempoUnidade = row.tempo === 1 ? "minuto" : "minutos"
      } else if (row.unidade_tempo === "h") {
        tempoUnidade = row.tempo === 1 ? "hora" : "horas"
      } else {
        tempoUnidade = row.tempo === 1 ? "dia" : "dias"
      }
      const planoInfo = `${planoAtivo}${tempoConexao} ${tempoUnidade}`

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link to={`/plano/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">{nome}</h6>
              <small className="text-truncate text-muted mb-0">
                {planoInfo}
              </small>
            </Link>
          </div>
        </div>
      )
    },
  },
  {
    name: "Plano de conexão",
    minWidth: "200px",
    cell: (row) => {
      const velocidadeDownload = row.mega_download ?? "",
        velocidadeUpload = row.mega_upload ?? ""
      let tipoPlano
      if (row.tipo_plano_id === 1) {
        tipoPlano = "Visitante"
      } else if (row.tipo_plano_id === 2) {
        tipoPlano = "Hóspede / Cliente"
      } else {
        tipoPlano = "Evento"
      }
      const planoInfo = `Download: ${velocidadeDownload}Mb | Upload: ${velocidadeUpload}Mb`

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <Link to={`/plano/${row.id}`} id={`pw-tooltip2-${row.id}`}>
              <h6 className="user-name text-truncate mb-0">{tipoPlano}</h6>
              <small className="text-truncate text-muted mb-0">
                {planoInfo}
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
          <Link to={`/plano/${row.id}`} id={`pw-tooltip-${row.id}`}>
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
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    ),
  },
]
