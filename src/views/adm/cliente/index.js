// ** React
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'

// ** Table
import { columns } from './columns'

// ** Terceiros
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap
import { Button, Input, Row, Col, Card, Spinner } from 'reactstrap'

// ** Store & Actions
import { getData } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const CustomHeader = ({ handleFilter, value, handlePerPage, rowsPerPage }) => {
  return (
    <div className='w-100 py-2'>
      <Row>
        <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
          <div className='d-flex align-items-center me-2'>
            <label htmlFor='rows-per-page'>Mostrar</label>
            <Input
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              className='form-control ms-50 pe-3'
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
          </div>
          <Button tag={Link} to='/adm/cliente/add' color='primary'>
            Novo cadastro
          </Button>
        </Col>
        <Col
          lg='6'
          className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0'
        >
          <div className='d-flex align-items-center'>
            <label htmlFor='txtPesquisa'>Pesquisa</label>
            <Input
              id='txtPesquisa'
              className='ms-50 me-2 w-100'
              type='text'
              value={value}
              onChange={e => handleFilter(e.target.value)}
              placeholder='Filtrar...'
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const ClienteList = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.cliente)

  // ** States
  const [value, setValue] = useState(store.params.q ?? '')
  const [sort, setSort] = useState(store.params.sort ?? 'desc')
  const [sortColumn, setSortColumn] = useState(store.params.sortColumn ?? 'id')
  const [currentPage, setCurrentPage] = useState(store.params.page ?? 1)
  const [rowsPerPage, setRowsPerPage] = useState(store.params.perPage ?? 10)
  const vTimeoutPesquisa = useRef()
  const [vPesquisando, setPesquisando] = useState(true)

  if ((vPesquisando) && (store.total >= 0)) {
    setPesquisando(false)
  }

  useEffect(() => {
    //Somente pesquisar se os parametros de filtro mudaram
    if ((store.params.sort !== sort) ||
      (store.params.q !== value) ||
      (store.params.sortColumn !== sortColumn) ||
      (store.params.page !== currentPage) ||
      (store.params.perPage !== rowsPerPage)) {
      dispatch(
        getData({
          sort,
          q: value,
          sortColumn,
          page: currentPage,
          perPage: rowsPerPage
        })
      )
    }
  }, [dispatch, store.data.length])

  const handleFilter = val => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    setValue(val)
    vTimeoutPesquisa.current = setTimeout(() => {
      dispatch(
        getData({
          sort,
          q: val,
          sortColumn,
          page: currentPage,
          perPage: rowsPerPage
        }))
    }, 300)
  }

  const handlePerPage = e => {
    dispatch(
      getData({
        sort,
        q: value,
        sortColumn,
        page: currentPage,
        perPage: parseInt(e.target.value)
      })
    )
    setRowsPerPage(parseInt(e.target.value))
  }

  const handlePagination = page => {
    dispatch(
      getData({
        sort,
        q: value,
        sortColumn,
        perPage: rowsPerPage,
        page: page.selected + 1
      })
    )
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <ReactPaginate
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        pageCount={count || 1}
        activeClassName='active'
        breakClassName='page-item'
        pageClassName={'page-item'}
        breakLinkClassName='page-link'
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        onPageChange={page => handlePagination(page)}
        forcePage={currentPage !== 0 ? (currentPage <= count ? currentPage - 1 : 0) : 0}
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
      getData({
        q: value,
        page: currentPage,
        sort: sortDirection,
        perPage: rowsPerPage,
        sortColumn: column.sortField
      })
    )
  }

  return (
    (vPesquisando) ? (
      <div className='text-center'>
        <Spinner color='primary' />
      </div>
    ) : (
      <div className='invoice-list-wrapper'>
        <Card>
          <div className='react-dataTable'>
            <DataTable
              noHeader
              pagination
              sortServer
              noDataComponent=''
              paginationServer
              subHeader={true}
              columns={columns}
              responsive={true}
              onSort={handleSort}
              data={dataToRender()}
              sortIcon={<ChevronDown />}
              className='react-dataTable'
              defaultSortField='id'
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
      </div>)
  )
}

export default ClienteList
