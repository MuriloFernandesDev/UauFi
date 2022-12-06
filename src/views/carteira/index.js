// ** React Imports
import { Fragment, useState, useEffect, useRef, useContext } from "react"

// ** Store & Actions
import { useDispatch } from "react-redux"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"
import { ChevronDown, DollarSign } from "react-feather"

// ** Reactstrap Imports
import { Row, Col, Card, Input, Spinner, Button } from "reactstrap"

// ** Context
import { AbilityContext as PermissaoContext } from "@src/utility/context/Can"

// ** API
import api from "@src/services/api"

// ** Utils
import { formatDateTime, formatMoeda } from "@utils"

// ** Sidebar
import Sidebar from "./Sidebar"

import "@styles/react/libs/tables/react-dataTable-component.scss"

// ** Table Header
const CustomHeader = ({
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  // ** Context
  const permissao = useContext(PermissaoContext)

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
          {permissao.can("create", "minha_carteira") ? (
            <Button
              className="me-0 mb-1 mb-md-0"
              color="primary"
              onClick={toggleSidebar}
            >
              Solicitar crédito
            </Button>
          ) : null}
        </Col>
      </Row>
    </div>
  )
}

const Carteira = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** States
  const [sort, setSort] = useState("desc")
  const [vDados, setDados] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState("data_cadastro")
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      sClienteId !== dados.clienteId
    ) {
      if (vTimeoutPesquisa) {
        clearTimeout(vTimeoutPesquisa.current)
      }
      vTimeoutPesquisa.current = setTimeout(() => {
        setPesquisando(true)
        dados.clienteId = sClienteId
        api
          .get("/cliente/carteira")
          .then((res) => {
            setDados(res.data)
            setPesquisando(false)
          })
          .catch(() => {
            setPesquisando(false)
          })
      }, 300)
    }
  }

  // ** Function to toggle sidebar
  const toggleSidebar = (valor) => {
    setSidebarOpen(!sidebarOpen)
    if (sidebarOpen && valor > 0) {
      handlePesquisar(
        {
          sort,
          sortColumn,
          q: searchTerm,
          page: currentPage,
          perPage: rowsPerPage,
          clienteId: sClienteId,
        },
        true
      )
    }
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
          clienteId: sClienteId,
        },
        true
      )
    }
  }, [dispatch, sort, sortColumn])

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
      clienteId: sClienteId,
    })
  }

  const columns = [
    {
      name: "Data / Hora",
      sortable: true,
      minWidth: "150px",
      sortField: "data_cadastro",
      selector: (row) => row.data_cadastro,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center w-100">
          <div className="user_name text-truncate text-body">
            <div className="d-flex flex-column">
              <span className="fw-bolder text-truncate">
                {formatDateTime(row.data_cadastro)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Descrição",
      sortable: true,
      minWidth: "150px",
      sortField: "descricao",
      selector: (row) => row.descricao,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="mb-0">{row.descricao}</small>
          </div>
        </div>
      ),
    },
    {
      name: <div className="text-end w-100">Valor</div>,
      minWidth: "100px",
      sortField: "valor",
      selector: (row) => row.valor,
      cell: (row) => (
        <div className="text-end w-100">
          <small className="mb-0">{formatMoeda(row.valor)}</small>
        </div>
      ),
    },
  ]

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(
      Math.ceil(vDados?.cliente_credito?.length / rowsPerPage)
    )

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
    if (vDados?.cliente_credito?.length > 0) {
      return vPesquisando ? [] : vDados?.cliente_credito
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
      clienteId: sClienteId,
    })
  }

  return (
    <Fragment>
      <div className="app-user-list">
        <Row>
          <Col md="4" className="offset-md-4">
            <StatsHorizontal
              color="success"
              statTitle="Saldo atual"
              icon={<DollarSign size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {vPesquisando ? (
                    <Spinner type="grow" size="sm" color="primary" />
                  ) : (
                    formatMoeda(vDados?.credito ?? 0)
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
                  store={vDados?.carteira_cliente}
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

export default Carteira
