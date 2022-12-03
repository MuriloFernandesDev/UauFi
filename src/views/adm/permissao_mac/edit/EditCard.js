// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import classnames from "classnames"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Utils
import { campoInvalido, mostrarMensagem } from "@utils"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.br"
import { getHotspot } from "../store"

const vListaTipoPermissao = [
  { value: 1, label: "Liberar" },
  { value: 2, label: "Bloquear" },
]

const PermissaoMacEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()
  // ** Hooks
  const { t } = useTranslation()

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
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [
    { nome: "mac" },
    { nome: "comentario" },
    { nome: "hotspot_id", tipo: "int" },
    { nome: "tipo_permissao", tipo: "int" },
  ]

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
      setSalvarDados(vDados)
    } else {
      mostrarMensagem(
        "Atenção!",
        "Preencha todos os campos obrigatórios.",
        "warning"
      )
    }
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
                  Informe o(s) MAC(s)*
                </Label>
                <Input
                  value={vDados?.mac ?? ""}
                  type="textarea"
                  id="mac"
                  name="mac"
                  style={{ minHeight: "100px" }}
                  onChange={handleChange}
                  invalid={campoInvalido(vDados, vErros, "mac")}
                />
              </Col>

              <Col md="3" className="mb-2">
                <Label className="form-label" for="tipo_permissao">
                  Tipo de operação*
                </Label>
                <Select
                  id="tipo_permissao"
                  noOptionsMessage={() => t("Vazio")}
                  placeholder={t("Selecione...")}
                  className={classnames("react-select", {
                    "is-invalid": campoInvalido(
                      vDados,
                      vErros,
                      "tipo_permissao",
                      "int"
                    ),
                  })}
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
                  Selecione um Hotspot*
                </Label>
                <Select
                  isClearable
                  id="hotspot_id"
                  noOptionsMessage={() => t("Vazio")}
                  placeholder={t("Selecione...")}
                  value={vHotspot}
                  options={vListaHotspots}
                  isDisabled={vDados.id === 0 && data.hotspot_id > 0}
                  className={classnames("react-select", {
                    "is-invalid": campoInvalido(
                      vDados,
                      vErros,
                      "hotspot_id",
                      "int"
                    ),
                  })}
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
                  Comentário*
                </Label>
                <Input
                  value={vDados?.comentario ?? ""}
                  type="textarea"
                  id="comentario"
                  name="comentario"
                  style={{ minHeight: "100px" }}
                  onChange={handleChange}
                  invalid={campoInvalido(vDados, vErros, "comentario")}
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
