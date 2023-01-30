// ** Reactstrap Imports
import { Card, CardHeader, Spinner } from 'reactstrap'

import { Link } from 'react-router-dom'

// ** Utils
import { formatDateTime } from '@utils'

// ** Third Party Components
import Swal from 'sweetalert2'
import { ChevronDown, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import withReactContent from 'sweetalert2-react-content'
import { useTranslation } from 'react-i18next'

// ** React Imports
import { useEffect, useState } from 'react'

// ** Store & Actions
import { getListaHotspot } from '../store'
import { useDispatch } from 'react-redux'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { auto } from '@popperjs/core'

const MySwal = withReactContent(Swal)

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

const HotspotsVisitados = (dados) => {
  // ** Store Vars
  const dispatch = useDispatch()

  const { t } = useTranslation()

  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  // ** Get suer on mount
  useEffect(() => {
    setCarregando(true)
    getListaHotspot(dados.id)
      .then((response) => {
        setCarregando(false)

        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [dispatch])

  // ** Modal de exclusão
  const handleDeleteConfirmation = (row) => {
    return MySwal.fire({
      title: 'Tem certeza?',
      text: 'Sua ação removerá todos os dados deste usuário e isso não poderá ser revertido!',
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
          .delete(`/usuario/${row.id}`)
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

  const columns = [
    {
      sortable: true,
      minWidth: '250px',
      name: 'Hotspot',
      selector: (row) => row.hotspot.nome,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
              <span className="fw-bolder">{row.hotspot?.nome ?? ''}</span>
              <small className="text-muted">{row.subtitle}</small>
            </div>
          </div>
        )
      },
    },
    {
      sortable: true,
      name: <div className="text-center w-100">{t('Visitas')}</div>,
      selector: (row) => row.qtd,
      cell: (row) => {
        return (
          <div className="text-center w-100">
            <span>{new Intl.NumberFormat().format(row.qtd)}</span>
          </div>
        )
      },
    },

    {
      minWidth: '170px',
      name: <div className="text-center w-100">{t('Última visita')}</div>,
      selector: (row) => row.ult_data_hora,
      cell: (row) => {
        return (
          <div className="text-center w-100">
            <span>{formatDateTime(row.ult_data_hora)}</span>
          </div>
        )
      },
    },
    {
      name: '',
      minWidth: '40px',
      cell: (row) => (
        <div className="text-end w-100">
          <div className="column-action d-inline-flex">
            <Link
              to="/"
              className="text-danger"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirmation(row)
              }}
            >
              <Trash className="text-danger font-medium-3 cursor-pointer" />
            </Link>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader tag="h4">{t('Lugares visitados')}</CardHeader>
      <div
        className="react-dataTable user-view-account-projects"
        style={{ maxHeight: '367px', overflow: auto }}
      >
        {!vCarregando ? (
          vDados?.length > 0 ? (
            <DataTable
              noHeader
              responsive
              columns={columns}
              data={vDados}
              className="react-dataTable"
              sortIcon={<ChevronDown size={10} />}
            />
          ) : null
        ) : (
          <div className="text-center mt-3">
            <Spinner type="grow" size="sm" color="primary" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default HotspotsVisitados
