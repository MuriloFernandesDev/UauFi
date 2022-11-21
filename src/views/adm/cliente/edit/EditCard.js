// ** React
import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// ** Reactstrap
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Label,
  Form,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap"

// ** Default Imagem
import defaultImagem from "@src/assets/images/pages/semfoto.png"

// ** Icons
import { CornerUpLeft, Check, Trash } from "react-feather"

import { useTranslation } from "react-i18next"

// ** Terceiros
import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.br"
import Select from "react-select"
import classnames from "classnames"

// ** API
import api from "@src/services/api"

// ** API
import viacep from "@src/services/viacep"

// ** Utils
import { removerAcentos } from "@utils"

import toast from "react-hot-toast"

const vListaArtigoGenero = [
  { value: "à", label: "à" },
  { value: "o", label: "o" },
  { value: "a", label: "a" },
  { value: "ao", label: "ao" },
]

const ClienteEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { i18n, t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vArtigoGenero, setArtigoGenero] = useState(
    data && data?.artigo_genero !== null
      ? { label: data?.artigo_genero, value: data?.artigo_genero }
      : null
  )
  const [vEstado, setEstado] = useState(null)
  const [vCidade, setCidade] = useState(null)
  const [vCategoria, setCategoria] = useState(null)
  const [vAgregador, setAgregador] = useState(null)
  const [vListaCidades, setListaCidades] = useState(null)
  const [vListaEstados, setListaEstados] = useState(null)
  const [vListaCategorias, setListaCategorias] = useState(null)
  const [vListaAgregadores, setListaAgregadores] = useState(null)

  const [active, setActive] = useState("1")

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const getCidades = (e) => {
    return api
      .get(`/cidade/por_estado/${(e ? e.value : data?.estado_id) || 0}`)
      .then((res) => {
        setListaCidades(
          res.data.map((ret) => ({ label: ret.nome, value: ret.id }))
        )

        if (data?.cidade_id) {
          setCidade(
            res.data
              ?.filter((item) => item.id === Number(data?.cidade_id))
              .map((ret) => ({
                label: ret.nome,
                value: ret.id,
              }))[0]
          )
        } else {
          setCidade(null)
        }
      })
  }

  const getEstados = () => {
    return api.get("/estado").then((res) => {
      setListaEstados(
        res.data.map((ret) => ({
          label: ret.nome,
          value: ret.id,
          sigla: ret.sigla,
        }))
      )

      if (data?.estado_id) {
        setEstado(
          res.data
            ?.filter((item) => item.id === Number(data?.estado_id))
            .map((ret) => ({
              label: ret.nome,
              value: ret.id,
            }))[0]
        )
        getCidades({ value: data?.estado_id })
      } else {
        setEstado(null)
        setCidade(null)
      }
    })
  }

  const getCategorias = () => {
    return api.get("/categoria").then((res) => {
      setListaCategorias(
        res.data.map((ret) => ({
          label: ret.nome,
          value: ret.id,
        }))
      )

      //Selecionar o item no componente
      if (data?.categoria_id) {
        setCategoria(
          res.data
            ?.filter((item) => item.id === Number(data?.categoria_id ?? 0))
            .map((ret) => ({
              label: ret.nome,
              value: ret.id,
            }))[0]
        )
      }
    })
  }

  const getAgregadores = () => {
    return api.get("/cliente/agregador").then((res) => {
      setListaAgregadores(
        res.data.map((ret) => ({
          label: ret.nome,
          value: ret.id,
        }))
      )

      //Selecionar o item no componente
      if (data?.cliente_agregador) {
        const vAgregadorArray = data?.cliente_agregador
          ?.split(",")
          .map((item) => parseInt(item))
        setAgregador(
          res.data
            ?.filter((item) => vAgregadorArray?.includes(item.id))
            .map((ret) => ({
              label: ret.nome,
              value: ret.id,
            }))
        )
      }
    })
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

  const handleGetCEP = (e) => {
    const cepString = e.target.value
    const cep = cepString.replace(/\D/g, "")

    viacep
      .get(`${cep}/json`)
      .then((response) => {
        const addressData = response.data
        handleChange({
          target: { name: "endereco", value: addressData.logradouro },
        })
        handleChange({
          target: { name: "bairro", value: addressData.bairro },
        })

        const estadoSel = vListaEstados.filter(
          (item) => item.sigla === addressData.uf
        )[0]

        setEstado(estadoSel)
        handleChange({
          target: { name: "estado_id", value: estadoSel.value },
        })

        api.get(`/cidade/por_estado/${estadoSel.value}`).then((res) => {
          setListaCidades(
            res.data.map((ret) => ({ label: ret.nome, value: ret.id }))
          )

          const cidadeSel = res.data
            ?.filter(
              (item) =>
                removerAcentos(item.nome).toLowerCase() ===
                removerAcentos(addressData.localidade).toLowerCase()
            )
            .map((ret) => ({
              label: ret.nome,
              value: ret.id,
            }))[0]

          setCidade(cidadeSel || null)

          handleChange({
            target: { name: "cidade_id", value: cidadeSel?.id || null },
          })
        })
      })

      .catch(() => {
        toast.warning("CEP não encontrado!", {
          position: "bottom-right",
        })
      })
  }

  const handleArrayTelefoneBlocks = () => {
    if (i18n.language === "br") {
      return [2, 5, 4]
    } else if (i18n.language === "pt") {
      return [3, 3, 3]
    } else if (i18n.language === "en") {
      return [3, 3, 4]
    } else if (i18n.language === "es") {
      return [3, 2, 2, 2]
    }
  }
  const handleArrayTelefoneDelimiters = () => {
    if (i18n.language === "es") {
      return [" ", " ", " "]
    } else {
      return [" ", " "]
    }
  }

  let optTel = { phone: true, phoneRegionCode: "BR" }

  if (i18n.language !== "br") {
    optTel = {
      delimiters: handleArrayTelefoneDelimiters(),
      blocks: handleArrayTelefoneBlocks(),
      uppercase: true,
    }
  }

  const optCep = { delimiters: [".", "-"], blocks: [2, 3, 3], uppercase: true }

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get cliente on mount based on id
  useEffect(() => {
    // ** Requisitar listas
    if (vListaEstados === null) {
      getEstados()
    }
    if (vListaCategorias === null) {
      getCategorias()
    }
    getAgregadores()
  }, [])

  return (
    <Row>
      <Col sm="12">
        <Fragment>
          <Card className="mb-1">
            <div className="d-flex justify-content-between flex-row m-1">
              <div>
                <Button.Ripple color="primary" onClick={() => navigate(-1)}>
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
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={active === "1"}
                  onClick={() => {
                    toggle("1")
                  }}
                >
                  Dados básicos
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === "2"}
                  onClick={() => {
                    toggle("2")
                  }}
                >
                  Gerencial
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-50" activeTab={active}>
              <TabPane tabId="1">
                <Card className="mb-0">
                  <Row>
                    <Col lg="5">
                      <Row>
                        <Col className="mb-2" sm="12">
                          <div className="border rounded p-2">
                            <h5 className="mb-1">Logotipo do Dashboard</h5>
                            <div className="d-flex flex-column flex-md-row">
                              <img
                                className="me-2 mb-1 mb-md-0 img-fluid img-proporcional"
                                src={
                                  vDados?.logo?.length > 0
                                    ? vDados?.logo
                                    : defaultImagem
                                }
                                alt="Logotipo"
                                width="100"
                                height="100"
                              />
                              <div>
                                <div className="mb-1">
                                  <small className="text-muted">
                                    Resolução recomendada: 800x800px.
                                    <br />
                                    Tamanho máximo: 250kB.
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
                                      Selecionar imagem
                                      <Input
                                        type="file"
                                        name="logo"
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
                                          target: { name: "logo", value: null },
                                        })
                                      }}
                                    >
                                      <Trash className="font-medium-3 text-danger cursor-pointer" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="7">
                      <Row>
                        <Col md="12" className="mb-2">
                          <Label className="form-label" for="nome">
                            Nome completo*
                          </Label>
                          <Input
                            id="nome"
                            name="nome"
                            value={vDados?.nome ?? ""}
                            onChange={handleChange}
                          />
                        </Col>
                        <Col md="6" className="mb-2">
                          <Label className="form-label" for="email">
                            E-mail
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={vDados?.email ?? ""}
                            onChange={handleChange}
                          />
                        </Col>
                        <Col md="6" className="mb-2">
                          <Label className="form-label" for="site">
                            Site institucional
                          </Label>
                          <Input
                            id="site"
                            name="site"
                            type="url"
                            value={vDados?.site ?? ""}
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="artigo_genero">
                        Tratamento
                      </Label>
                      <Select
                        isClearable
                        id="artigo_genero"
                        placeholder={t("Selecione...")}
                        noOptionsMessage={() => t("Vazio")}
                        className="react-select"
                        classNamePrefix="select"
                        value={vArtigoGenero}
                        onChange={(e) => {
                          setArtigoGenero(e)
                          handleChange({
                            target: { name: "artigo_genero", value: e.value },
                          })
                        }}
                        options={vListaArtigoGenero}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="slug">
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        value={vDados?.slug ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="vCategoria">
                        Categoria*
                      </Label>
                      <Select
                        isClearable
                        id="vCategoria"
                        placeholder={t("Selecione...")}
                        className="react-select"
                        noOptionsMessage={() => t("Vazio")}
                        classNamePrefix="select"
                        value={vCategoria}
                        onChange={(e) => {
                          setCategoria(e)
                          handleChange({
                            target: { name: "categoria_id", value: e.value },
                          })
                        }}
                        options={vListaCategorias}
                      />
                    </Col>
                    <Col md="2" className="mb-2">
                      <Label for="agregador" className="form-label mb-50">
                        É matriz?
                      </Label>
                      <div className="form-switch form-check-primary">
                        <Input
                          type="switch"
                          id="agregador"
                          checked={vDados?.agregador ?? false}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                name: "agregador",
                                value: e.target.checked,
                              },
                            })
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="vAgregador">
                        Cliente matriz
                      </Label>
                      <Select
                        isClearable
                        id="vAgregador"
                        noOptionsMessage={() => t("Vazio")}
                        isMulti
                        placeholder={""}
                        className="react-select"
                        classNamePrefix="select"
                        value={vAgregador}
                        onChange={(e) => {
                          setAgregador(e)
                          handleChange({
                            target: {
                              name: "cliente_agregador",
                              value: e
                                ?.map((item) => item.value.toString())
                                .toString(),
                            },
                          })
                        }}
                        options={vListaAgregadores}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="whatsapp">
                        WhatsApp
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder={t("mask_celular")}
                        options={optTel}
                        id="whatsapp"
                        name="whatsapp"
                        value={vDados?.whatsapp ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="tel_1">
                        Telefone 1*
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder={t("mask_telefone")}
                        options={optTel}
                        id="tel_1"
                        name="tel_1"
                        value={vDados?.tel_1 ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="tel_2">
                        Telefone 2
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder={t("mask_telefone")}
                        options={optTel}
                        id="tel_2"
                        name="tel_2"
                        value={vDados?.tel_2 ?? ""}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vCep">
                        {t("CEP")}
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder="00.000-000"
                        options={optCep}
                        onBlurCapture={(e) => handleGetCEP(e)}
                        id="vCep"
                        name="cep"
                        value={vDados?.cep ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="8" className="mb-2">
                      <Label className="form-label" for="vEndereco">
                        {t("Endereço")}*
                      </Label>
                      <Input
                        id="vEndereco"
                        name="endereco"
                        value={vDados?.endereco ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vNumero">
                        {t("Número")}*
                      </Label>
                      <Input
                        id="vNumero"
                        name="endereco_nr"
                        value={vDados?.endereco_nr ?? ""}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vBairro">
                        {t("Bairro")}
                      </Label>
                      <Input
                        id="vBairro"
                        name="bairro"
                        value={vDados?.bairro ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vEstado">
                        {t("U.F.")}
                      </Label>
                      <Select
                        isClearable
                        id="vEstado"
                        noOptionsMessage={() => t("Vazio")}
                        placeholder={t("Selecione...")}
                        className="react-select"
                        classNamePrefix="select"
                        value={vEstado}
                        onChange={(e) => {
                          setEstado(e)
                          handleChange({
                            target: { name: "estado_id", value: e.value },
                          })
                          getCidades(e)
                          handleChange({
                            target: { name: "cidade_id", value: null },
                          })
                        }}
                        options={vListaEstados}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vCidade">
                        Cidade
                      </Label>
                      <Select
                        id="vCidade"
                        noOptionsMessage={() => t("Vazio")}
                        LoadingMessage={() => "pesquisando..."}
                        placeholder={t("Selecione...")}
                        mess
                        isClearable
                        className="react-select"
                        classNamePrefix="select"
                        isDisabled={(vDados?.estado_id ?? 0) === 0}
                        value={vCidade}
                        onChange={(e) => {
                          setCidade(e)
                          handleChange({
                            target: { name: "cidade_id", value: e.value },
                          })
                        }}
                        options={vListaCidades}
                      />
                    </Col>

                    <Col md="12" className="mb-2">
                      <Label className="form-label" for="vBreveDescricao">
                        Breve descrição*
                      </Label>
                      <Input
                        value={vDados?.breve_descricao ?? ""}
                        type="textarea"
                        id="vBreveDescricao"
                        name="breve_descricao"
                        style={{ minHeight: "80px" }}
                        onChange={handleChange}
                        className={classnames({
                          "text-danger":
                            (vDados?.breve_descricao?.length || 0) > 510,
                        })}
                      />
                      <span
                        className={classnames(
                          "textarea-counter-value float-end",
                          {
                            "bg-danger":
                              (vDados?.breve_descricao?.length || 0) > 510,
                          }
                        )}
                      >
                        {`${vDados?.breve_descricao?.length || 0}/510`}
                      </span>
                    </Col>

                    <Col md="12" className="mb-2">
                      <Label className="form-label" for="vInfoGerais">
                        Informações gerais*
                      </Label>
                      <Input
                        value={vDados?.informacoes_gerais ?? ""}
                        type="textarea"
                        id="vInfoGerais"
                        name="informacoes_gerais"
                        style={{ minHeight: "100px" }}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tabId="3">
                <Card className="mb-0">
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row></Row>
                  </Form>
                </Card>
              </TabPane>
            </TabContent>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default ClienteEditCard
