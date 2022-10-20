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

const vListaUnidadeTempo = [
  { value: "m", label: "Minuto(s)" },
  { value: "h", label: "Hora(s)" },
  { value: "d", label: "Dia(s)" },
]

const vListaTipoPlano = [
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

const PublicidadeEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vUnidade, setUnidade] = useState(
    data?.unidade_tempo
      ? vListaUnidadeTempo.filter(
          (item) => item.value === data.unidade_tempo
        )[0]
      : null
  )
  const [vTipoAcesso, setTipoAcesso] = useState(
    data?.tipo_plano_id
      ? vListaTipoPlano.filter((item) => item.value === data.tipo_plano_id)[0]
      : null
  )
  let hotspotsVar

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleHotspots = () => {
    getHotspot().then((res) => {
      hotspotsVar = res
      setListaHotspots(hotspotsVar)

      if (vDados?.id !== undefined) {
        hotspotsVar?.map((res) => {
          if (res.value === vDados.hotspot_id) {
            setHotspot({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    handleHotspots()
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
                  onClick={() => navigate("/publicidade")}
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
                    Nome da publicidade
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={vDados?.nome ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="6" className="mb-2">
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
                    isDisabled={vDados.id === 0 && vDados.hotspot_id > 0}
                    className="react-select"
                    classNamePrefix="select"
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

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="mega_download">
                    Velocidade de download (Mbps)
                  </Label>
                  <Input
                    id="mega_download"
                    name="mega_download"
                    type="number"
                    placeholder="Mbps"
                    value={vDados?.mega_download ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="mega_upload">
                    Velocidade de upload (Mbps)
                  </Label>
                  <Input
                    id="mega_upload"
                    name="mega_upload"
                    type="number"
                    placeholder="Mbps"
                    value={vDados?.mega_upload ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="4" className="mb-2">
                  <Label className="form-label" for="tempo">
                    Timeout da conexão
                  </Label>
                  <Input
                    id="tempo"
                    name="tempo"
                    type="number"
                    value={vDados?.tempo ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="4" className="mb-2">
                  <Label className="form-label" for="unidade_tempo">
                    Unidade de tempo do timeout
                  </Label>
                  <Select
                    isClearable
                    id="unidade_tempo"
                    noOptionsMessage={() => "Vazio"}
                    placeholder={"Selecione..."}
                    className="react-select"
                    classNamePrefix="select"
                    value={vUnidade}
                    options={vListaUnidadeTempo}
                    onChange={(e) => {
                      setUnidade(e)
                      handleChange({
                        target: {
                          name: "unidade_tempo",
                          value: e?.value,
                        },
                      })
                    }}
                  />
                </Col>

                <Col md="4" className="mb-2">
                  <Label className="form-label" for="tipo_plano_id">
                    Tipo do plano
                  </Label>
                  <Select
                    isClearable
                    noOptionsMessage={() => "Vazio"}
                    id="tipo_plano_id"
                    placeholder={"Selecione..."}
                    className="react-select"
                    classNamePrefix="select"
                    value={vTipoAcesso}
                    options={vListaTipoPlano}
                    onChange={(e) => {
                      setTipoAcesso(e)
                      handleChange({
                        target: {
                          name: "tipo_plano_id",
                          value: Number(e?.value),
                        },
                      })
                    }}
                  />
                </Col>

                <Col md="12" className="mb-2">
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
                      {vDados?.ativo
                        ? "Publicidade ativa"
                        : "Publicidade desativada"}
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

export default PublicidadeEditCard
