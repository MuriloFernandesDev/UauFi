// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react"

// ** Table Columns
import { columns } from "./columns"

// ** Store & Actions
import { getUsuarios } from "../store"
import { useDispatch, useSelector } from "react-redux"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"
import { ChevronDown, Share, User, UserPlus, UserCheck } from "react-feather"

// ** Reactstrap Imports
import { Row, Col, Card, Input, Spinner, Button } from "reactstrap"

// ** Utils
import { dateTimeNow } from "@utils"

// ** Sidebar
import Sidebar from "./Sidebar"

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
            className="me-0 me-sm-1 mb-1 mb-md-0 me-md-2"
            color="primary"
            onClick={toggleSidebar}
          >
            +Filtros
          </Button>
          <Button
            className="me-0 mb-1 mb-md-0 me-md-2"
            onClick={() => downloadCSV(store.data)}
            color="secondary"
            outline
          >
            <span className="align-middle text-nowrap">
              <Share className="font-small-4" /> Exportar
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  )
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
  { value: "niver", label: "Aniversariantes do dia" },
]

const UsuarioLista = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.usuario)

  // ** States
  const [sort, setSort] = useState(store.params.sort ?? "desc")
  const [searchTerm, setSearchTerm] = useState(store.params.q ?? "")
  const [currentPage, setCurrentPage] = useState(store.params.page ?? 1)
  const [sortColumn, setSortColumn] = useState(store.params.sortColumn ?? "id")
  const [rowsPerPage, setRowsPerPage] = useState(store.params.perPage ?? 10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vDataInicial, setDataInicial] = useState(
    store.params.datai ?? `${dateTimeNow()} 00:00`
  )
  const [vDataFinal, setDataFinal] = useState(
    store.params.dataf ?? `${dateTimeNow()} 23:59`
  )
  //Valor padrão da situação (Online)
  const vSituacaoArray = (store.params.situacao ?? "o")
    .split(",")
    .map((item) => item)

  const [vSituacao, setSituacao] = useState(
    statusOptions.filter((item) => vSituacaoArray?.includes(item.value))
  )
  const [vPesquisando, setPesquisando] = useState(true)

  const vTimeoutPesquisa = useRef()

  // ** Guardar o Cliente selecionado para atualizar a página caso mude
  const sClienteId = localStorage.getItem("clienteId")

  const handlePesquisar = (dados, force) => {
    const vDadosAnt = JSON.stringify({
      sort,
      sortColumn,
      q: searchTerm,
      page: currentPage,
      perPage: rowsPerPage,
      datai: vDataInicial,
      dataf: vDataFinal,
      situacao: arrayToString(vSituacao),
      clienteId: sClienteId,
    })
    const vDadosNovo = JSON.stringify(dados)
    if (vDadosAnt !== vDadosNovo || force) {
      if (vTimeoutPesquisa) {
        clearTimeout(vTimeoutPesquisa.current)
      }
      vTimeoutPesquisa.current = setTimeout(() => {
        setPesquisando(true)

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

  // ** Get data on mount
  useEffect(() => {
    const vForce = store.total === -1
    setPesquisando(vForce)
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
      vForce
    )
  }, [dispatch, store.data.length, sort, sortColumn, currentPage])

  // ** Function in get data on page change
  const handlePagination = (page) => {
    handlePesquisar({
      sort,
      sortColumn,
      q: searchTerm,
      page: page.selected + 1,
      perPage: rowsPerPage,
      datai: vDataInicial,
      dataf: vDataFinal,
      situacao: arrayToString(vSituacao),
      clienteId: sClienteId,
    })

    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value)
    handlePesquisar({
      sort,
      sortColumn,
      q: searchTerm,
      page: currentPage,
      perPage: value,
      datai: vDataInicial,
      dataf: vDataFinal,
      situacao: arrayToString(vSituacao),
      clienteId: sClienteId,
    })
    setRowsPerPage(value)
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
      return store.data
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
