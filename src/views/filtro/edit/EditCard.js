// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import classnames from "classnames"

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

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import Nouislider from "nouislider-react"
import "@styles/react/libs/noui-slider/noui-slider.scss"
import wNumb from "wnumb"

// ** API
import api from "@src/services/api"
import { getGenero } from "../store"

// ** Utils
import { formatInt, campoInvalido, mostrarMensagem } from "@utils"

const FiltroEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vGenero, setGenero] = useState(null)
  const [vRespostaCaptive, setRespostaCaptive] = useState(null)
  const [vEstado, setEstado] = useState(null)
  const [vCidade, setCidade] = useState(null)
  const [vCliente, setCliente] = useState(null)

  const [vListaGeneros, setListaGenero] = useState(null)
  const [vListaRespostaCaptive, setListaRespostaCaptive] = useState(null)
  const [vListaEstados, setListaEstados] = useState(null)
  const [vListaCidades, setListaCidades] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const [vAlcance, setAlcance] = useState(null)
  const [vVerificandoAlcance, setVerificandoAlcance] = useState(null)
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [
    { nome: "nome" },
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

  // ** Listagem de gêneros
  const handleGenero = async () => {
    const getGeneros = await getGenero()
    setListaGenero(getGeneros)

    if (vDados.id !== undefined) {
      if (vDados?.genero) {
        const gendersArray = vDados?.genero
          .split(",")
          .map((item) => parseInt(item))

        setGenero(
          gendersArray?.map((item) => {
            const response = getGeneros?.filter((res) => res.value === item)
            if (response) {
              return {
                ...response[0],
                label: response[0]?.label,
                value: response[0]?.value,
              }
            }
          })
        )
      }
    }
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

  // ** Listagem de Estados e cidades
  const getEstados = () => {
    return api.get("/estado").then((res) => {
      const vArrayEstado = res.data.map((ret) => ({
        label: ret.nome,
        value: ret.id,
      }))
      setListaEstados(vArrayEstado)

      //Selecionar o item no componente
      if (data?.estado_id > 0) {
        setEstado(
          vArrayEstado?.filter(
            (item) => item.value === Number(data?.estado_id)
          )[0]
        )
      }
    })
  }

  const getCidades = (e) => {
    return api
      .get(`/cidade/por_estado/${(e ? e.value : data?.estado_id) || 0}`)
      .then((res) => {
        setListaCidades(
          res.data.map((ret) => ({ label: ret.nome, value: ret.id }))
        )
        //Limpar a Cidade para setar o select
        setCidade(null)
      })
  }

  const getPesquisa = () => {
    return api.get("/pesquisa_captive/lista_resposta").then((res) => {
      setListaRespostaCaptive(res.data)

      //Selecionar o item no componente
      if (data?.pesquisa_resposta && true) {
        const vArray = data?.pesquisa_resposta?.split(",").map((item) => item)
        setRespostaCaptive(
          res.data
            ?.filter((item) => vArray?.includes(item.value))
            .map((item) => item)
        )
      }
    })
  }

  const setDados = (somente_validar) => {
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
      if (!somente_validar) {
        setSalvarDados(vDados)
      }
      return true
    } else {
      mostrarMensagem(
        "Atenção!",
        "Preencha todos os campos obrigatórios.",
        "warning"
      )
    }
  }

  const handleAlcance = () => {
    if (setDados(true)) {
      setVerificandoAlcance(true)
      return api
        .post("/filtro/alcance/", vDados)
        .then((res) => {
          setAlcance(res.data)
          setVerificandoAlcance(false)
        })
        .catch(() => {
          setAlcance(null)
          setVerificandoAlcance(false)
        })
    }
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    getEstados()
    handleGenero()
    getClientes()
    getPesquisa()
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
                  onClick={() => navigate("/filtro")}
                >
                  <CornerUpLeft size={17} />
                </Button.Ripple>
              </div>
              <div>
                <Button.Ripple color="success" onClick={() => setDados(false)}>
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
                  <Label className="form-label" for="nome">
                    Nome*
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={vDados?.nome ?? ""}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, vErros, "nome")}
                  />
                </Col>

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="vCliente">
                    Cliente
                  </Label>
                  <Select
                    isClearable
                    noOptionsMessage={() => t("Vazio")}
                    id="vCliente"
                    isDisabled={vDados.id === 0 && data.cliente_id > 0}
                    placeholder={t("Selecione...")}
                    className={classnames("react-select", {
                      "is-invalid": campoInvalido(
                        vDados,
                        vErros,
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

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="genero">
                    Gênero(s) atingidos
                  </Label>
                  <Select
                    isClearable
                    id="genero"
                    isMulti={true}
                    noOptionsMessage={() => t("Vazio")}
                    value={vGenero}
                    placeholder={t("Selecione...")}
                    className="react-select"
                    classNamePrefix="select"
                    options={vListaGeneros}
                    onChange={(e) => (
                      setGenero(e),
                      handleChange({
                        target: {
                          name: "genero",
                          value: e
                            ?.map((item) => item.value.toString())
                            .toString(),
                        },
                      })
                    )}
                  />
                </Col>
                <Col md="6" className="mb-2">
                  <Label
                    className="form-label"
                    style={{ marginBottom: "2.2em" }}
                  >
                    Faixa etária
                  </Label>

                  <Nouislider
                    connect={true}
                    start={
                      vDados?.idade_inicial
                        ? [vDados?.idade_inicial, vDados?.idade_final]
                        : [18, 100]
                    }
                    step={1}
                    tooltips={true}
                    style={{ zIndex: 0 }}
                    format={wNumb({
                      decimals: 0,
                    })}
                    behaviour={"tap"}
                    direction="ltr"
                    range={{
                      min: 18,
                      max: 100,
                    }}
                    onChange={(e) => {
                      handleChange({
                        target: {
                          name: "idade_inicial",
                          value: Number(e[0]),
                        },
                      })
                      handleChange({
                        target: {
                          name: "idade_final",
                          value: Number(e[1]),
                        },
                      })
                    }}
                  />
                </Col>
                <Col md="6" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="retornante"
                      checked={vDados?.retornante ?? false}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "retornante",
                            value: e.target.checked,
                          },
                        })
                      }}
                    />
                    <Label for="retornante" className="form-check-label mt-25">
                      Somente usuário retornante (a partir da segunda visita)
                    </Label>
                  </div>
                </Col>
                <Col md="6" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="online"
                      checked={vDados?.online ?? false}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: "online",
                            value: e.target.checked,
                          },
                        })
                      }}
                    />
                    <Label for="online" className="form-check-label mt-25">
                      Somente usuário online no momento
                    </Label>
                  </div>
                </Col>
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="genero">
                    Atingir somente usuários que selecionaram uma ou mais opções
                    abaixo na pesquisa do captive portal
                  </Label>
                  <Select
                    isClearable
                    id="pesquisa_resposta"
                    isMulti={true}
                    noOptionsMessage={() => t("Vazio")}
                    value={vRespostaCaptive}
                    placeholder={t("Selecione...")}
                    className="react-select"
                    classNamePrefix="select"
                    options={vListaRespostaCaptive}
                    onChange={(e) => (
                      setRespostaCaptive(e),
                      handleChange({
                        target: {
                          name: "pesquisa_resposta",
                          value: e
                            ?.map((item) => item.value.toString())
                            .toString(),
                        },
                      })
                    )}
                  />
                </Col>
                <Col lg="12">
                  <Row>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="vEstado">
                        Selecione o Estado para listar as cidades
                      </Label>
                      <Select
                        isClearable
                        id="vEstado"
                        placeholder={t("Selecione...")}
                        className="react-select"
                        noOptionsMessage={() => t("Vazio")}
                        classNamePrefix="select"
                        value={vEstado}
                        onChange={(e) => {
                          setEstado(e)
                          handleChange({
                            target: { name: "estado_id", value: e?.value },
                          })
                          getCidades(e)
                          handleChange({
                            target: { name: "cidades", value: null },
                          })
                        }}
                        options={vListaEstados}
                      />
                    </Col>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="vCidade">
                        Cidades atingidas
                      </Label>
                      <Select
                        id="vCidade"
                        noOptionsMessage={() => t("Vazio")}
                        LoadingMessage={() => "pesquisando..."}
                        placeholder={t("Selecione...")}
                        mess
                        isMulti={true}
                        isClearable
                        className="react-select"
                        classNamePrefix="select"
                        isDisabled={(vDados?.estado_id ?? 0) === 0}
                        value={
                          vDados.cidades
                            ? vDados.cidades.map((i) => ({
                                label: i.nome,
                                value: i.id,
                              }))
                            : vCidade
                        }
                        onChange={(e) => {
                          setCidade(e)
                          handleChange({
                            target: {
                              name: "cidades",
                              value: e?.map((item) => ({
                                id: item.value,
                                nome: item.label,
                              })),
                            },
                          })
                        }}
                        options={vListaCidades}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Label className="form-label">
                      Usuários que utilizaram o App em um período
                    </Label>
                    <Col className="mb-2">
                      <Label className="form-label" for="app-data-inicial">
                        Data inicial
                      </Label>
                      <Input
                        id="app-data-inicial"
                        name="app-data-inicial"
                        type="date"
                        value={vDados?.app_data_inicial ?? ""}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "app_data_inicial",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col className="mb-2">
                      <Label className="form-label" for="app-data-final">
                        Data final
                      </Label>
                      <Input
                        id="app-data-final"
                        name="app-data-final"
                        type="date"
                        value={vDados?.app_data_final ?? ""}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "app_data_final",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Label className="form-label">
                      Usuários que visitaram seu estabelecimento em um período
                    </Label>
                    <Col className="mb-2">
                      <Label className="form-label" for="visita-data-inicial">
                        Data inicial
                      </Label>
                      <Input
                        id="visita-data-inicial"
                        name="visita-data-inicial"
                        type="date"
                        value={vDados?.visita_data_inicial ?? ""}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "visita_data_inicial",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col className="mb-2">
                      <Label className="form-label" for="visita-data-final">
                        Data final
                      </Label>
                      <Input
                        id="visita-data-final"
                        name="visita-data-final"
                        type="date"
                        value={vDados?.visita_data_final ?? ""}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "visita_data_final",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Fragment>
        </Card>
      </Col>

      <Col md="4" className="offset-md-4">
        <Card className="text-center mb-3">
          <CardBody>
            <CardTitle tag="h4">Usuários alcançados</CardTitle>
            <CardText>
              {!vVerificandoAlcance ? (
                vAlcance ? (
                  <Fragment>
                    <h6>
                      {formatInt(vAlcance?.sem_app)} Usuário
                      {vAlcance?.sem_app !== 1 ? "s" : ""}
                    </h6>
                  </Fragment>
                ) : null
              ) : (
                <Spinner type="grow" size="sm" color="primary" />
              )}
            </CardText>
            <Button onClick={handleAlcance} color="primary" outline>
              Verificar
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default FiltroEditCard
