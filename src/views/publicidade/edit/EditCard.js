// ** React
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, CardImg } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check, Trash } from "react-feather"

// ** Terceiros
import Select from "react-select"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { getHotspot } from "../store"

const vListaTipo = [
  { value: 1, label: "Imagem" },
  { value: 2, label: "Vídeo" },
]

const PublicidadeEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vTipo, setTipo] = useState(
    data?.tipo ? vListaTipo.filter((item) => item.value === data.tipo)[0] : null
  )

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
      const hotspotsVar = res
      setListaHotspots(hotspotsVar)

      //Selecionar o item no componente
      if (data?.extra_hotspot_id) {
        const vHotspotArray = data?.extra_hotspot_id
          ?.split(",")
          .map((item) => parseInt(item))
        setHotspot(
          hotspotsVar
            ?.filter((item) => vHotspotArray?.includes(item.value))
            .map((ret) => ({
              label: ret.label,
              value: ret.value,
            }))
        )
      }
    })
  }

  const handleChangeItem = (e, i) => {
    const reader = new FileReader(),
      files = e.target.files,
      vI = i
    reader.onload = function () {
      const { propaganda_item: vItem } = vDados
      vItem[vI] = {
        ...vItem[vI],
        item_path: reader.result,
      }
      setData((prevState) => ({
        ...prevState,
        propaganda_item: vItem,
      }))
    }
    reader.readAsDataURL(files[0])
  }

  const handleRemoveItem = (index) => {
    setData((prevState) => {
      return {
        ...prevState,
        propaganda_item: [
          ...prevState.propaganda_item.slice(0, index),
          ...prevState.propaganda_item.slice(index + 1),
        ],
      }
    })
  }

  const handleAddItem = (e) => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setData((prevState) => {
        return {
          ...prevState,
          propaganda_item: [
            ...prevState.propaganda_item,
            {
              id: 0,
              item_path: reader.result,
            },
          ],
        }
      })
    }
    reader.readAsDataURL(files[0])
  }

  const renderItens = () => {
    return vDados?.propaganda_item.map((item, index) => {
      return (
        <Col key={`${item.id}-${index}`} className="mb-2" md="3">
          <div className="border rounded">
            <CardImg
              className="img-fluid"
              src={
                item?.item_path?.length > 0 ? item?.item_path : defaultImagem
              }
              alt="Mídia"
              top
            />
            <div className="m-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button
                    tag={Label}
                    size="sm"
                    className="m-1"
                    color="secondary"
                    outline
                  >
                    Trocar mídia
                    <Input
                      type="file"
                      name="item_path"
                      indice={index}
                      onChange={(e) => {
                        handleChangeItem(e, index)
                      }}
                      hidden
                      accept=".jpg, .jpeg, .png, .gif, .webp"
                    />
                  </Button>
                </div>
                <Link
                  to="/"
                  className="text-body m-1"
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveItem(index)
                  }}
                >
                  <Trash className="font-medium-3 text-danger cursor-pointer" />
                </Link>
              </div>
            </div>
          </div>
        </Col>
      )
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
                  <Label className="form-label" for="extra_hotspot_id">
                    Selecione o(s) Hotspot(s)
                  </Label>
                  <Select
                    isClearable
                    id="extra_hotspot_id"
                    noOptionsMessage={() => "Vazio"}
                    isMulti
                    placeholder={""}
                    className="react-select"
                    classNamePrefix="select"
                    value={vHotspot}
                    onChange={(e) => {
                      setHotspot(e)
                      handleChange({
                        target: {
                          name: "extra_hotspot_id",
                          value: e
                            ?.map((item) => item.value.toString())
                            .toString(),
                        },
                      })
                    }}
                    options={vListaHotspots}
                  />
                </Col>
                <Col md="3" className="mb-2">
                  <Label className="form-label" for="data_inicial">
                    Data Inicial
                  </Label>
                  <Input
                    id="data_inicial"
                    name="data_inicial"
                    type="date"
                    value={vDados?.data_inicial ?? ""}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="3" className="mb-2">
                  <Label className="form-label" for="data_final">
                    Data Final
                  </Label>
                  <Input
                    id="data_final"
                    name="data_final"
                    type="date"
                    value={vDados?.data_final ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="3" className="mb-2">
                  <Label className="form-label" for="duracao">
                    Tempo de exibição (segundos)
                  </Label>
                  <Input
                    id="duracao"
                    name="duracao"
                    type="number"
                    placeholder="Segundos"
                    value={vDados?.duracao ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="3" className="mb-2">
                  <Label className="form-label" for="tipo">
                    Tipo de mídia
                  </Label>
                  <Select
                    id="tipo"
                    noOptionsMessage={() => "Vazio"}
                    placeholder={"Selecione..."}
                    className="react-select"
                    classNamePrefix="select"
                    value={vTipo}
                    options={vListaTipo}
                    onChange={(e) => {
                      setTipo(e)
                      handleChange({
                        target: {
                          name: "tipo",
                          value: e?.value,
                        },
                      })
                    }}
                  />
                </Col>
                {renderItens()}
                {(vDados?.tipo === 2 &&
                  vDados?.propaganda_item?.length === 0) ||
                vDados?.tipo === 1 ? (
                  <Col className="mb-2" md="3">
                    <div className="border rounded p-2 text-center">
                      <div className="d-flex flex-column">
                        <div>
                          <div className="mb-1">
                            <small className="text-muted">
                              Resolução recomendada: 800x500px.
                              <br />
                              Tamanho máximo: 5mb.
                            </small>
                          </div>
                          <div className="d-inline-block">
                            <div className="mb-0">
                              <Button
                                tag={Label}
                                className="me-75"
                                size="sm"
                                color="secondary"
                                outline
                              >
                                Adicionar mídia
                                <Input
                                  type="file"
                                  onChange={handleAddItem}
                                  hidden
                                  accept=".jpg, .jpeg, .png, .gif, .webp"
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ) : null}

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