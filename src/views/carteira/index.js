// ** React Imports
import { Fragment, useState, useEffect, useRef, useContext } from 'react'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import {
  ChevronDown,
  DollarSign,
  Trash,
  MoreVertical,
  Check,
} from 'react-feather'

import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap'

// ** Context
import { AbilityContext as PermissaoContext } from '@src/utility/context/Can'

// ** API
import api from '@src/services/api'

// ** Utils
import { formatDateTime, formatMoeda, mostrarMensagem } from '@utils'

// ** Sidebar
import Sidebar from './Sidebar'

import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// ** Table Header
const CustomHeader = ({ toggleSidebar }) => {
  // ** Context
  const permissao = useContext(PermissaoContext)
  const { t } = useTranslation()

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-1 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center ps-0 mt-1 mb-1">
          <div className="d-flex align-items-center me-2">
            <h5>{t('Créditos adicionados')}</h5>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column mt-xl-0 mt-1 pe-0 ps-0"
        >
          {permissao.can('create', 'minha_carteira') ? (
            <Button
              className="me-0 mb-1 mb-md-0"
              color="primary"
              onClick={toggleSidebar}
            >
              {t('Solicitar crédito')}
            </Button>
          ) : null}
        </Col>
      </Row>
    </div>
  )
}

const Carteira = () => {
  // ** Store Vars
  const permissao = useContext(PermissaoContext)

  // ** States
  const [vDados, setDados] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [vPesquisando, setPesquisando] = useState(false)

  const vTimeoutPesquisa = useRef()
  const { t } = useTranslation()

  // ** Guardar o Cliente selecionado para atualizar a página caso mude
  const sClienteId = localStorage.getItem('clienteId')

  const handlePesquisar = (dados, force) => {
    if (force || sClienteId !== dados.clienteId) {
      if (vTimeoutPesquisa) {
        clearTimeout(vTimeoutPesquisa.current)
      }
      vTimeoutPesquisa.current = setTimeout(() => {
        setPesquisando(true)
        dados.clienteId = sClienteId
        api
          .get(
            `/cliente_credito/${
              dados.clienteId?.length >= 1 ? 'carteira' : 'credito_nao_aprovado'
            }`
          )
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
    if (sidebarOpen && valor) {
      const vDados = {
        id: 0,
        cliente_id: 0,
        valor,
      }
      api
        .post('/cliente_credito/pedir', vDados)
        .then((response) => {
          if (response.status === 200) {
            handlePesquisar(
              {
                clienteId: sClienteId,
              },
              true
            )
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            mostrarMensagem(
              'Atenção!',
              'Preencha todos os campos corretamente.',
              'warning'
            )
          } else if (error.response.status === 503) {
            mostrarMensagem('Ops...', error.response.data, 'error')
          } else {
            mostrarMensagem(
              'Erro inesperado',
              'Por favor, contate um administrador.',
              'error'
            )
          }
        })
    }
    setSidebarOpen(!sidebarOpen)
  }

  const handleAprovar = (id) => {
    api
      .post(`/cliente_credito/aprovar/${id}`)
      .then((response) => {
        if (response.status === 200) {
          handlePesquisar(
            {
              clienteId: sClienteId,
            },
            true
          )
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          mostrarMensagem(
            'Atenção!',
            'Preencha todos os campos corretamente.',
            'warning'
          )
        } else if (error.response.status === 503) {
          mostrarMensagem('Ops...', error.response.data, 'error')
        } else {
          mostrarMensagem(
            'Erro inesperado',
            'Por favor, contate um administrador.',
            'error'
          )
        }
      })
  }

  const handleRemover = (id) => {
    api
      .delete(`/cliente_credito/${id}`)
      .then((response) => {
        if (response.status === 200) {
          handlePesquisar(
            {
              clienteId: sClienteId,
            },
            true
          )
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          mostrarMensagem(
            'Atenção!',
            'Preencha todos os campos corretamente.',
            'warning'
          )
        } else if (error.response.status === 503) {
          mostrarMensagem('Ops...', error.response.data, 'error')
        } else {
          mostrarMensagem(
            'Erro inesperado',
            'Por favor, contate um administrador.',
            'error'
          )
        }
      })
  }

  // ** Modal de exclusão
  const handleDeleteConfirmation = (id) => {
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
    }).then(async (result) => {
      if (result.value) {
        handleRemover(id)
      }
    })
  }

  // ** Get data on mount
  useEffect(() => {
    if (!vPesquisando) {
      setPesquisando(true)
      handlePesquisar(
        {
          clienteId: sClienteId,
        },
        true
      )
    }
  }, [])

  const columns = [
    {
      name: 'Data / Hora',
      sortable: true,
      minWidth: '150px',
      sortField: 'data_cadastro',
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
      name: 'Descrição',
      sortable: true,
      minWidth: '150px',
      sortField: 'descricao',
      selector: (row) => row.descricao,
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <small className="mb-0">{row.descricao}</small>
            {row.data_aprovacao === null ? (
              <small className="text-truncate text-muted mb-0">
                <Badge color="warning">{t('Aguardando aprovação')}</Badge>
              </small>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      name: <div className="text-end w-100">Valor</div>,
      minWidth: '100px',
      sortField: 'valor',
      selector: (row) => row.valor,
      cell: (row) => (
        <div className="text-end w-100">
          <small className="mb-0">{formatMoeda(row.valor)}</small>
        </div>
      ),
    },
  ]

  if (
    permissao.can('update', 'minha_carteira') ||
    permissao.can('delete', 'minha_carteira')
  ) {
    columns.push({
      name: <div className="text-end w-100">{t('Ações')}</div>,
      width: '100px',
      cell: (row) => (
        <div className="text-end w-100">
          <div className="column-action d-inline-flex">
            <UncontrolledDropdown>
              <DropdownToggle tag="span">
                <MoreVertical size={17} className="cursor-pointer" />
              </DropdownToggle>
              <DropdownMenu end>
                {permissao.can('update', 'minha_carteira') &&
                row.data_aprovacao === null ? (
                  <DropdownItem
                    tag="a"
                    href="/"
                    className="w-100"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAprovar(row.id)
                    }}
                  >
                    <Check size={14} className="me-50" />
                    <span className="align-middle">{t('Aprovar')}</span>
                  </DropdownItem>
                ) : null}
                {permissao.can('delete', 'minha_carteira') ? (
                  <DropdownItem
                    tag="a"
                    href="/"
                    className="w-100"
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteConfirmation(row.id)
                    }}
                  >
                    <Trash size={14} className="me-50" />
                    <span className="align-middle">{t('Remover')}</span>
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      ),
    })
  }

  // ** Table data to render
  const dataToRender = () => {
    if (vDados?.cliente_credito?.length > 0) {
      return vPesquisando ? [] : vDados?.cliente_credito
    } else {
      return []
    }
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
              noDataComponent=""
              responsive
              columns={columns}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              data={dataToRender()}
              subHeaderComponent={
                <CustomHeader
                  store={vDados?.carteira_cliente}
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
