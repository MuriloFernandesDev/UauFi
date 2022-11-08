// ** React Imports
import { Fragment, useState, useEffect, useRef, useContext } from "react"

// ** Store & Actions
import { getUsuarios, getPagina } from "../store"
import { useDispatch, useSelector } from "react-redux"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"
import {
  ChevronDown,
  Share,
  User,
  UserPlus,
  UserCheck,
  MoreVertical,
  Eye,
  WifiOff,
} from "react-feather"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Spinner,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap"

// ** Context
import { AbilityContext as PermissaoContext } from "@src/utility/context/Can"

// ** API
import api from "@src/services/api"

// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { formatDateTime } from "@utils"

// ** Sidebar
import Sidebar from "./Sidebar"

// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import toast from "react-hot-toast"

const MySwal = withReactContent(Swal)

import "@styles/react/libs/tables/react-dataTable-component.scss"

// ** Table Header
const CustomHeader = ({
  store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  // ** Context
  const permissao = useContext(PermissaoContext)

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"
    const keys = Object.keys(store.data[0])

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        result += item[key]

        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = "export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-1 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center ps-0 mt-1 mb-1">
          <div className="d-flex align-items-center me-2">
            <label htmlFor="rows-per-page">Mostrar</label>
            <Input
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              className="form-control ms-50 pe-3"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column mt-xl-0 mt-1 pe-0 ps-0"
        >
          <div className="d-flex align-items-center mb-1 mb-md-0 me-0 me-sm-1 me-md-2">
            <label htmlFor="txtPesquisa">Pesquisa</label>
            <Input
              id="txtPesquisa"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
              placeholder="Filtrar..."
            />
          </div>
          <Button
            className="me-0 mb-1 mb-md-0"
            color="primary"
            onClick={toggleSidebar}
          >
            +Filtros
          </Button>
          {permissao.can("read", "rel_exportar_registros") ? (
            <Button
              className="me-0 mb-1 mb-md-0 ms-0 ms-sm-1 ms-md-2"
              onClick={() => downloadCSV(store.data)}
              color="secondary"
              outline
            >
              <span className="align-middle text-nowrap">
                <Share className="font-small-4" /> Exportar
              </span>
            </Button>
          ) : null}
        </Col>
      </Row>
    </div>
  )
}

const handleError = (error, errorMessage, errorIcon) => {
  return MySwal.fire({
    title: error,
    text: errorMessage,
    icon: errorIcon,
    customClass: {
      confirmButton: "btn btn-primary",
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
    buttonsStyling: false,
  })
}

const arrayToString = (a) => {
  if (a) {
    return a?.map((item) => item.value.toString()).toString()
  }
  return null
}

const statusOptions = [
  { value: "o", label: "Online" },
  { value: "n", label: "Cadastro novo" },
  { value: "niver", label: "Aniversariantes" },
]

const UsuarioLista = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.usuario)

  // ** States
  const [sort, setSort] = useState(store.params.sort ?? "desc")
  const [searchTerm, setSearchTerm] = useState(store.params.q ?? "")
  const [currentPage, setCurrentPage] = useState(store.params.page ?? 1)
  const [sortColumn, setSortColumn] = useState(
    store.params.sortColumn ?? "entrada"
  )
  const [rowsPerPage, setRowsPerPage] = useState(store.params.perPage ?? 25)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vDataInicial, setDataInicial] = useState(null)
  const [vDataFinal, setDataFinal] = useState(null)
  //Valor padrão da situação (Online)
  const vSituacaoArray = (store.params.situacao ?? "o")
    .split(",")
    .map((item) => item)

  const [vSituacao, setSituacao] = useState(
    statusOptions.filter((item) => vSituacaoArray?.includes(item.value))
  )
  const [vPesquisando, setPesquisando] = useState(false)

  const vTimeoutPesquisa = useRef()

  // ** Guardar o Cliente selecionado para atualizar a página caso mude
  const sClienteId = localStorage.getItem("clienteId")

  const handlePesquisar = (dados, force) => {
    if (
      force ||
      sort !== dados.sort ||
      sortColumn !== dados.sortColumn ||
      searchTerm !== dados.q ||
      vDataInicial !== dados.datai ||
      vDataFinal !== dados.dataf ||
      arrayToString(vSituacao) !== dados.situacao ||
      sClienteId !== dados.clienteId
    ) {
      if (vTimeoutPesquisa) {
        clearTimeout(vTimeoutPesquisa.current)
      }
      vTimeoutPesquisa.current = setTimeout(() => {
        setPesquisando(true)
        dados.clienteId = sClienteId
        dispatch(getUsuarios(dados))
          .then(() => {
            setPesquisando(false)
          })
          .catch(() => {
            setPesquisando(false)
          })
      }, 300)
    }
  }

  // ** Function to toggle sidebar
  const toggleSidebar = (e) => {
    setSidebarOpen(!sidebarOpen)
    if (sidebarOpen && e.situacao) {
      setSituacao(e.situacao)
      setDataInicial(e.datai)
      setDataFinal(e.dataf)
      handlePesquisar(
        {
          sort,
          sortColumn,
          q: searchTerm,
          page: currentPage,
          perPage: rowsPerPage,
          datai: e.datai,
          dataf: e.dataf,
          situacao: arrayToString(e.situacao),
          clienteId: sClienteId,
        },
        true
      )
    }
  }

  // ** Modal de desconexão
  const handleDesconectar = (row) => {
    return MySwal.fire({
      title: "Tem certeza?",
      text: "O usuário será desconectado e deverá conectar-se novamente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok, desconectar!",
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
    }).then((result) => {
      if (result.value) {
        api
          .post(`/usuario/desconectar/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              handlePesquisar(store.params, true)

              toast.success("Desconectado com sucesso!", {
                position: "bottom-right",
              })
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              handleError("Atenção!", "Não autorizado.", "warning")
            } else if (error.response.status === 503) {
              handleError("Ops...", error.response.data, "error")
            } else {
              handleError(
                "Erro inesperado",
                "Por favor, contate um administrador.",
                "error"
              )
            }
          })
      }
    })
  }

  // ** Get data on mount
  useEffect(() => {
    if (!vPesquisando) {
      setPesquisando(true)
      handlePesquisar(
        {
          sort,
          sortColumn,
          q: searchTerm,
          page: currentPage,
          perPage: rowsPerPage,
          datai: vDataInicial,
          dataf: vDataFinal,
          situacao: arrayToString(vSituacao),
          clienteId: store.params.clienteId,
        },
        true
      )
    }
  }, [dispatch, store.data.length, sort, sortColumn, currentPage])

  // ** Function in get data on page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1)
    dispatch(
      getPagina({
        allData: store.allData,
        page: page.selected + 1,
        perPage: rowsPerPage,
      })
    )
  }

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
    dispatch(
      getPagina({
        allData: store.allData,
        page: currentPage,
        perPage: value,
      })
    )
  }

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val)
    handlePesquisar({
      sort,
      sortColumn,
      q: val,
      page: currentPage,
      perPage: rowsPerPage,
      datai: vDataInicial,
      dataf: vDataFinal,
      situacao: arrayToString(vSituacao),
      clienteId: sClienteId,
    })
  }

  // ** Renders Client Columns
  const renderClient = (row) => {
    if (row.foto?.length) {
      return (
        <Avatar className="me-1" img={row.foto_url} width="32" height="32" />
      )
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

  const columns = [
    {
      name: "Usuário",
      sortable: true,
      minWidth: "300px",
      sortField: "nome",
      selector: (row) => row.nome,
      cell: (row) => (
        <Link
          to={`/usuario/dados/${row.id}`}
          className="d-flex justify-content-left align-items-center w-100"
        >
          {renderClient(row)}
          <div className="user_name text-truncate text-body">
            <div className="d-flex flex-column">
              <span className="fw-bolder text-truncate">{row.nome}</span>
              <small className="mb-0">
                {row.cpf ? `CPF: ${row.cpf}` : ""}{" "}
                {row.celular ? `Cel: ${row.celular}` : ""}
              </small>
              <small className="mb-0">
                {row.online ? <Badge color="success">Online</Badge> : null}
              </small>
            </div>
          </div>
        </Link>
      ),
    },
    {
      name: "Conexão",
      sortable: true,
      minWidth: "200px",
      sortField: "entrada",
      selector: (row) => row.entrada,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="mb-0">{row.comentario ?? ""}</small>
            <small className="mb-0">{formatDateTime(row.entrada)}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Dispositivo",
      sortable: true,
      minWidth: "200px",
      sortField: "mac",
      selector: (row) => row.mac,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="mb-0">
              {row.dispositivo?.mac ? `MAC: ${row.dispositivo?.mac ?? ""}` : ""}
            </small>
            <small className="mb-0">{row.dispositivo?.plataforma ?? ""}</small>
            <small className="mb-0 text-nowrap">
              {row.dispositivo?.modelo ?? ""} {row.dispositivo?.marca ?? ""}
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

            <UncontrolledTooltip
              placement="top"
              target={`pw-tooltip-${row.id}`}
            >
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
                    handleDesconectar(row)
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

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    if (store.data.length > 0) {
      return vPesquisando ? [] : store.data
    } else {
      return []
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    handlePesquisar({
      sort: sortDirection,
      sortColumn: column.sortField,
      q: searchTerm,
      page: currentPage,
      perPage: rowsPerPage,
      datai: vDataInicial,
      dataf: vDataFinal,
      situacao: arrayToString(vSituacao),
      clienteId: sClienteId,
    })
  }

  return (
    <Fragment>
      <div className="app-user-list">
        <Row>
          <Col md="4">
            <StatsHorizontal
              color="primary"
              statTitle="Total de usuários"
              icon={<User size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {vPesquisando ? (
                    <Spinner type="grow" size="sm" color="primary" />
                  ) : (
                    new Intl.NumberFormat().format(store.total_usuario)
                  )}
                </h3>
              }
            />
          </Col>
          <Col md="4">
            <StatsHorizontal
              color="info"
              statTitle="Cadastros no seu wi-fi"
              icon={<UserPlus size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {vPesquisando ? (
                    <Spinner type="grow" size="sm" color="primary" />
                  ) : (
                    new Intl.NumberFormat().format(store.total_cadastro)
                  )}
                </h3>
              }
            />
          </Col>
          <Col md="4">
            <StatsHorizontal
              color="success"
              statTitle="Online agora"
              icon={<UserCheck size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {vPesquisando ? (
                    <Spinner type="grow" size="sm" color="primary" />
                  ) : (
                    new Intl.NumberFormat().format(store.total_online)
                  )}
                </h3>
              }
            />
          </Col>
        </Row>
      </div>
      <div className="invoice-list-wrapper">
        <Card className="overflow-hidden">
          <div className="react-dataTable">
            <DataTable
              noHeader
              subHeader
              sortServer
              pagination
              noDataComponent=""
              responsive
              paginationServer
              columns={columns}
              onSort={handleSort}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              paginationComponent={CustomPagination}
              data={dataToRender()}
              subHeaderComponent={
                <CustomHeader
                  store={store.dados}
                  searchTerm={searchTerm}
                  rowsPerPage={rowsPerPage}
                  handleFilter={handleFilter}
                  handlePerPage={handlePerPage}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
          </div>
        </Card>
      </div>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default UsuarioLista
