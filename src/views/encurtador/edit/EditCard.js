// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"
import { campoInvalido, mostrarMensagem } from "@utils"
import { useForm } from "react-hook-form"
import classnames from "classnames"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"

// ** API
import api from "@src/services/api"

const EncurtadorEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()
  const {
    setError,
    formState: { errors },
  } = useForm()

  const vCamposObrigatorios = [
    { nome: "descricao" },
    { nome: "url_redirect" },
    { nome: "cliente_id", tipo: "int" },
  ]

  // ** States
  const [vDados, setData] = useState(data)
  const [vCliente, setCliente] = useState(null)

  const [vListaClientes, setListaClientes] = useState(null)

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const getClientes = () => {
    return api.get("/cliente/lista_simples").then((res) => {
      setListaClientes(res.data)

      //Selecionar o item no componente
      if (data?.cliente_id) {
        setCliente(
          res.data?.filter((item) => item.value === Number(data?.cliente_id))[0]
        )
      }
    })
  }

  const setDados = () => {
    let vCamposOK = true
    vCamposObrigatorios.forEach((campo) => {
      if (campoInvalido(vDados, null, campo.nome, campo.tipo)) {
        vCamposOK = false
        setError(campo.nome, {
          type: "manual",
        })
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
    getClientes()
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
                  onClick={() => navigate("/encurtador")}
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
                  <Label className="form-label" for="descricao">
                    Nome/Descrição*
                  </Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={vDados?.descricao ?? ""}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, errors, "descricao")}
                  />
                </Col>

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="cliente_id">
                    Cliente*
                  </Label>
                  <Select
                    isClearable
                    noOptionsMessage={() => t("Vazio")}
                    id="cliente_id"
                    isDisabled={vDados.id === 0 && data.cliente_id > 0}
                    placeholder={t("Selecione...")}
                    className={classnames("react-select", {
                      "is-invalid": campoInvalido(
                        vDados,
                        errors,
                        "cliente_id",
                        "int"
                      ),
                    })}
                    classNamePrefix="select"
                    value={vCliente}
                    onChange={(e) => {
                      setCliente(e)
                      handleChange({
                        target: { name: "cliente_id", value: e?.value },
                      })
                    }}
                    options={vListaClientes}
                  />
                </Col>
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="url_redirect">
                    URL*
                  </Label>
                  <Input
                    id="url_redirect"
                    name="url_redirect"
                    type="url"
                    value={vDados?.url_redirect ?? ""}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, errors, "url_redirect")}
                  />
                </Col>
              </Row>
            </Card>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default EncurtadorEditCard
