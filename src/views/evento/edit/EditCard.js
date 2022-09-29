// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"
import { getHotspot, getPlano } from "../store"
import "@styles/react/libs/flatpickr/flatpickr.scss"

// ** API
// import api from "@src/services/api"

const EventoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [nome, setNome] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [voucher, setVoucher] = useState("")
  const [planos, setPlanos] = useState(null)
  const [hotspots, setHotspots] = useState(null)
  const [ativo, setAtivo] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [selectedPlano, setSelectedPlano] = useState(null)
  let hotspotsVar
  let planosVar

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

  const handlePlanos = async () => {
    planosVar = await getPlano()
    setPlanos(planosVar.map((i) => ({ value: i.id, label: i.nome })))

    if (vDados[0].id !== undefined) {
      planosVar?.map((res) => {
        if (res.id === vDados[0].plano_conexao_id) {
          setSelectedPlano({ value: res.id, label: res.nome })
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
      handlePlanos()
      setNome(vDados[0].nome !== null ? vDados[0].nome : "")
      setVoucher(vDados[0].voucher !== null ? vDados[0].voucher : "")
      setDataInicio(
        vDados[0].data_inicio !== "0001-01-01T00:00:00"
          ? vDados[0].data_inicio
          : ""
      )
      setDataFim(
        vDados[0].data_fim !== "0001-01-01T00:00:00" ? vDados[0].data_fim : ""
      )
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
                      <Label className="form-label" for="voucher">
                        Voucher
                      </Label>
                      <Input
                        id="voucher"
                        name="voucher"
                        maxLength={20}
                        value={voucher}
                        onChange={(e) => {
                          setVoucher(e.target.value)
                          handleChange({
                            target: {
                              name: "voucher",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>{" "}
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="data-inicio">
                        Início do evento
                      </Label>

                      <Input
                        id="data-inicio"
                        name="data-inicio"
                        type="datetime-local"
                        value={dataInicio}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setDataInicio(e.target.value)
                          handleChange({
                            target: {
                              name: "data_inicio",
                              value: e.target.value,
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="data-fim">
                        Fim do evento
                      </Label>
                      <Input
                        id="data-fim"
                        name="data-fim"
                        type="datetime-local"
                        value={dataFim}
                        disabled={vDados.id !== undefined}
                        onChange={(e) => {
                          setDataFim(e.target.value)
                          handleChange({
                            target: {
                              name: "data_fim",
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
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="plano-conexao-id">
                        Selecione um plano de conexão
                      </Label>
                      <Select
                        isClearable
                        id="plano-conexao-id"
                        placeholder={"Selecione..."}
                        value={selectedPlano}
                        options={planos}
                        className="react-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          setSelectedPlano(e)
                          handleChange({
                            target: {
                              name: "plano_conexao_id",
                              value: Number(e?.value),
                            },
                          })
                        }}
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
                    <Col md="4" className="mb-2">
                      <div className="form-check form-switch">
                        <Input
                          type="switch"
                          id="ativo"
                          checked={ativo}
                          onChange={(e) => {
                            setAtivo(e.target.checked)
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
