// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"
import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.br"
import { getHotspot } from "../store"

const vListaTipoPermissao = [
  { value: 1, label: "Liberar" },
  { value: 2, label: "Bloquear" },
]

const PermissaoMacEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vTipoPermissao, setTipoPermissao] = useState(
    data?.tipo_permissao
      ? vListaTipoPermissao.filter(
          (item) => item.value === data.tipo_permissao
        )[0]
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

  const setDados = () => {
    setSalvarDados(vDados)
  }

  const optTel = { phone: true, phoneRegionCode: "BR" }

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
                  onClick={() => navigate("/adm/permissao_mac")}
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
            <Row>
              <Col md="12" className="mb-2">
                <Label className="form-label" for="mac">
                  Informe o(s) MAC(s)
                </Label>
                <Input
                  value={vDados?.mac ?? ""}
                  type="textarea"
                  id="mac"
                  name="mac"
                  style={{ minHeight: "100px" }}
                  onChange={handleChange}
                />
              </Col>

              <Col md="3" className="mb-2">
                <Label className="form-label" for="tipo_permissao">
                  Tipo de operação
                </Label>
                <Select
                  id="tipo_permissao"
                  noOptionsMessage={() => "Vazio"}
                  placeholder={"Selecione..."}
                  className="react-select"
                  classNamePrefix="select"
                  value={vTipoPermissao}
                  options={vListaTipoPermissao}
                  onChange={(e) => {
                    setTipoPermissao(e)
                    handleChange({
                      target: {
                        name: "tipo_permissao",
                        value: e?.value,
                      },
                    })
                  }}
                />
              </Col>

              <Col md="3" className="mb-2">
                <Label className="form-label" for="fone_solicitante">
                  Telefone 1
                </Label>
                <Cleave
                  className="form-control"
                  placeholder="00 0000 0000"
                  options={optTel}
                  id="fone_solicitante"
                  name="fone_solicitante"
                  value={vDados?.fone_solicitante ?? ""}
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
              <Col md="12" className="mb-2">
                <Label className="form-label" for="comentario">
                  Comentário
                </Label>
                <Input
                  value={vDados?.comentario ?? ""}
                  type="textarea"
                  id="comentario"
                  name="comentario"
                  style={{ minHeight: "100px" }}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default PermissaoMacEditCard
