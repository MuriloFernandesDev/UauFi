// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Spinner,
  Row,
  Col,
  Badge,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

// ** Custom Components
import Avatar from '@src/@core/components/avatar'

import { Link } from 'react-router-dom'

import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Store & Actions
import { getUsuarioOnline } from '../store'

// ** Utils
import { formatDateTime, formatDate, formatInt, mostrarMensagem } from '@utils'

// ** Icons Imports
import { Eye, MoreVertical, Smartphone, WifiOff } from 'react-feather'

// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const UsuarioOnline = () => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const getDados = () => {
    getUsuarioOnline()
      .then((response) => {
        setCarregando(false)

        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }
  // ** Modal de desconexão
  const handleDesconectar = (row) => {
    return MySwal.fire({
      title: 'Tem certeza?',
      text: 'O usuário será desconectado e deverá conectar-se novamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok, desconectar!',
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
          .post(`/usuario/desconectar/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              getDados()
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              mostrarMensagem('Atenção!', 'Não autorizado.', 'warning')
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
    })
  }

  useEffect(() => {
    setCarregando(true)
    getDados()
  }, [])

  // ** Render Foto
  const renderFoto = (row) => {
    if (row.foto_url?.length > 0) {
      return (
        <Avatar
          className="me-1 img-proporcional"
          img={row.foto_url}
          width="42"
          height="42"
        />
      )
    } else {
      return (
        <Avatar
          initials
          className="me-1"
          color="light-success"
          width="42"
          height="42"
          content={row.nome || row.email || ''}
        />
      )
    }
  }

  return (
    <Fragment>
      <Row>
        <Col md="4" className="offset-md-4">
          <StatsHorizontal
            color="success"
            statTitle={vCarregando ? 'Verificando...' : 'Usuários online'}
            icon={<Smartphone size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="success" />{' '}
                  </div>
                ) : (
                  formatInt(vDados?.length)
                )}
              </h3>
            }
          />
        </Col>
      </Row>
      <Row className="match-height">
        {!vCarregando
          ? vDados?.length > 0
            ? vDados.map((row, index) => {
                return (
                  <Col key={index} md="2" lg="4" xl="3">
                    <Card className="card-apply-job">
                      <CardHeader className="p-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <UncontrolledDropdown className="chart-dropdown">
                              <DropdownToggle
                                color=""
                                className="bg-transparent btn-sm border-0 p-50 ps-0"
                              >
                                <MoreVertical
                                  size={18}
                                  className="cursor-pointer"
                                />
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
                                  <span className="align-middle">
                                    Desconectar
                                  </span>
                                </DropdownItem>
                                <DropdownItem
                                  tag="a"
                                  href={`/usuario/dados/${row.id}`}
                                  className="w-100"
                                >
                                  <Eye size={14} className="me-50" />
                                  <span className="align-middle">
                                    Visualizar dados
                                  </span>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            {renderFoto(row)}
                            <Link to={`/usuario/dados/${row.id}`}>
                              <h6 className="mb-0">
                                {row.nome ||
                                  row.email ||
                                  row.dispositivo?.mac ||
                                  ''}
                              </h6>
                            </Link>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="d-flex flex-column">
                          {row.cpf ? (
                            <small className=" mb-0">
                              <strong>CPF: </strong> {row.cpf}
                            </small>
                          ) : null}
                          {row.celular ? (
                            <small className=" mb-0">
                              <strong>Cel: </strong> {row.celular}
                            </small>
                          ) : null}
                          {row.nascimento ? (
                            <small className=" mb-0">
                              <strong>Nascimento: </strong>{' '}
                              {formatDate(row.nascimento)}
                            </small>
                          ) : null}
                          {row.comentario ? (
                            <small className=" mb-0">
                              <strong>Obs: </strong> {row.comentario}
                            </small>
                          ) : null}
                          {(row.nome?.length > 0 || row.email?.length > 0) &&
                          row.dispositivo?.mac?.length > 0 ? (
                            <small className=" mb-0">
                              <strong>MAC: </strong> {row.dispositivo?.mac}
                            </small>
                          ) : null}
                          <small className=" mb-0">
                            <strong>Conexão: </strong>{' '}
                            {formatDateTime(row.entrada)}
                          </small>
                          <small className="mb-0">
                            <strong>Dispositivo: </strong>{' '}
                            {row.dispositivo?.plataforma ?? ''}{' '}
                            {row.dispositivo?.modelo ?? ''}{' '}
                            {row.dispositivo?.marca ?? ''}
                          </small>
                          <small className="mb-0">{row.hotspot ?? ''}</small>
                        </div>
                        {row.aniversariante ? (
                          <Badge color="light-primary" pill>
                            Aniversariante
                          </Badge>
                        ) : null}
                      </CardBody>
                    </Card>
                  </Col>
                )
              })
            : null
          : null}
      </Row>
    </Fragment>
  )
}

export default UsuarioOnline
