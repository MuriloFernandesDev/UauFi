// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import Nouislider from "nouislider-react"
import "@styles/react/libs/noui-slider/noui-slider.scss"
import wNumb from "wnumb"

// ** API
import api from "@src/services/api"
import { getGenero } from "../store"

const FiltroEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [genero, setGenero] = useState(null)
  const [selectedGenero, setSelectedGenero] = useState(null)
  const [vEstado, setEstado] = useState(null)
  const [vCidade, setCidade] = useState(null)
  const [vListaEstados, setListaEstados] = useState(null)
  const [vListaCidades, setListaCidades] = useState(null)
  const [upperConnect, setUpperConnect] = useState(18)
  const [lowerConnect, setLowerConnect] = useState(100)
  const [appDataInicial, setAppDataInicial] = useState("")
  const [appDataFinal, setAppDataFinal] = useState("")
  const [visitaDataInicial, setVisitaDataInicial] = useState("")
  const [visitaDataFinal, setVisitaDataFinal] = useState("")

  const [clienteId, setClienteId] = useState(0)

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
    setGenero(getGeneros)

    if (vDados.id !== undefined) {
      const gendersArray = vDados?.genero
        .split(",")
        .map((item) => parseInt(item))

      setSelectedGenero(
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

  // ** Bloquear ações de onChange
  const blockChange = () => {}

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
    if (vDados.id !== undefined) {
      setAppDataInicial(vDados.app_data_inicial.substring(0, 10))
      setAppDataFinal(vDados.app_data_final.substring(0, 10))
      setVisitaDataInicial(vDados.visita_data_inicial.substring(0, 10))
      setVisitaDataFinal(vDados.visita_data_final.substring(0, 10))
    }
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
                  onClick={() => navigate("/plano")}
                >
                  <CornerUpLeft size={17} />
                </Button.Ripple>
              </div>
              {vDados.id !== undefined ? (
                ""
              ) : (
                <div>
                  <Button.Ripple color="success" onClick={setDados}>
                    <Check size={17} />
                    <span className="align-middle ms-25">Salvar</span>
                  </Button.Ripple>
                </div>
              )}
            </div>
          </Card>
        </Fragment>
      </Col>
      <Col sm="12">
        <Card className="p-2 pb-0">
          <Fragment>
            <Card className="mb-0">
              <Row>
                <Col lg="12">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="nome">
                        Nome da campanha
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={vDados?.nome ?? ""}
                        onChange={
                          vDados.id !== undefined ? blockChange : handleChange
                        }
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="genero">
                        Gêneros atingidos pela campanha
                      </Label>
                      <Select
                        isClearable
                        id="genero"
                        isMulti={true}
                        value={selectedGenero}
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        options={genero}
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => (
                                setSelectedGenero(e),
                                handleChange({
                                  target: {
                                    name: "genero",
                                    value: e
                                      ?.map((item) => item.value.toString())
                                      .toString(),
                                  },
                                })
                              )
                        }
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12" style={{ marginBottom: "2em" }}>
                  <Row>
                    <Label
                      className="form-label"
                      style={{ marginBottom: "2em" }}
                    >
                      Faixa etária atingida pela campanha
                    </Label>
                    <Col>
                      <Nouislider
                        connect={true}
                        start={
                          vDados?.idade_inicial
                            ? [vDados?.idade_inicial, vDados?.idade_final]
                            : [upperConnect, lowerConnect]
                        }
                        step={1}
                        disabled={vDados.id !== undefined}
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
                          setUpperConnect(e[0])
                          setLowerConnect(e[1])
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
                  </Row>
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
                          placeholder={"Selecione..."}
                          className="react-select"
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
                        Cidades atingidas pela campanha
                      </Label>
                      <Select
                        id="vCidade"
                        noOptionsMessage={() => "vazio"}
                        LoadingMessage={() => "pesquisando..."}
                        placeholder={"Selecione..."}
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
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => {
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
                              }
                        }
                        options={vListaCidades}
                      />
                      {console.log(vCidade, vDados.cidades)}
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Label className="form-label">
                      {vDados.id !== undefined
                        ? "Em caso de campanha Push: período em que o usuário se conectou no App"
                        : "Vai enviar Push? Selecione o período em que o usuário se conectou no App"}
                    </Label>
                    <Col className="mb-2">
                      <Label className="form-label" for="app-data-inicial">
                        Data inicial
                      </Label>
                      <Input
                        id="app-data-inicial"
                        name="app-data-inicial"
                        type="date"
                        value={appDataInicial}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setAppDataInicial(e.target.value)
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
                        value={appDataFinal}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setAppDataFinal(e.target.value)
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
                        value={visitaDataInicial}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setVisitaDataInicial(e.target.value)
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
                        value={visitaDataFinal}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setVisitaDataFinal(e.target.value)
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
                <Col lg="4">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="cliente-id">
                        ID do cliente
                      </Label>
                      <Input
                        id="cliente-id"
                        name="cliente-id"
                        type="number"
                        style={{ marginBottom: "20px" }}
                        value={clienteId}
                        onChange={(e) => {
                          setClienteId(e.target.value)
                          handleChange({
                            target: {
                              name: "cliente_id",
                              value: Number(e.target.value),
                            },
                          })
                          {
                          }
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
    </Row>
  )
}

export default FiltroEditCard
