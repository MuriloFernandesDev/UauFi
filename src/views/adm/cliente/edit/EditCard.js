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

// ** Terceiros
import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.br"
import Select from "react-select"
import classnames from "classnames"

// ** API
import api from "@src/services/api"

const vListaArtigoGenero = [
  { value: "à", label: "à" },
  { value: "o", label: "o" },
  { value: "a", label: "a" },
  { value: "ao", label: "ao" },
]

const vListaTipoIntegracao = [
  { value: 0, label: "Nenhuma" },
  { value: 1, label: "Taboca" },
  { value: 2, label: "IXC Soft" },
  { value: 3, label: "Max Atacadista" },
  { value: 4, label: "Clubefato" },
  { value: 5, label: "TOTVs API" },
  { value: 6, label: "TOTVs Oracle" },
  { value: 7, label: "CaririSGP" },
  { value: 8, label: "IXC Leads" },
]

const vListaTipoLayout = [
  { value: 0, label: "Layout Padrão" },
  { value: 1, label: "Layout Alternativo" },
]

const ClienteEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vDadosCP, setDataCP] = useState(data?.dados_captive[0])
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

  // Captive Portal
  const [vTipoLayout, setTipoLayout] = useState(null)
  const [vTipoIntegracao, setTipoIntegracao] = useState(null)
  const [varDadosIntegracao1, setVarDadosIntegracao1] = useState("")
  const [varDadosIntegracao2, setVarDadosIntegracao2] = useState("")
  const [varDadosIntegracao3, setVarDadosIntegracao3] = useState("")

  const [active, setActive] = useState("1")

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleChangeCP = (e) => {
    const { name, value } = e.target
    setDataCP((prevState) => ({
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
        res.data.map((ret) => ({ label: ret.nome, value: ret.id }))
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

  const onChangeImagemCP = (e) => {
    const reader = new FileReader(),
      files = e.target.files,
      vName = e.target.name
    reader.onload = function () {
      handleChangeCP({
        target: {
          name: vName,
          value: reader.result,
        },
      })
    }
    reader.readAsDataURL(files[0])
  }

  const optTel = { phone: true, phoneRegionCode: "BR" }
  const optCep = { delimiters: [".", "-"], blocks: [2, 3, 3], uppercase: true }

  const setDados = () => {
    vDados.dados_captive = [vDadosCP]
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

    //Verificar dados da integração
    if (data?.dados_captive[0]?.dados_integracao?.length > 2) {
      const vDadosIntegracao = JSON.parse(
        data?.dados_captive[0]?.dados_integracao
      )
      switch (data?.dados_captive[0]?.tipo_integracao) {
        case 5:
          setVarDadosIntegracao1(vDadosIntegracao.hotel_id)
          setVarDadosIntegracao2(vDadosIntegracao.totvs_id)
          break
        case 6:
          setVarDadosIntegracao1(vDadosIntegracao.hotel_id)
          setVarDadosIntegracao2(vDadosIntegracao.service_name)
          break
        case 2:
        case 8:
          setVarDadosIntegracao1(vDadosIntegracao.url)
          setVarDadosIntegracao2(vDadosIntegracao.usuario)
          setVarDadosIntegracao3(vDadosIntegracao.senha)
          break
        case 7:
          setVarDadosIntegracao1(vDadosIntegracao.url)
          setVarDadosIntegracao2(vDadosIntegracao.app)
          setVarDadosIntegracao3(vDadosIntegracao.token)
          break
      }
    }

    if (!vTipoLayout && data?.dados_captive[0]?.layout_captive !== null) {
      setTipoLayout(
        vListaTipoLayout.filter(
          (item) =>
            item.value === Number(data?.dados_captive[0]?.layout_captive || 0)
        )[0]
      )
    }
    if (!vTipoIntegracao && data?.dados_captive[0]?.tipo_integracao !== null) {
      setTipoIntegracao(
        vListaTipoIntegracao.filter(
          (item) =>
            item.value === Number(data?.dados_captive[0]?.tipo_integracao || 0)
        )[0]
      )
    }
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
                  Captive Portal
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
                            Nome completo
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
                        placeholder={"Selecione..."}
                        noOptionsMessage={() => "Vazio"}
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
                        value={vDadosCP?.slug ?? ""}
                        onChange={handleChangeCP}
                      />
                    </Col>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="vCategoria">
                        Categoria
                      </Label>
                      <Select
                        isClearable
                        id="vCategoria"
                        placeholder={"Selecione..."}
                        className="react-select"
                        noOptionsMessage={() => "Vazio"}
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
                        noOptionsMessage={() => "Vazio"}
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
                        placeholder="00 00000 0000"
                        options={optTel}
                        id="whatsapp"
                        name="whatsapp"
                        value={vDados?.whatsapp ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="tel_1">
                        Telefone 1
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder="00 0000 0000"
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
                        placeholder="00 0000 0000"
                        options={optTel}
                        id="tel_2"
                        name="tel_2"
                        value={vDados?.tel_2 ?? ""}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="vCep">
                        CEP
                      </Label>
                      <Cleave
                        className="form-control"
                        placeholder="00.000-000"
                        options={optCep}
                        id="vCep"
                        name="cep"
                        value={vDados?.cep ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="8" className="mb-2">
                      <Label className="form-label" for="vEndereco">
                        Endereço
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
                        Número
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
                        Bairro
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
                        Estado
                      </Label>
                      <Select
                        isClearable
                        id="vEstado"
                        noOptionsMessage={() => "Vazio"}
                        placeholder={"Selecione..."}
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
                        noOptionsMessage={() => "vazio"}
                        LoadingMessage={() => "pesquisando..."}
                        placeholder={"Selecione..."}
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
                        Breve descrição
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
                        Informações gerais
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
              <TabPane tabId="2">
                <Card className="mb-0">
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row>
                      <Col className="mb-2" lg="6">
                        <div className="border rounded p-2">
                          <h5 className="mb-1">Logotipo do Captive Portal</h5>
                          <div className="d-flex flex-column flex-md-row">
                            <img
                              className="me-2 mb-1 mb-md-0 img-fluid img-proporcional"
                              src={
                                vDadosCP?.logo_captive?.length > 0
                                  ? vDadosCP?.logo_captive
                                  : defaultImagem
                              }
                              alt="Logotipo"
                              width="100"
                              height="100"
                            />
                            <div>
                              <div className="mb-1">
                                <small className="text-muted">
                                  Resolução recomendada: 900x900px.
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
                                      name="logo_captive"
                                      onChange={onChangeImagemCP}
                                      hidden
                                      accept=".jpg, .jpeg, .png, .gif, .webp"
                                    />
                                  </Button>
                                  <Link
                                    to="/"
                                    className="text-body"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleChangeCP({
                                        target: {
                                          name: "logo_captive",
                                          value: null,
                                        },
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
                      <Col className="mb-2" lg="6">
                        <div className="border rounded p-2">
                          <h5 className="mb-1">Imagem de fundo</h5>
                          <div className="d-flex flex-column flex-md-row">
                            <img
                              className="me-2 mb-1 mb-md-0 img-fluid img-proporcional"
                              src={
                                vDadosCP?.imagem_fundo?.length > 0
                                  ? vDadosCP?.imagem_fundo
                                  : defaultImagem
                              }
                              alt="Imagem de fundo"
                              width="100"
                              height="100"
                            />
                            <div>
                              <div className="mb-1">
                                <small className="text-muted">
                                  Resolução recomendada: 3000x3000px.
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
                                      name="imagem_fundo"
                                      onChange={onChangeImagemCP}
                                      hidden
                                      accept=".jpg, .jpeg, .png, .gif, .webp"
                                    />
                                  </Button>
                                  <Link
                                    to="/"
                                    className="text-body"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleChangeCP({
                                        target: {
                                          name: "imagem_fundo",
                                          value: null,
                                        },
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
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="tituloCP">
                          Título
                        </Label>
                        <Input
                          value={vDadosCP?.titulo ?? ""}
                          onChange={handleChangeCP}
                          name="titulo"
                          id="tituloCP"
                        />
                      </Col>
                      <Col md="2" className="mb-2">
                        <Label className="form-label" for="cor_primaria">
                          Cor primária
                        </Label>
                        <Input
                          id="cor_primaria"
                          name="cor_primaria"
                          type="color"
                          className="p-0"
                          value={vDadosCP?.cor_primaria ?? ""}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="4" className="mb-2">
                        <Label className="form-label" for="vTipoLayout">
                          Tipo de Layout
                        </Label>
                        <Select
                          placeholder={"Selecione..."}
                          noOptionsMessage={() => "Vazio"}
                          className="react-select"
                          classNamePrefix="select"
                          value={vTipoLayout}
                          onChange={(e) => {
                            setTipoLayout(e)
                            handleChangeCP({
                              target: {
                                name: "layout_captive",
                                value: e.value,
                              },
                            })
                          }}
                          options={vListaTipoLayout}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vMinutosDesconexao">
                          Tempo máximo de conexão do usuário (minutos)
                        </Label>
                        <Input
                          id="vMinutosDesconexao"
                          name="minutos_desconexao"
                          value={vDadosCP?.minutos_desconexao ?? 0}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vRedirectUrl">
                          URL da página exibida após a liberação do usuário
                        </Label>
                        <Input
                          id="vRedirectUrl"
                          name="redirect_url"
                          value={vDadosCP?.redirect_url ?? ""}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vIntelifi">
                          Código Intelifi para anúncios
                        </Label>
                        <Input
                          id="vIntelifi"
                          name="intelifi_hid"
                          value={vDadosCP?.intelifi_hid ?? ""}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vTipoIntegracao">
                          Tipo de integração
                        </Label>
                        <Select
                          id="vTipoIntegracao"
                          placeholder={"Selecione..."}
                          className="react-select"
                          noOptionsMessage={() => "Vazio"}
                          classNamePrefix="select"
                          value={vTipoIntegracao}
                          onChange={(e) => {
                            setTipoIntegracao(e)
                            handleChangeCP({
                              target: {
                                name: "tipo_integracao",
                                value: e.value,
                              },
                            })
                          }}
                          options={vListaTipoIntegracao}
                        />
                      </Col>
                      {vDadosCP?.tipo_integracao === 2 ||
                      vDadosCP?.tipo_integracao === 5 ||
                      vDadosCP?.tipo_integracao === 6 ||
                      vDadosCP?.tipo_integracao === 7 ||
                      vDadosCP?.tipo_integracao === 8 ? (
                        <Fragment>
                          <Col md="12">
                            <div className="divider divider-dark">
                              <div className="divider-text text-dark">
                                Dados extras para a integração
                              </div>
                            </div>
                          </Col>
                          {vDadosCP?.tipo_integracao === 5 ? (
                            <Fragment>
                              <Col md="6" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-1"
                                >
                                  ID do Hotel
                                </Label>
                                <Input
                                  id="dados-integracao-1"
                                  type="number"
                                  value={varDadosIntegracao1}
                                  onChange={(e) => {
                                    setVarDadosIntegracao1(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          hotel_id: e.target.value,
                                          totvs_id: varDadosIntegracao2,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>

                              <Col md="6" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-2"
                                >
                                  ID TOTVs
                                </Label>
                                <Input
                                  id="dados-integracao-2"
                                  type="number"
                                  value={varDadosIntegracao3}
                                  onChange={(e) => {
                                    setVarDadosIntegracao3(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          hotel_id: varDadosIntegracao1,
                                          totvs_id: e.target.value,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                            </Fragment>
                          ) : (
                            ""
                          )}
                          {vDadosCP?.tipo_integracao === 6 ? (
                            <Fragment>
                              <Col md="6" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-1"
                                >
                                  ID do Hotel
                                </Label>
                                <Input
                                  id="dados-integracao-1"
                                  type="number"
                                  value={varDadosIntegracao1}
                                  onChange={(e) => {
                                    setVarDadosIntegracao1(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          hotel_id: e.target.value,
                                          service_name: varDadosIntegracao2,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                              <Col md="6" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-2"
                                >
                                  Prefixo do banco de dados
                                </Label>
                                <Input
                                  id="dados-integracao-2"
                                  value={varDadosIntegracao2}
                                  onChange={(e) => {
                                    setVarDadosIntegracao2(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          hotel_id: varDadosIntegracao1,
                                          service_name: e.target.value,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                            </Fragment>
                          ) : (
                            ""
                          )}
                          {vDadosCP?.tipo_integracao === 2 ||
                          vDadosCP?.tipo_integracao === 8 ? (
                            <Fragment>
                              <Col md="6" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-1"
                                >
                                  URL da API
                                </Label>
                                <Input
                                  id="dados-integracao-1"
                                  value={varDadosIntegracao1}
                                  onChange={(e) => {
                                    setVarDadosIntegracao1(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: e.target.value,
                                          usuario: varDadosIntegracao2,
                                          senha: varDadosIntegracao3,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                              <Col md="3" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-2"
                                >
                                  Usuário
                                </Label>
                                <Input
                                  id="dados-integracao-2"
                                  value={varDadosIntegracao2}
                                  onChange={(e) => {
                                    setVarDadosIntegracao2(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: varDadosIntegracao1,
                                          usuario: e.target.value,
                                          senha: varDadosIntegracao3,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                              <Col md="3" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-3"
                                >
                                  Senha
                                </Label>
                                <Input
                                  id="dados-integracao-3"
                                  value={varDadosIntegracao3}
                                  onChange={(e) => {
                                    setVarDadosIntegracao3(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: varDadosIntegracao1,
                                          usuario: varDadosIntegracao2,
                                          senha: e.target.value,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                            </Fragment>
                          ) : (
                            ""
                          )}
                          {vDadosCP?.tipo_integracao === 7 ? (
                            <Fragment>
                              <Col md="5" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-1"
                                >
                                  URL da API
                                </Label>
                                <Input
                                  id="dados-integracao-1"
                                  value={varDadosIntegracao1}
                                  onChange={(e) => {
                                    setVarDadosIntegracao1(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: e.target.value,
                                          app: varDadosIntegracao2,
                                          token: varDadosIntegracao3,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                              <Col md="3" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-2"
                                >
                                  Nome do APP
                                </Label>
                                <Input
                                  id="dados-integracao-2"
                                  value={varDadosIntegracao2}
                                  onChange={(e) => {
                                    setVarDadosIntegracao2(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: varDadosIntegracao1,
                                          app: e.target.value,
                                          token: varDadosIntegracao3,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                              <Col md="4" className="mb-2">
                                <Label
                                  className="form-label"
                                  for="dados-integracao-3"
                                >
                                  Senha
                                </Label>
                                <Input
                                  id="dados-integracao-3"
                                  value={varDadosIntegracao3}
                                  onChange={(e) => {
                                    setVarDadosIntegracao3(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: "dados_integracao",
                                        value: JSON.stringify({
                                          url: varDadosIntegracao1,
                                          app: varDadosIntegracao2,
                                          token: e.target.value,
                                        }),
                                      },
                                    })
                                  }}
                                />
                              </Col>
                            </Fragment>
                          ) : (
                            ""
                          )}
                        </Fragment>
                      ) : (
                        ""
                      )}
                      <Col md="12" className="mb-1">
                        <div className="divider divider-dark">
                          <div className="divider-text text-dark">
                            Dados que serão solicitados no Captive Portal
                          </div>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vNomeCP"
                            checked={vDadosCP?.nome ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "nome",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vNomeCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar nome
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vEmailCP"
                            checked={vDadosCP?.email ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "email",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vEmailCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar e-mail
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vCpfCP"
                            checked={vDadosCP?.cpf ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "cpf",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vCpfCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar CPF
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vNascimentoCP"
                            checked={vDadosCP?.nascimento ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "nascimento",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vNascimentoCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar data de nascimento
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vCelularCP"
                            checked={vDadosCP?.celular ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "celular",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vCelularCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar celular
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vPaisCP"
                            checked={vDadosCP?.pais ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "pais",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vPaisCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar país
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vCidadeCP"
                            checked={vDadosCP?.cidade ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "cidade",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vCidadeCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar cidade
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vSmsCP"
                            checked={vDadosCP?.usa_sms ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "usa_sms",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vSmsCP"
                            className="form-check-label mt-25"
                          >
                            Enviar token SMS
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vGeneroCP"
                            checked={vDadosCP?.genero ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "genero",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vGeneroCP"
                            className="form-check-label mt-25"
                          >
                            Solicitar gênero
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vBrasileiroCP"
                            checked={vDadosCP?.brasileiro ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "brasileiro",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vBrasileiroCP"
                            className="form-check-label mt-25"
                          >
                            Perguntar nacionalidade
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vLoginSocialCP"
                            checked={vDadosCP?.login_social ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "login_social",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vLoginSocialCP"
                            className="form-check-label mt-25"
                          >
                            Permitir login social
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vHotelCP"
                            checked={vDadosCP?.hotel ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "hotel",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vHotelCP"
                            className="form-check-label mt-25"
                          >
                            É hotel
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vEmpresaRepresentaCP"
                            checked={vDadosCP?.empresa_representa ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "empresa_representa",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vEmpresaRepresentaCP"
                            className="form-check-label mt-25"
                          >
                            Perguntar se é colaborador
                          </Label>
                        </div>
                      </Col>
                      <Col md="8" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vIndicacaoCP"
                            checked={vDadosCP?.indicacao ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: "indicacao",
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vIndicacaoCP"
                            className="form-check-label mt-25"
                          >
                            Perguntar quem indicou o estabelecimento
                          </Label>
                        </div>
                      </Col>
                    </Row>
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
