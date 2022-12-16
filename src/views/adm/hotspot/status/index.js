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

import { Link } from "react-router-dom"

import StatsHorizontal from "@components/widgets/stats/StatsHorizontal"

import classnames from "classnames"

// ** Store & Actions
import { getHotspotStatus } from "../store"

// ** Utils
import { formatDateTime, formatInt, mostrarMensagem } from "@utils"

// ** Icons Imports
import { Eye, MoreVertical, User, Wifi, WifiOff } from "react-feather"

// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const UsuarioOnline = () => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const vTimeoutPesquisa = useRef()

  const getDados = (tempo) => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    vTimeoutPesquisa.current = setTimeout(() => {
      setCarregando(true)
      return getHotspotStatus()
        .then((res) => {
          setCarregando(false)
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
        <Col md="4" className="offset-md-4">
          <StatsHorizontal
            color="primary"
            statTitle={
              vCarregando
                ? "Verificando..."
                : `Hotspot${vDados?.length !== 1 ? "s" : ""}`
            }
            icon={<Wifi size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {vCarregando ? (
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />{" "}
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
                    <Card>
                      <CardHeader
                        className={classnames("p-1", {
                          "bg-danger": !row.online,
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
                                  className={classnames("cursor-pointer", {
                                    "text-white": !row.online,
                                  })}
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
                                tag="h4"
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
