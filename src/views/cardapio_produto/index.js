// ** React
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect, useContext } from 'react'

// ** Terceiros
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Trash, MoreVertical } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Custom Components
import Avatar from '@src/@core/components/avatar'

// ** API
import api from '@src/services/api'

// ** Reactstrap
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  Spinner,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Badge,
} from 'reactstrap'

// ** Store & Actions
import { getCardapioProduto } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Context
import { AbilityContext as PermissaoContext } from '@src/utility/context/Can'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'

const MySwal = withReactContent(Swal)

const CustomHeader = ({ handleFilter, value, handlePerPage, rowsPerPage }) => {
  // ** Context
  const permissao = useContext(PermissaoContext)

  return (
    <div className="w-100 py-2">
      <Row>
        <Col lg="6" className="d-flex align-items-center px-0 px-lg-1">
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
          <Button
            tag={Link}
            to="/cardapio_produto/add"
            color="primary"
            disabled={!permissao.can('update', 'cardapio_digital')}
          >
            Novo produto
          </Button>
        </Col>
        <Col
          lg="6"
          className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="txtPesquisa">Pesquisa</label>
            <Input
              id="txtPesquisa"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(e) => handleFilter(e.target.value)}
              placeholder="Filtrar..."
            />
          </div>
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
      confirmButton: 'btn btn-primary',
      popup: 'animate__animated animate__fadeIn',
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut',
    },
    buttonsStyling: false,
  })
}

const CardapioProdutoList = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.cardapio_produto)

  // ** States
  const [value, setValue] = useState(store.params.q ?? '')
  const [sort, setSort] = useState(store.params.sort ?? 'asc')
  const [sortColumn, setSortColumn] = useState(
    store.params.sortColumn ?? 'ordem'
  )
  const [currentPage, setCurrentPage] = useState(store.params.page ?? 1)
  const [rowsPerPage, setRowsPerPage] = useState(store.params.perPage ?? 10)
  const vTimeoutPesquisa = useRef()
  const [vPesquisando, setPesquisando] = useState(true)

  // ** Guardar o Cliente selecionado para atualizar a página caso mude
  const sClienteId = localStorage.getItem('clienteId')

  if (vPesquisando && store.total >= 0) {
    setPesquisando(false)
  }

  useEffect(() => {
    //Somente pesquisar se os parametros de mudaram
    if (
      store.params.sort !== sort ||
      store.params.q !== value ||
      store.params.sortColumn !== sortColumn ||
      store.params.page !== currentPage ||
      store.params.perPage !== rowsPerPage ||
      store.params.clienteId !== sClienteId
    ) {
      dispatch(
        getCardapioProduto({
          sort,
          q: value,
          sortColumn,
          page: currentPage,
          perPage: rowsPerPage,
          clienteId: sClienteId,
        })
      )
    }
  }, [dispatch, store.data.length])

  const handleFilter = (val) => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    setValue(val)
    vTimeoutPesquisa.current = setTimeout(() => {
      dispatch(
        getCardapioProduto({
          sort,
          q: val,
          sortColumn,
          page: currentPage,
          perPage: rowsPerPage,
          clienteId: sClienteId,
        })
      )
    }, 300)
  }

  const handlePerPage = (e) => {
    dispatch(
      getCardapioProduto({
        sort,
        q: value,
        sortColumn,
        page: currentPage,
        perPage: parseInt(e.target.value),
        clienteId: sClienteId,
      })
    )
    setRowsPerPage(parseInt(e.target.value))
  }

  const handlePagination = (page) => {
    dispatch(
      getCardapioProduto({
        sort,
        q: value,
        sortColumn,
        perPage: rowsPerPage,
        page: page.selected + 1,
        clienteId: sClienteId,
      })
    )
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <ReactPaginate
        nextLabel=""
        breakLabel="..."
        previousLabel=""
        pageCount={count || 1}
        activeClassName="active"
        breakClassName="page-item"
        pageClassName={'page-item'}
        breakLinkClassName="page-link"
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        onPageChange={(page) => handlePagination(page)}
        forcePage={
          currentPage !== 0 ? (currentPage <= count ? currentPage - 1 : 0) : 0
        }
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    )
  }

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
    dispatch(
      getCardapioProduto({
        q: value,
        page: currentPage,
        sort: sortDirection,
        perPage: rowsPerPage,
        sortColumn: column.sortField,
        clienteId: sClienteId,
      })
    )
  }

  // ** Modal de exclusão
  const handleDeleteConfirmation = (row) => {
    return MySwal.fire({
      title: 'Tem certeza?',
      text: 'Sua ação não poderá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1',
        popup: 'animate__animated animate__fadeIn',
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        api
          .delete(`/cardapio_produto/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              handleFilter(store.params.q)

              toast.success('Removido com sucesso!', {
                position: 'bottom-right',
              })
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              handleError('Atenção!', 'Não autorizado.', 'warning')
            } else if (error.response.status === 503) {
              handleError('Ops...', error.response.data, 'error')
            } else {
              handleError(
                'Erro inesperado',
                'Por favor, contate um administrador.',
                'error'
              )
            }
          })
      }
    })
  }

  const renderFoto = (row) => {
    if (row.imagem?.length > 0) {
      return (
        <Avatar
          className="me-50 img-proporcional"
          img={row.imagem}
          width="32"
          height="32"
        />
      )
    } else {
      return (
        <Avatar
          color="light-primary"
          className="me-50"
          content={row.titulo ?? ''}
          initials
        />
      )
    }
  }

  // ** Table columns
  const columns = [
    {
      name: 'Título',
      minWidth: '200px',
      selector: (row) => row.titulo,
      cell: (row) => {
        return (
          <Link
            to={`/cardapio_produto/${row.id}`}
            id={`pw-tooltip2-${row.id}`}
            className="d-flex justify-content-left align-items-center"
          >
            {renderFoto(row)}
            <div className="d-flex flex-column">
              <div>
                <h6 className="user-name text-truncate mb-0">
                  {row.titulo ?? ''}
                  {!row.ativo ? (
                    <small className="text-truncate text-muted mb-0 ms-1">
                      <Badge color="warning">Desativado</Badge>{' '}
                    </small>
                  ) : null}
                </h6>
                <small className="text-truncate text-muted mb-0">
                  {row.categoria?.titulo ?? ''}
                </small>
              </div>
            </div>
          </Link>
        )
      },
    },
    {
      name: 'Descrição',
      minWidth: '550px',
      sortable: true,
      selector: (row) => row.descricao,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center">
            <Link
              className="d-flex flex-column"
              to={`/cardapio_produto/${row.id}`}
              id={`pw-tooltip2-${row.id}`}
            >
              <span className="text-secondary user-name mb-0">
                {row.descricao ?? ''}
              </span>
            </Link>
          </div>
        )
      },
    },
    {
      name: <div className="text-end w-100">Ações</div>,
      width: '100px',
      cell: (row) => (
        <div className="text-end w-100">
          <div className="column-action d-inline-flex">
            <Link
              to={`/cardapio_produto/${row.id}`}
              id={`pw-tooltip-${row.id}`}
            >
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

  return sClienteId?.length > 0 ? (
    vPesquisando ? (
      <div className="text-center">
        <Spinner color="primary" />
      </div>
    ) : (
      <div className="invoice-list-wrapper">
        <Card>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              // sortServer
              noDataComponent=""
              paginationServer
              subHeader={true}
              columns={columns}
              responsive={true}
              onSort={handleSort}
              data={dataToRender()}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              defaultSortField="id"
              paginationDefaultPage={currentPage}
              paginationComponent={CustomPagination}
              subHeaderComponent={
                <CustomHeader
                  value={value}
                  rowsPerPage={rowsPerPage}
                  handleFilter={handleFilter}
                  handlePerPage={handlePerPage}
                />
              }
            />
          </div>
        </Card>
      </div>
    )
  ) : (
    <Card className="mb-0">
      <Row>
        <Col md="12" className="m-2 text-center">
          <h5 className="m-0">Selecione um cliente no campo acima</h5>
        </Col>
      </Row>
    </Card>
  )
}

export default CardapioProdutoList
