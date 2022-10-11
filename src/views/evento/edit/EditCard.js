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

const EventoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaPlanos, setListaPlanos] = useState(null)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vPlano, setPlano] = useState(null)
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
    setListaHotspots(hotspotsVar)

    if (vDados.id !== undefined) {
      hotspotsVar?.map((res) => {
        if (res.value === vDados.hotspot_id) {
          setHotspot({ value: res.value, label: res.label })
        }
      })
    }
  }

  const handlePlanos = async () => {
    planosVar = await getPlano()
    setListaPlanos(planosVar.map((i) => ({ value: i.id, label: i.nome })))

    if (vDados.id !== undefined) {
      planosVar?.map((res) => {
        if (res.id === vDados.plano_conexao_id) {
          setPlano({ value: res.id, label: res.nome })
        }
      })
    }
  }

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    handleHotspots()
    handlePlanos()
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
                <Col lg="12">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="nome">
                        Nome do evento
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={vDados?.nome ?? ""}
                        onChange={handleChange}
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
                        value={vDados?.voucher ?? ""}
                        onChange={handleChange}
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
                        id="data_inicio"
                        name="data_inicio"
                        type="datetime-local"
                        value={vDados?.data_inicio ?? ""}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="data-fim">
                        Fim do evento
                      </Label>
                      <Input
                        id="data_fim"
                        name="data_fim"
                        type="datetime-local"
                        value={vDados?.data_fim ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col lg="12">
                  <Row>
                    <Col lg="6" md="6" className="mb-2">
                      <Label className="form-label" for="plano-conexao-id">
                        Plano de conexão
                      </Label>
                      <Select
                        id="plano-conexao-id"
                        noOptionsMessage={() => "Vazio"}
                        placeholder={"Selecione..."}
                        value={vPlano}
                        options={vListaPlanos}
                        className="react-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          setPlano(e)
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
                      <Label className="form-label" for="hotspot_id">
                        Selecione um Hotspot
                      </Label>
                      <Select
                        isClearable
                        id="hotspot_id"
                        noOptionsMessage={() => "Vazio"}
                        placeholder={"Selecione..."}
                        value={vHotspot}
                        options={vListaHotspots}
                        className="react-select"
                        classNamePrefix="select"
                        isDisabled={vDados.id === 0 && vDados.hotspot_id > 0}
                        onChange={(e) => {
                          setHotspot(e)
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
                          checked={vDados?.ativo ?? false}
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
                          {vDados?.ativo ? "Evento ativo" : "Evento desativado"}
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
