// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Label,
  CardBody,
  CardTitle,
  CardText,
  Spinner,
} from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"
import toast from "react-hot-toast"
import classnames from "classnames"

import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.br"

// ** Terceiros
import Select from "react-select"
import { getClientes, getFiltros, testarCampanha } from "../store"

const CampanhaAgendadaEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaCliente, setListaClientes] = useState(null)
  const [vCliente, setCliente] = useState(null)
  const [vListaFiltros, setListaFiltros] = useState(null)
  const [vFiltro, setFiltro] = useState(null)
  const [vNumeroTeste, setNumeroTeste] = useState(null)
  const [vTestando, setTestando] = useState(false)

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFiltros = () => {
    getFiltros().then((res) => {
      const FiltrosVar = res
      setListaFiltros(FiltrosVar)

      if (vDados?.id !== undefined) {
        FiltrosVar?.map((res) => {
          if (res.value === vDados.filtro_id) {
            setFiltro({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const handleTestarSMS = () => {
    setTestando(true)
    return testarCampanha({
      para: vNumeroTeste,
      mensagem: vDados.mensagem,
    })
      .then((response) => {
        setTestando(false)
        if (response.status === 200) {
          toast.success("Teste enviado com sucesso!", {
            position: "bottom-right",
          })
        }
      })
      .catch((error) => {
        setTestando(false)
        if (error.response.status === 400) {
          toast.error("Preencha todos os campos corretamente.", {
            position: "bottom-right",
          })
        } else if (error.response.status === 503) {
          toast.error(error.response.data, {
            position: "bottom-right",
          })
        } else {
          toast.error("Mensagem não enviada, contate um administrador.", {
            position: "bottom-right",
          })
        }
      })
  }

  const handleClientes = () => {
    getClientes().then((res) => {
      setListaClientes(res)

      if (vDados?.id !== undefined) {
        res?.map((res) => {
          if (res.value === vDados.cliente_id) {
            setCliente({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const setDados = () => {
    setSalvarDados(vDados)
  }

  const optTel = { phone: true, phoneRegionCode: "BR" }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    handleClientes()
    handleFiltros()
  }, [])

  return (
    <Row>
      <Col sm="12">
        <Card className="mb-1">
          <div className="d-flex justify-content-between flex-row m-1">
            <div>
              <Button.Ripple
                color="primary"
                onClick={() => navigate("/campanha_agendada")}
              >
                <CornerUpLeft size={17} />
              </Button.Ripple>
            </div>
            <div>
              <Button.Ripple color="success" onClick={setDados}>
                <Check size={17} />
                <span className="align-middle ms-25">Salvar</span>
              </Button.Ripple>
            </div>
          </div>
        </Card>
      </Col>
      <Col sm="12">
        <Card className="p-2 pb-0">
          <Row>
            <Col md="4" className="mb-2">
              <Label className="form-label" for="nome">
                Nome da campanha
              </Label>
              <Input
                id="nome"
                name="nome"
                value={vDados?.nome ?? ""}
                onChange={handleChange}
              />
            </Col>

            <Col md="4" className="mb-2">
              <Label className="form-label" for="cliente_id">
                Selecione um Cliente
              </Label>
              <Select
                isClearable
                id="cliente_id"
                noOptionsMessage={() => "Vazio"}
                placeholder={"Selecione..."}
                value={vCliente}
                options={vListaCliente}
                isDisabled={vDados.id === 0 && data.cliente_id > 0}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => {
                  setCliente(e)
                  handleChange({
                    target: {
                      name: "cliente_id",
                      value: Number(e?.value),
                    },
                  })
                }}
              />
            </Col>
            <Col md="4" className="mb-2">
              <Label className="form-label" for="filtro_id">
                Filtro
              </Label>
              <Select
                isClearable
                id="filtro_id"
                noOptionsMessage={() => "Vazio"}
                placeholder={"Selecione..."}
                value={vFiltro}
                options={vListaFiltros}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => {
                  setFiltro(e)
                  handleChange({
                    target: {
                      name: "filtro_id",
                      value: Number(e?.value),
                    },
                  })
                }}
              />
            </Col>
            <Col md="12" className="mb-2">
              <Label className="form-label" for="mensagem">
                Mensagem*
              </Label>
              <Input
                value={vDados?.mensagem ?? ""}
                type="textarea"
                id="mensagem"
                name="mensagem"
                style={{ minHeight: "80px" }}
                onChange={handleChange}
                className={classnames({
                  "text-danger": (vDados?.mensagem?.length || 0) > 140,
                })}
              />
              <span
                className={classnames("textarea-counter-value float-end", {
                  "bg-danger": (vDados?.mensagem?.length || 0) > 140,
                })}
              >
                {`${vDados?.mensagem?.length || 0}/140`}
              </span>
            </Col>
            <Col md="4" className="mb-2 pt-md-2">
              <div className="form-check form-switch pt-md-75">
                <Input
                  type="switch"
                  id="ativo"
                  checked={vDados?.ativo ?? false}
                  onChange={(e) => {
                    handleChange({
                      target: {
                        name: "ativo",
                        value: e.target.checked,
                      },
                    })
                  }}
                />
                <Label for="ativo" className="form-check-label mt-25">
                  Campanha {vDados?.ativo ? "ativada" : "desativada"}
                </Label>
              </div>
            </Col>

            {vDados?.ativo ? (
              <Col md="8" className="mb-2">
                <Label className="form-label" for="data_hora_agendamento">
                  Escolha a data e hora que a campanha será enviada
                </Label>
                <Input
                  id="data_hora_agendamento"
                  name="data_hora_agendamento"
                  type="datetime-local"
                  value={vDados?.data_hora_agendamento ?? ""}
                  onChange={handleChange}
                />
              </Col>
            ) : null}
          </Row>
        </Card>
      </Col>

      <Col md="6" className="offset-md-3">
        <Card className="text-center">
          <CardBody>
            <CardTitle tag="h4">Testar campanha</CardTitle>
            <Row>
              <h6>*Será enviado para o número descrito como um teste</h6>
              <Col lg="6" className="mb-2 offset-lg-3">
                <Label className="form-label" for="vNumeroTeste">
                  Número do celular com o ddd
                </Label>
                <Cleave
                  className="form-control"
                  placeholder="00 00000 0000"
                  options={optTel}
                  id="whatsapp"
                  name="whatsapp"
                  value={vNumeroTeste ?? ""}
                  onChange={(e) => setNumeroTeste(e.target.value)}
                />
              </Col>
              <Col md="12">
                {vTestando ? (
                  <Spinner color="primary" />
                ) : (
                  <Button onClick={handleTestarSMS} color="primary" outline>
                    Enviar
                  </Button>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default CampanhaAgendadaEditCard
