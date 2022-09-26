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

const PlanoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [hotspots, setHotspots] = useState(null)
  const [selectedHotspots, setSelectedHotspots] = useState(null)

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

  const handleHotspot = async () => {
    const response = await getHotspot(20)
    setHotspots(response?.map((i) => ({ value: i.id, label: i.nome })))
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
      handleHotspot()
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
                        Nome do plano de conexão
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
                      <Label className="form-label" for="hotspot-id">
                        Selecione um Hotspot
                      </Label>
                      <Select
                        isClearable
                        id="hotspot-id"
                        isMulti={true}
                        placeholder={"Selecione..."}
                        options={hotspots}
                        value={selectedHotspots}
                        className="react-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          setSelectedHotspots(e)
                          handleChange({
                            target: {
                              name: "hotspot_id",
                              value: e?.map((item) => Number(item.value)),
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
                        Velocidade de download
                      </Label>
                      <Input
                        id="mega-download"
                        name="mega-download"
                        type="number"
                        placeholder="Mbps"
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) =>
                                handleChange({
                                  target: {
                                    name: "mega_download",
                                    value: Number(e.target.value),
                                  },
                                })
                        }
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="mega-upload">
                        Velocidade de upload
                      </Label>
                      <Input
                        id="mega-upload"
                        name="mega-upload"
                        type="number"
                        placeholder="Mbps"
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) =>
                                handleChange({
                                  target: {
                                    name: "mega_upload",
                                    value: Number(e.target.value),
                                  },
                                })
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
                        onChange={
                          vDados.id !== undefined
                            ? blockChange
                            : (e) =>
                                handleChange({
                                  target: {
                                    name: "tempo",
                                    value: Number(e.target.value),
                                  },
                                })
                        }
                      />
                    </Col>

                    <Col lg="4" md="6" className="mb-2">
                      <Label className="form-label" for="tempo">
                        Unidade de tempo
                      </Label>
                      <Select
                        isClearable
                        id="tempo"
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        options={timeUnit}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "tempo",
                              value: e?.value,
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col lg="4" md="6" className="mb-2">
                      <Label className="form-label" for="tipo-plano-id">
                        Selecione o tipo de acesso
                      </Label>
                      <Select
                        isClearable
                        id="tipo-plano-id"
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        options={accessType}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "tipo_plano_id",
                              value: Number(e?.value),
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
    </Row>
  )
}

export default PlanoEditCard
