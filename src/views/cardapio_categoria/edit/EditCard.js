// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import classnames from "classnames"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Utils
import { campoInvalido, mostrarMensagem } from "@utils"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { getClientes } from "../store"

const CardapioCategoriaEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaCliente, setListaClientes] = useState(null)
  const [vCliente, setCliente] = useState(null)
  const [vErros, setErros] = useState({})

  const vCamposObrigatorios = [
    { nome: "titulo" },
    { nome: "cliente_id", tipo: "int" },
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

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    handleClientes()
  }, [])

  return (
    <Row>
      <Col sm="12">
        <Fragment>
          <Card className="mb-1">
            <div className="d-flex justify-content-between flex-row m-1">
              <div>
                <Button.Ripple
                  color="primary"
                  onClick={() => navigate("/cardapio_categoria")}
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
        </Fragment>
      </Col>
      <Col sm="12">
        <Card className="p-2 pb-0">
          <Fragment>
            <Card className="mb-0">
              <Row>
                <Col md="6" className="mb-2">
                  <Label className="form-label" for="quarto">
                    Título*
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
                  <Label className="form-label" for="cliente_id">
                    Selecione um Cliente*
                  </Label>
                  <Select
                    isClearable
                    id="cliente_id"
                    noOptionsMessage={() => t("Vazio")}
                    placeholder={t("Selecione...")}
                    value={vCliente}
                    options={vListaCliente}
                    isDisabled={
                      (vDados.id === 0 && data.cliente_id > 0) || vDados.enviado
                    }
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
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="descricao">
                    Descrição
                  </Label>
                  <Input
                    value={vDados?.descricao ?? ""}
                    type="textarea"
                    id="descricao"
                    name="descricao"
                    style={{ minHeight: "100px" }}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="ativo"
                      checked={vDados?.ativo}
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
                      Categoria {vDados?.ativo ? "ativada" : "desativada"}
                    </Label>
                  </div>
                </Col>
              </Row>
            </Card>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default CardapioCategoriaEditCard
