// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"
import { getHotspot } from "../store"

const BloqueioQuartoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
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
                  onClick={() => navigate("/bloqueio_quarto")}
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
                    Número do quarto
                  </Label>
                  <Input
                    id="quarto"
                    name="quarto"
                    value={vDados?.quarto ?? ""}
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
                    isDisabled={vDados.id === 0 && data.hotspot_id > 0}
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
              </Row>
            </Card>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default BloqueioQuartoEditCard
