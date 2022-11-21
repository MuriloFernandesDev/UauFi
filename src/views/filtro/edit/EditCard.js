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
import { formatInt, formatMoeda } from "@utils"

const FiltroEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vGenero, setGenero] = useState(null)
  const [vEstado, setEstado] = useState(null)
  const [vCidade, setCidade] = useState(null)
  const [vCliente, setCliente] = useState(null)

  const [vListaGeneros, setListaGenero] = useState(null)
  const [vListaEstados, setListaEstados] = useState(null)
  const [vListaCidades, setListaCidades] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const [vAlcance, setAlcance] = useState(null)
  const [vVerificandoAlcance, setVerificandoAlcance] = useState(null)

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

  const handleAlcance = () => {
    setVerificandoAlcance(true)
    return api
      .post("/filtro/alcance", vDados)
      .then((res) => {
        setAlcance(res.data)
        setVerificandoAlcance(false)
      })
      .catch(() => {
        setAlcance(null)
        setVerificandoAlcance(false)
      })
  }

  // ** Listagem de Estados e cidades
  const getEstados = () => {
    return api.get("/estado").then((res) => {
      setListaEstados(
        res.data.map((ret) => ({ label: ret.nome, value: ret.id }))
      )

      //Limpar o estado para setar o select
      setEstado(null)
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

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    if (vListaEstados === null) {
      getEstados()
      handleGenero()
    }
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
                  onClick={() => navigate("/filtro")}
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
                  <Label className="form-label" for="nome">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    disabled={vDados.id > 0}
                    name="nome"
                    value={vDados?.nome ?? ""}
                    onChange={handleChange}
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
                    className="react-select"
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
                    isDisabled={vDados?.id > 0}
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
                    disabled={vDados.id > 0}
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

                <Col lg="12">
                  <Row>
                    {!vDados.id ? (
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
                    ) : (
                      ""
                    )}
                    <Col md={vDados.id ? "12" : "6"} className="mb-2">
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
                        isDisabled={
                          vDados?.id > 0 || (vDados?.estado_id ?? 0) === 0
                        }
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
                        disabled={vDados.id > 0}
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
                        disabled={vDados.id > 0}
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
                        disabled={vDados.id > 0}
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
                        disabled={vDados.id > 0}
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
                    <h6>{formatInt(vAlcance?.com_app)} Usuário(s) com app</h6>
                    <h6>{formatInt(vAlcance?.sem_app)} Usuário(s) sem app</h6>
                    <h6>
                      {formatInt(
                        (vAlcance.sem_app ?? 0) + (vAlcance.com_app ?? 0)
                      )}{" "}
                      Usuário(s) no total
                    </h6>
                    <h6>{formatMoeda(vAlcance.valor)} será o valor gasto</h6>
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
