// ** React
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, ButtonGroup } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check, DollarSign } from "react-feather"
import classnames from "classnames"

// ** Utils
import { campoInvalido, mostrarMensagem } from "@utils"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { getClientes } from "../store"

const CampanhaRecorrenteEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vCliente, setCliente] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const vListaFrequencia = [
    { label: "Diariamente", value: "day" },
    { label: "Uma vez por semana (domingo)", value: "week" },
    { label: "Uma vez por mês (dia 1º)", value: "month" },
  ]
  const [vFrequencia, setFrequencia] = useState(null)
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [
    { nome: "titulo" },
    { nome: "clientes" },
    { nome: "mensagem" },
  ]

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleClientes = () => {
    getClientes().then((res) => {
      setListaClientes(res)

      //Selecionar o item no componente
      if (data?.clientes) {
        const vClienteArray = data?.clientes
          ?.split(",")
          .map((item) => parseInt(item))
        setCliente(
          res.data?.filter((item) => vClienteArray?.includes(item.value))
        )
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

    if (vCamposOK) {
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
  }, [])

  return (
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
            <Col md="6" className="mb-2">
              <Label className="form-label" for="titulo">
                Título da campanha*
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={vDados?.titulo ?? ""}
                onChange={handleChange}
                invalid={campoInvalido(vDados, vErros, "titulo")}
              />
            </Col>
            <Col md="6" className="mb-2">
              <Label className="form-label" for="mensagem">
                Tipo de mensagem
              </Label>
              <div>
                <ButtonGroup>
                  <Button
                    color="primary"
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "tipo",
                          value: "sms",
                        },
                      })
                    }
                    active={(vDados.tipo ?? "sms") === "sms"}
                    outline
                  >
                    SMS
                  </Button>
                  <Button
                    color="primary"
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "tipo",
                          value: "push",
                        },
                      })
                    }
                    active={(vDados.tipo ?? "sms") === "push"}
                    outline
                  >
                    Push (App)
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
            <Col md="6" className="mb-2">
              <Label className="form-label" for="cliente_id">
                Selecione o(s) Cliente(s)*
              </Label>
              <Select
                isClearable
                id="clientes"
                noOptionsMessage={() => t("Vazio")}
                isMulti
                placeholder={""}
                className={classnames("react-select", {
                  "is-invalid": campoInvalido(vDados, vErros, "clientes"),
                })}
                classNamePrefix="select"
                value={vCliente}
                onChange={(e) => {
                  setCliente(e)
                  handleChange({
                    target: {
                      name: "clientes",
                      value: e?.map((item) => item.value.toString()).toString(),
                    },
                  })
                }}
                options={vListaClientes}
              />
            </Col>
            <Col md="6" className="mb-2">
              <Label className="form-label" for="frequencia">
                Frequência
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
                  handleChange({
                    target: {
                      name: "frequencia",
                      value: e?.value,
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
                invalid={campoInvalido(vDados, vErros, "mensagem")}
                style={{ minHeight: "80px" }}
                disabled={vDados.enviado}
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

            {vDados?.ativo ? (
              <Col md="8" className="mb-2">
                <Label className="form-label" for="data_hora_agendamento">
                  Escolha a data e hora que a campanha será enviada
                </Label>
                <Input
                  id="data_hora_agendamento"
                  name="data_hora_agendamento"
                  type="datetime-local"
                  disabled={vDados.enviado}
                  value={vDados?.data_hora_agendamento ?? ""}
                  onChange={handleChange}
                />
              </Col>
            ) : null}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default CampanhaRecorrenteEditCard
