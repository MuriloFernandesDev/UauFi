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
import { getHotspot } from "../store"

// ** API
// import api from "@src/services/api"

const EventoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [hotspots, setHotspots] = useState(null)
  const [nome, setNome] = useState("")
  const [download, setDownload] = useState("")
  const [upload, setUpload] = useState("")
  const [tempoConexão, setTempoConexão] = useState("")
  const [ativo, setAtivo] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [selectedUnidade, setSelectedUnidade] = useState(null)
  const [selectedTipoAcesso, setSelectedTipoAcesso] = useState(null)
  let hotspotsVar
  const timeUnit = [
    { value: "m", label: "Minuto" },
    { value: "h", label: "Hora" },
    { value: "d", label: "Dia" },
  ]

  const accessType = [
    {
      value: 1,
      label: "Visitante",
    },
    {
      value: 2,
      label: "Hóspede / Cliente",
    },
    {
      value: 3,
      label: "Evento",
    },
  ]

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleHotspots = async () => {
    hotspotsVar = await getHotspot()
    setHotspots(hotspotsVar)

    if (vDados[0].id !== undefined) {
      hotspotsVar?.map((res) => {
        if (res.value === vDados[0].hotspot_id) {
          setSelectedHotspot({ value: res.value, label: res.label })
        }
      })
    }
  }

  const handleUnidade = async () => {
    if (vDados[0].id !== undefined) {
      timeUnit?.map((res) => {
        if (res.value === vDados[0].unidade_tempo) {
          setSelectedUnidade({ value: res.value, label: res.label })
        }
      })
    }
  }

  const handleTipoAcesso = async () => {
    if (vDados[0].id !== undefined) {
      accessType?.map((res) => {
        if (res.value === vDados[0].tipo_evento_id) {
          setSelectedTipoAcesso({ value: res.value, label: res.label })
        }
      })
    }
  }

  // ** Bloquear ações de onChange
  const blockChange = () => {}

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    if (vDados.id !== 0 || undefined) {
      handleHotspots()
      handleUnidade()
      handleTipoAcesso()
      setNome(vDados[0].nome !== null ? vDados[0].nome : "")
      setDownload(vDados[0].mega_download !== 0 ? vDados[0].mega_download : "")
      setUpload(vDados[0].mega_upload !== 0 ? vDados[0].mega_upload : "")
      setTempoConexão(vDados[0].tempo !== 0 ? vDados[0].tempo : "")
      setAtivo(vDados[0].ativo)
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
                  onClick={() => navigate("/evento")}
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
                        Nome do evento
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => {
                                setNome(e.target.value)
                                handleChange({
                                  target: {
                                    name: "nome",
                                    value: e.target.value,
                                  },
                                })
                              }
                        }
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="hotspot-id">
                        Selecione um Hotspot
                      </Label>
                      <Select
                        isClearable
                        id="hotspot-id"
                        placeholder={"Selecione..."}
                        value={selectedHotspot}
                        options={hotspots}
                        className="react-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          setSelectedHotspot(e)
                          handleChange({
                            target: {
                              name: "hotspot_id",
                              value: Number(e?.value),
                            },
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="mega-download">
                        Velocidade de download (Mbps)
                      </Label>
                      <Input
                        id="mega-download"
                        name="mega-download"
                        type="number"
                        placeholder="Mbps"
                        value={download}
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => {
                                setDownload(e.target.value)
                                handleChange({
                                  target: {
                                    name: "mega_download",
                                    value: Number(e.target.value),
                                  },
                                })
                              }
                        }
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="mega-upload">
                        Velocidade de upload (Mbps)
                      </Label>
                      <Input
                        id="mega-upload"
                        name="mega-upload"
                        type="number"
                        placeholder="Mbps"
                        value={upload}
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => {
                                setUpload(e.target.value)
                                handleChange({
                                  target: {
                                    name: "mega_upload",
                                    value: Number(e.target.value),
                                  },
                                })
                              }
                        }
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Col lg="4" md="6" className="mb-2">
                      <Label className="form-label" for="tempo">
                        Tempo de conexão
                      </Label>
                      <Input
                        id="tempo"
                        name="tempo"
                        type="number"
                        value={tempoConexão}
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) => {
                                setTempoConexão(e.target.value)
                                handleChange({
                                  target: {
                                    name: "tempo",
                                    value: Number(e.target.value),
                                  },
                                })
                              }
                        }
                      />
                    </Col>

                    <Col lg="4" md="6" className="mb-2">
                      <Label className="form-label" for="unidade-tempo">
                        Unidade de tempo
                      </Label>
                      <Select
                        isClearable
                        id="unidade-tempo"
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        value={selectedUnidade}
                        options={timeUnit}
                        onChange={(e) => {
                          setSelectedUnidade(e)
                          handleChange({
                            target: {
                              name: "unidade_tempo",
                              value: e?.value,
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col lg="4" md="6" className="mb-2">
                      <Label className="form-label" for="tipo-evento-id">
                        Selecione o tipo de acesso
                      </Label>
                      <Select
                        isClearable
                        id="tipo-evento-id"
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        value={selectedTipoAcesso}
                        options={accessType}
                        onChange={(e) => {
                          setSelectedTipoAcesso(e)
                          handleChange({
                            target: {
                              name: "tipo_evento_id",
                              value: Number(e?.value),
                            },
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Col md="4" className="mb-2">
                      <div className="form-check form-switch">
                        <Input
                          type="switch"
                          id="ativo"
                          checked={ativo}
                          onChange={(e) => {
                            setAtivo(e.target.checked)
                            console.log(e.target.checked)
                            handleChange({
                              target: {
                                name: "ativo",
                                value: e.target.checked,
                              },
                            })
                          }}
                        />
                        <Label for="ativo" className="form-check-label mt-25">
                          Ativar evento
                        </Label>
                      </div>
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

export default EventoEditCard
