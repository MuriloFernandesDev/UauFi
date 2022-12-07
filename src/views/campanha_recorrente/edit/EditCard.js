// ** React
import { useEffect, useState, Fragment } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Label,
  ButtonGroup,
  Alert,
  CardBody,
} from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"
import classnames from "classnames"

// ** Utils
import { campoInvalido, mostrarMensagem, formatMoeda, formatInt } from "@utils"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { getClientes, getTipos } from "../store"

const CampanhaRecorrenteEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  // Captive Portal
  const [vDadosCR, setDataCR] = useState(data?.campanha_recorrente)
  const [vCliente, setCliente] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const [vTipo, setTipo] = useState(null)
  const [vListaTipo, setListaTipo] = useState(null)
  const vListaFrequencia = [
    {
      label: "Todos os dias, enviar para os aniversariantes do dia",
      value: "day",
    },
    {
      label: "No domingo, enviar para todos aniversariantes da semana",
      value: "week",
    },
    {
      label: "No dia 1º de cada mês, enviar para todos aniversariantes do mês",
      value: "month",
    },
  ]
  const [vFrequencia, setFrequencia] = useState(
    vListaFrequencia.filter(
      (item) => item.value === data?.campanha_recorrente?.frequencia
    )[0]
  )
  const [vErros, setErros] = useState({})
  const [vErrosCR, setErrosCR] = useState({})
  const vCamposObrigatorios = [
    { nome: "cliente_id", tipo: "int" },
    { nome: "campanha_recorrente_tipo_id", tipo: "int" },
  ]

  const vCamposObrigatoriosCR = [{ nome: "titulo" }, { nome: "mensagem" }]

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleChangeCR = (e) => {
    const { name, value } = e.target
    setDataCR((prevState) => ({
      ...prevState,
      [name]: value,
    }))
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

  const handleTipos = () => {
    getTipos().then((res) => {
      const TiposVar = res
      setListaTipo(
        TiposVar.map((ret) => ({
          label: ret.nome,
          value: ret.id,
          codigo: ret.codigo,
          cor: ret.cor,
          descricao: ret.descricao,
        }))
      )

      if (vDados?.id !== undefined) {
        TiposVar?.map((res) => {
          if (res.id === vDados.campanha_recorrente_tipo_id) {
            setTipo({
              label: res.nome,
              value: res.id,
              codigo: res.codigo,
              cor: res.cor,
              descricao: res.descricao,
            })
          }
        })
      }
    })
  }

  const setDados = () => {
    let vCamposOK = true
    vCamposObrigatorios.forEach((campo) => {
      if (campoInvalido(vDados, null, campo.nome, campo.tipo)) {
        vCamposOK = false
        setErros((ant) => ({
          ...ant,
          [campo.nome]: {},
        }))
      }
    })

    vCamposObrigatoriosCR.forEach((campo) => {
      if (campoInvalido(vDadosCR, null, campo.nome, campo.tipo)) {
        vCamposOK = false
        setErrosCR((ant) => ({
          ...ant,
          [campo.nome]: {},
        }))
      }
    })

    if (vCamposOK) {
      vDados.campanha_recorrente = vDadosCR
      setSalvarDados(vDados)
    } else {
      mostrarMensagem(
        "Atenção!",
        "Preencha todos os campos obrigatórios.",
        "warning"
      )
    }
  }

  useEffect(() => {
    // ** Requisitar listas
    handleClientes()
    handleTipos()
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm="12">
          <Card className="mb-1">
            <div className="d-flex justify-content-between flex-row m-1">
              <div>
                <Button.Ripple
                  color="primary"
                  onClick={() => navigate("/campanha_recorrente")}
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
                <Label className="form-label" for="titulo">
                  Título da campanha*
                </Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={vDadosCR?.titulo ?? ""}
                  onChange={handleChangeCR}
                  invalid={campoInvalido(vDadosCR, vErrosCR, "titulo")}
                />
              </Col>
              <Col md="3" className="mb-2">
                <Label className="form-label" for="mensagem">
                  Tipo de mensagem
                </Label>
                <div>
                  <ButtonGroup>
                    <Button
                      color="primary"
                      onClick={() =>
                        handleChangeCR({
                          target: {
                            name: "tipo",
                            value: "sms",
                          },
                        })
                      }
                      active={(vDadosCR?.tipo ?? "sms") === "sms"}
                      outline
                    >
                      SMS
                    </Button>
                    <Button
                      color="primary"
                      onClick={() =>
                        handleChangeCR({
                          target: {
                            name: "tipo",
                            value: "push",
                          },
                        })
                      }
                      active={(vDadosCR?.tipo ?? "sms") === "push"}
                      outline
                    >
                      Push (App)
                    </Button>
                  </ButtonGroup>
                </div>
              </Col>
              <Col md="5" className="mb-2">
                <Label className="form-label" for="cliente_id">
                  Selecione um Cliente*
                </Label>
                <Select
                  isClearable
                  id="cliente_id"
                  noOptionsMessage={() => t("Vazio")}
                  placeholder={t("Selecione...")}
                  value={vCliente}
                  options={vListaClientes}
                  isDisabled={vDados.id === 0 && data.cliente_id > 0}
                  className={classnames("react-select", {
                    "is-invalid": campoInvalido(
                      vDados,
                      vErros,
                      "cliente_id",
                      "int"
                    ),
                  })}
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
              <Col md="5" className="mb-2">
                <Label className="form-label" for="campanha_recorrente_tipo_id">
                  Tipo de campanha recorrente*
                </Label>
                <Select
                  isClearable
                  id="campanha_recorrente_tipo_id"
                  noOptionsMessage={() => t("Vazio")}
                  placeholder={t("Selecione...")}
                  value={vTipo}
                  options={vListaTipo}
                  className={classnames("react-select", {
                    "is-invalid": campoInvalido(
                      vDados,
                      vErros,
                      "campanha_recorrente_tipo_id",
                      "int"
                    ),
                  })}
                  classNamePrefix="select"
                  onChange={(e) => {
                    setTipo(e)
                    handleChange({
                      target: {
                        name: "campanha_recorrente_tipo_id",
                        value: e?.value,
                      },
                    })
                  }}
                />
              </Col>
              {vTipo &&
              vTipo?.codigo !== "checkout" &&
              vTipo?.codigo !== "welcome" &&
              vTipo?.codigo !== "welcomeback" ? (
                <Col md="2" className="mb-2">
                  <Label className="form-label" for="hora">
                    Horário do envio
                  </Label>
                  <Input
                    id="hora"
                    name="hora"
                    type="time"
                    value={vDadosCR?.hora ?? ""}
                    onChange={handleChangeCR}
                  />
                </Col>
              ) : null}
              {vTipo?.codigo === "birthday" ? (
                <Col md="5" className="mb-2">
                  <Label className="form-label" for="frequencia">
                    Frequência de envio
                  </Label>
                  <Select
                    isClearable
                    id="frequencia"
                    noOptionsMessage={() => t("Vazio")}
                    placeholder={t("Selecione...")}
                    value={vFrequencia}
                    options={vListaFrequencia}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(e) => {
                      setFrequencia(e)
                      handleChangeCR({
                        target: {
                          name: "frequencia",
                          value: e?.value,
                        },
                      })
                    }}
                  />
                </Col>
              ) : null}
              {vTipo ? (
                <Col md="12">
                  <Alert
                    color={vTipo?.cor ?? "primary"}
                    isOpen={vTipo && true}
                    className="p-1"
                  >
                    <span>
                      <strong>{vTipo?.label}</strong>
                      <br />
                      {vTipo?.descricao}
                    </span>
                  </Alert>
                </Col>
              ) : null}
              <Col md="12" className="mb-1">
                <Label className="form-label" for="mensagem">
                  Mensagem*
                </Label>
                <Input
                  value={vDadosCR?.mensagem ?? ""}
                  type="textarea"
                  id="mensagem"
                  name="mensagem"
                  invalid={campoInvalido(vDadosCR, vErrosCR, "mensagem")}
                  style={{ minHeight: "80px" }}
                  onChange={handleChangeCR}
                  className={classnames({
                    "text-danger": (vDadosCR?.mensagem?.length || 0) > 140,
                  })}
                />
                <span
                  className={classnames("textarea-counter-value float-end", {
                    "bg-danger": (vDadosCR?.mensagem?.length || 0) > 140,
                  })}
                >
                  {`${vDadosCR?.mensagem?.length || 0}/140`}
                </span>
              </Col>
              <Col md="4" className="mb-2">
                <div className="form-check form-switch">
                  <Input
                    type="switch"
                    id="ativo"
                    checked={vDados?.ativo ?? false}
                    disabled={vDados.enviado}
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
            </Row>
          </Card>
        </Col>
      </Row>
      {vDados?.qtd > 0 ? (
        <Row>
          <Col md="6" className="offset-md-3">
            <Card>
              <h4 className="text-center p-2">Informações sobre o envio</h4>
              <CardBody>
                <div className="transaction-item mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="transaction-title">Valor total</h6>
                    </div>
                    <div className="fw-bolder text-secondary text-end">
                      {formatMoeda(vDados.total_gasto ?? 0)}
                    </div>
                  </div>
                </div>
                <div className="transaction-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="transaction-title">Usuários atingidos</h6>
                    </div>
                    <div className="fw-bolder text-success text-end">
                      {formatInt(vDados.qtd ?? 0)}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  )
}

export default CampanhaRecorrenteEditCard
