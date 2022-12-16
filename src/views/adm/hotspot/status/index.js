// ** React Imports
import { Fragment, useState, useEffect, useRef } from "react"

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Spinner,
  Row,
  Col,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardTitle,
} from "reactstrap"

// ** API
import api from "@src/services/api"

import { Link } from "react-router-dom"

import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

import classnames from "classnames"

// ** Store & Actions
import { getHotspotStatus, getHotspotStatusTotais } from "../store"

// ** Utils
import { formatDateTime, formatInt, mostrarMensagem } from "@utils"

// ** Icons Imports
import {
  AlertTriangle,
  Check,
  Clock,
  Eye,
  MoreVertical,
  User,
  Wifi,
  WifiOff,
} from "react-feather"

// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const UsuarioOnline = () => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)
  const [vTotais, setTotais] = useState(true)

  const vTimeoutPesquisa = useRef()

  const getTotais = () => {
    return getHotspotStatusTotais()
      .then((res) => {
        setCarregando(false)
        setTotais(res)
      })
      .catch(() => {
        setCarregando(false)
      })
  }

  const getDados = (tempo) => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    vTimeoutPesquisa.current = setTimeout(() => {
      setCarregando(true)
      return getHotspotStatus()
        .then((res) => {
          getTotais()
          setDados(res)
          getDados(300000)
        })
        .catch(() => {
          setCarregando(false)
          setDados(null)
          getDados(300000)
        })
    }, tempo)
  }
  // ** Modal de desativar
  const handleDesativar = (row) => {
    return MySwal.fire({
      title: "Tem certeza?",
      text: "O hotspot será DESATIVADO e deixará de aceitar novas conexões!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok, desativar!",
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
          .post(`/hotspot/desativar/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              getDados(1)
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              mostrarMensagem("Atenção!", "Não autorizado.", "warning")
            } else if (error.response.status === 503) {
              mostrarMensagem("Ops...", error.response.data, "error")
            } else {
              mostrarMensagem(
                "Erro inesperado",
                "Por favor, contate um administrador.",
                "error"
              )
            }
          })
      }
    })
  }

  useEffect(() => {
    setCarregando(true)
    getDados(1)
  }, [])

  return (
    <Fragment>
      <Row>
        <Col md="">
          <StatsHorizontal
            color="primary"
            statTitle={
              vCarregando
                ? "Verificando..."
                : `Hotspot${vDados?.qtd_total !== 1 ? "s" : ""}`
            }
            icon={<Wifi size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
                  </div>
                ) : (
                  formatInt(vTotais?.qtd_total ?? 0)
                )}
              </h3>
            }
          />
        </Col>
        <Col md="">
          <StatsHorizontal
            color="danger"
            statTitle={vCarregando ? "Verificando..." : "Offline"}
            icon={<AlertTriangle size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
                  </div>
                ) : (
                  formatInt(vTotais?.qtd_off ?? 0)
                )}
              </h3>
            }
          />
        </Col>
        <Col md="">
          <StatsHorizontal
            color="success"
            statTitle={vCarregando ? "Verificando..." : "Online"}
            icon={<Check size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
                  </div>
                ) : (
                  formatInt(vTotais?.qtd_on ?? 0)
                )}
              </h3>
            }
          />
        </Col>
        <Col md="">
          <StatsHorizontal
            color="secondary"
            statTitle={vCarregando ? "Verificando..." : "Desativado"}
            icon={<WifiOff size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
                  </div>
                ) : (
                  formatInt(vTotais?.qtd_inativo ?? 0)
                )}
              </h3>
            }
          />
        </Col>
        <Col md="">
          <StatsHorizontal
            color="warning"
            statTitle={vCarregando ? "Verificando..." : "Não utilizado"}
            icon={<Clock size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
                  </div>
                ) : (
                  formatInt(vTotais?.qtd_nao_utilizado ?? 0)
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
                    <Card>
                      <CardHeader
                        className={classnames("p-1", {
                          "bg-danger": row.status === 0,
                          "bg-success": row.status === 1,
                          "bg-secondary": row.status === 2,
                          "bg-warning": row.status === 3,
                        })}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <UncontrolledDropdown className="chart-dropdown">
                              <DropdownToggle
                                color=""
                                className="bg-transparent btn-sm border-0 p-50 ps-0"
                              >
                                <MoreVertical
                                  size={18}
                                  className="cursor-pointer text-white"
                                />
                              </DropdownToggle>
                              <DropdownMenu end>
                                <DropdownItem
                                  tag="a"
                                  href="/"
                                  className="w-100"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleDesativar(row)
                                  }}
                                >
                                  <WifiOff size={14} className="me-50" />
                                  <span className="align-middle">
                                    Desativar
                                  </span>
                                </DropdownItem>
                                <DropdownItem
                                  tag="a"
                                  href={`/adm/hotspot/${row.id}`}
                                  className="w-100"
                                >
                                  <Eye size={14} className="me-50" />
                                  <span className="align-middle">
                                    Visualizar dados
                                  </span>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <Link to={`/adm/hotspot/${row.id}`}>
                              <CardTitle
                                tag="h5"
                                className={classnames({
                                  "text-white": !row.online,
                                })}
                              >
                                {row.nome ?? ""}
                              </CardTitle>
                            </Link>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="d-flex flex-column pt-1">
                          <small className=" mb-0">
                            <strong>ID: </strong> {row.id}
                          </small>
                          <small className=" mb-0">
                            <strong>Status: </strong>{" "}
                            {row.online ? "Online" : "Offline"}
                          </small>
                          <small className=" mb-0">
                            <strong>IP público: </strong> {row.ip_recebido}
                          </small>
                          <small className=" mb-0">
                            <strong>Última comunicação: </strong>{" "}
                            {formatDateTime(row.data_recebido)}
                          </small>
                          <small className=" mb-0">
                            <strong>Usuários online: </strong>{" "}
                            {formatInt(row.qtd_online)}
                          </small>
                          <small className=" mb-0">
                            <strong>Usuários cadastrados: </strong>{" "}
                            {formatInt(row.qtd_cadastro)}
                          </small>
                        </div>
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
