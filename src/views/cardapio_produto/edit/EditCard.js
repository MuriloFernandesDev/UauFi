// ** React
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import classnames from "classnames"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check, Move, Trash, Plus } from "react-feather"

// ** Utils
import { campoInvalido, mostrarMensagem } from "@utils"

// ** Terceiros
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { ReactSortable } from "react-sortablejs"
import { getCategorias } from "../store"

// ** Third Party Components
import Cleave from "cleave.js/react"

// ** Default Imagem
import defaultImagem from "@src/assets/images/pages/semfoto.png"

const CardapioProdutoCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaCategorias, setListaCategorias] = useState(null)
  const [vCategoria, setCategoria] = useState(null)
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [
    { nome: "titulo" },
    { nome: "categoria_id", tipo: "int" },
  ]
  const optMoeda = { numeral: true, numeralDecimalMark: ",", delimiter: "." }

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const onChangeImagem = (e) => {
    const reader = new FileReader(),
      files = e.target.files,
      vName = e.target.name
    reader.onload = function () {
      handleChange({
        target: {
          name: vName,
          value: reader.result,
        },
      })
    }
    reader.readAsDataURL(files[0])
  }

  // ** Organização da informação
  const handleChangeItem = (name, v, i) => {
    const { preco: vItem } = vDados
    vItem[i] = {
      ...vItem[i],
      [name]: v,
    }
    setData((prevState) => ({
      ...prevState,
      preco: vItem,
    }))
  }

  const handleCategorias = () => {
    getCategorias().then((res) => {
      const cCategorias = res
      setListaCategorias(cCategorias)

      if (vDados?.id !== undefined) {
        cCategorias?.map((res) => {
          if (res.value === vDados.categoria_id) {
            setCategoria({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const handleRemoveItem = (index) => {
    setData((prevState) => {
      return {
        ...prevState,
        preco: [
          ...prevState.preco.slice(0, index),
          ...prevState.preco.slice(index + 1),
        ],
      }
    })
  }

  const handleAddItem = () => {
    setData((prevState) => {
      return {
        ...prevState,
        preco: [
          ...prevState.preco,
          {
            id: 0,
          },
        ],
      }
    })
  }

  const handleOrdenarItem = (v) => {
    setData((prevState) => {
      return {
        ...prevState,
        preco: v,
      }
    })
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

  const renderItens = () => {
    return (
      <div className="todo-app-list list-group mb-2">
        {vDados?.preco?.length ? (
          <ReactSortable
            tag="ul"
            list={vDados?.preco}
            handle=".drag-icon"
            className="todo-list media-list"
            setList={(newState) => handleOrdenarItem(newState)}
          >
            {vDados?.preco.map((item, index) => {
              return (
                <li key={`${item.id}-${index}`} className="todo-item">
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area w-100">
                      <Move className="drag-icon" />
                      <div className="w-100 pe-2">
                        <Row>
                          <Col md="6">
                            <Label className="form-label">Descrição*</Label>
                            <Input
                              className="w-100"
                              value={item.descricao ?? ""}
                              onChange={(e) => {
                                handleChangeItem(
                                  "descricao",
                                  e?.target.value,
                                  index
                                )
                              }}
                            />
                          </Col>
                          <Col md="6">
                            <Label className="form-label">Preço*</Label>
                            <Cleave
                              className="form-control w-100"
                              value={item.preco ?? ""}
                              onChange={(e) => {
                                handleChangeItem(
                                  "preco",
                                  e?.target.value,
                                  index
                                )
                              }}
                              options={optMoeda}
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div className="todo-item-action pt-2">
                      <Link
                        to="/"
                        className="text-body"
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemoveItem(index)
                        }}
                      >
                        <Trash className="font-medium-3 text-danger cursor-pointer" />
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ReactSortable>
        ) : (
          <div className="no-results show"></div>
        )}
      </div>
    )
  }

  useEffect(() => {
    // ** Requisitar listas
    handleCategorias()
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
                  onClick={() => navigate("/cardapio_produto")}
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
                <Col md="6">
                  <Row>
                    <Col md="12" className="mb-2">
                      <Label className="form-label" for="titulo">
                        Título*
                      </Label>
                      <Input
                        id="titulo"
                        name="titulo"
                        value={vDados?.titulo ?? ""}
                        onChange={handleChange}
                        invalid={campoInvalido(vDados, vErros, "titulo")}
                      />
                    </Col>

                    <Col md="12" className="mb-2">
                      <Label className="form-label" for="descricao">
                        Descrição
                      </Label>
                      <Input
                        value={vDados?.descricao ?? ""}
                        type="textarea"
                        id="descricao"
                        name="descricao"
                        style={{ minHeight: "113px" }}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md="12" className="mb-2">
                      <Label className="form-label" for="categoria_id">
                        Categoria*
                      </Label>
                      <Select
                        isClearable
                        id="categoria_id"
                        noOptionsMessage={() => t("Vazio")}
                        placeholder={t("Selecione...")}
                        value={vCategoria}
                        options={vListaCategorias}
                        className={classnames("react-select", {
                          "is-invalid": campoInvalido(
                            vDados,
                            vErros,
                            "categoria_id",
                            "int"
                          ),
                        })}
                        classNamePrefix="select"
                        onChange={(e) => {
                          setCategoria(e)
                          handleChange({
                            target: {
                              name: "categoria_id",
                              value: Number(e?.value),
                            },
                          })
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col md="6">
                  <div className="border rounded text-center">
                    <div>
                      <img
                        className="mb-1 mb-md-0 img-fluid img-proporcional"
                        src={
                          vDados?.imagem?.length > 0
                            ? vDados?.imagem
                            : defaultImagem
                        }
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                        alt="imagem"
                        width="200"
                        height="200"
                      />
                    </div>
                    <div>
                      <div className="mb-1">
                        <small className="text-muted">
                          Resolução recomendada: 800x800px.
                          <br />
                          Tamanho máximo: 250kB.
                        </small>
                      </div>
                      <div className="d-inline-block">
                        <div className="mb-1">
                          <Button
                            tag={Label}
                            className="me-75"
                            size="sm"
                            color="secondary"
                            outline
                          >
                            Selecionar imagem
                            <Input
                              type="file"
                              name="imagem"
                              onChange={onChangeImagem}
                              hidden
                              accept=".jpg, .jpeg, .png, .gif, .webp"
                            />
                          </Button>
                          <Link
                            to="/"
                            className="text-body"
                            onClick={(e) => {
                              e.preventDefault()
                              handleChange({
                                target: { name: "imagem", value: null },
                              })
                            }}
                          >
                            <Trash className="font-medium-3 text-danger cursor-pointer" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="divider divider-dark">
                    <div className="divider-text text-dark">
                      Opções de preços
                    </div>
                  </div>
                </Col>
                <Col md="12" className="mb-2">
                  <Link
                    to="/"
                    className="text-primary d-flex justify-content-left align-items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddItem()
                    }}
                  >
                    <Plus className="font-medium-3 cursor-pointer" />
                    <span className="ms-25">Adicionar preço</span>
                  </Link>
                </Col>
                <Col md="12">{renderItens()}</Col>
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
                      Produto {vDados?.ativo ? "ativo" : "desativado"}
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

export default CardapioProdutoCard
