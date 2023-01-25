// ** React
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classnames from 'classnames'

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
  ListGroup,
  ListGroupItem,
  CardBody,
  Spinner,
} from 'reactstrap'

// ** Default Imagem
import defaultImagem from '@src/assets/images/pages/semfoto.png'

// ** Icons
import {
  CornerUpLeft,
  Check,
  Trash,
  Frown,
  Smile,
  Plus,
  Move,
} from 'react-feather'

// ** Terceiros
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

// ** Utils
import { getUserData, campoInvalido, mostrarMensagem } from '@utils'

import { getClientes, getMarcas, getConectados } from '../store'
import { auto } from '@popperjs/core'

const vUserData = getUserData()

const vListaTipoIntegracao = [
  { value: 0, label: 'Nenhuma' },
  { value: 1, label: 'Taboca' },
  { value: 2, label: 'IXC Soft' },
  { value: 3, label: 'Max Atacadista' },
  { value: 4, label: 'Clubefato' },
  { value: 5, label: 'TOTVs API' },
  { value: 6, label: 'TOTVs Oracle' },
  { value: 7, label: 'CaririSGP' },
  { value: 8, label: 'IXC Leads' },
]

const vListaTipoLayout = [
  { value: 0, label: 'Layout Padrão' },
  { value: 1, label: 'Layout Alternativo' },
]

const HotspotEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()
  // ** Hooks
  const { t } = useTranslation()
  const [vErros, setErros] = useState({})
  const [vErrosCP, setErrosCP] = useState({})

  const vCamposObrigatorios = [
    { nome: 'nome' },
    { nome: 'cliente_id', tipo: 'int' },
    { nome: 'marca_equipamento', tipo: 'int' },
    { nome: 'lat', tipo: 'int' },
    { nome: 'lng', tipo: 'int' },
  ]

  const vCamposObrigatoriosCP = [{ nome: 'redirect_url' }]

  // ** States
  const [vDados, setData] = useState(data)
  const [vCliente, setCliente] = useState(null)
  const [vMarca, setMarca] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const [vListaMarcas, setListaMarcas] = useState(null)
  const [vVerificandoControladora, setVerificandoControladora] = useState(false)
  const [vControladoraOK, setControladoraOK] = useState(false)
  const [vListaConectados, setListaConectados] = useState(null)

  // Captive Portal
  const [vDadosCP, setDataCP] = useState(
    data?.dados_captive?.length > 0 ? data.dados_captive[0] : null
  )
  const [vTipoLayout, setTipoLayout] = useState(null)
  const [vTipoIntegracao, setTipoIntegracao] = useState(null)
  const [varDadosIntegracao1, setVarDadosIntegracao1] = useState('')
  const [varDadosIntegracao2, setVarDadosIntegracao2] = useState('')
  const [varDadosIntegracao3, setVarDadosIntegracao3] = useState('')

  const [active, setActive] = useState('1')

  // ** Bloquear ações de onChange
  const blockChange = () => {}

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

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const handleClientes = () => {
    getClientes().then((re) => {
      setListaClientes(re)

      if (vDados?.id !== undefined) {
        re?.map((res) => {
          if (res.value === vDados.cliente_id) {
            setCliente({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const handleConectados = () => {
    if (vDados.marca_equipamento === 1 && !vDados.usa_radius) {
      setVerificandoControladora(true)
      setControladoraOK(false)
      getConectados(vDados.id)
        .then((re) => {
          setListaConectados(re)
          setVerificandoControladora(false)
          setControladoraOK(true)
        })
        .catch((erro) => {
          let vErro = ''
          setVerificandoControladora(false)
          if (erro.response.status === 503) {
            vErro = erro.response.data
          } else if (erro.response.status === 404) {
            vErro = 'Seu login não está autorizado'
          } else {
            vErro = 'Erro inesperado'
          }
          setListaConectados([vErro])
          setControladoraOK(false)
        })
    }
  }

  const handleMarcas = () => {
    getMarcas().then((re) => {
      setListaMarcas(re)

      if (vDados?.id !== undefined) {
        re?.map((res) => {
          if (res.value === vDados.marca_equipamento) {
            setMarca({ value: res.value, label: res.label })
          }
        })
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

    vCamposObrigatoriosCP.forEach((campo) => {
      if (campoInvalido(vDadosCP, null, campo.nome, campo.tipo)) {
        vCamposOK = false
        setErrosCP((ant) => ({
          ...ant,
          [campo.nome]: {},
        }))
      }
    })

    if (vCamposOK) {
      vDados.dados_captive = [vDadosCP]
      setSalvarDados(vDados)
    } else {
      mostrarMensagem(
        'Atenção!',
        'Preencha todos os campos obrigatórios.',
        'warning'
      )
    }
  }

  // ** Get Hotspot on mount based on id
  useEffect(() => {
    handleClientes()
    handleMarcas()
    handleConectados()

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

  const handleChangeItem = (v, i, n) => {
    const { access_point: vItem } = vDados
    vItem[i] = {
      ...vItem[i],
      [n]: v,
    }
    setData((prevState) => ({
      ...prevState,
      access_point: vItem,
    }))
  }

  const handleRemoveItem = (index) => {
    setData((prevState) => {
      return {
        ...prevState,
        access_point: [
          ...prevState.access_point.slice(0, index),
          ...prevState.access_point.slice(index + 1),
        ],
      }
    })
  }

  const renderItens = () => {
    return (
      <ul className={`todo-app-list list-group`}>
        {vDados?.access_point.map((item, index) => {
          const marca_equip =
            vListaMarcas &&
            vListaMarcas.map((data) => {
              if (data.value === item.marca_equipamento) {
                return data
              }
            })[item.marca_equipamento - 1]

          return (
            <li
              key={`${item.id}-${index}`}
              className="todo-item list-group-item "
            >
              <div className="todo-title-wrapper mb-3">
                <div className="todo-title-area w-100">
                  <Row>
                    <Col md="8" className="mt-2">
                      <Label className="form-label" for="nome">
                        Nome para identificação*
                      </Label>
                      <Input
                        value={item.nome ?? ''}
                        onChange={(e) => {
                          handleChangeItem(e?.target.value, index, 'nome')
                        }}
                      />
                    </Col>
                    <Col md="4" className="mt-2">
                      <Label className="form-label" for="nome">
                        Marca do equipamento*
                      </Label>

                      <Select
                        id="marca_equipamento"
                        noOptionsMessage={() => t('Vazio')}
                        placeholder={t(
                          (marca_equip && marca_equip.label) ?? 'Selecione...'
                        )}
                        classNamePrefix="select"
                        value={(marca_equip && marca_equip.label) ?? ''}
                        onChange={(e) => {
                          handleChangeItem(e?.value, index, 'marca_equipamento')
                          handleChangeItem(
                            e?.label,
                            index,
                            'marca_equipamento_name'
                          )
                        }}
                        options={vListaMarcas}
                      />
                    </Col>
                    <Col md="4" className="mt-2">
                      <Label className="form-label" for="nome">
                        MAC
                      </Label>
                      <Input
                        value={item.mac ?? ''}
                        onChange={(e) => {
                          handleChangeItem(e?.target.value, index, 'mac')
                        }}
                      />
                    </Col>

                    {vDados?.access_point.id === item.id &&
                    vDados?.access_point.marca_equipamento === 8 ? (
                      <Col md="4" className="mt-2">
                        <Label
                          className="form-label"
                          for="controladora_usuario"
                        >
                          Nome do site Unifi
                        </Label>
                        <Input
                          id="site_unifi"
                          name="site_unifi"
                          value={vDados?.site_unifi ?? ''}
                          onChange={handleChange}
                        />
                      </Col>
                    ) : null}
                    <Col md="4" className="mt-2">
                      <Label className="form-label" for="nome">
                        Latitude*
                      </Label>
                      <Input
                        value={item.lat ?? 0}
                        // invalid={campoInvalido(
                        //   vDados,
                        //   vErros,
                        //   'lat_access',
                        //   'int'
                        // )}
                        onChange={(e) => {
                          handleChangeItem(e?.target.value, index, 'lat')
                        }}
                      />
                    </Col>
                    <Col md="4" className="mt-2">
                      <Label className="form-label" for="nome">
                        Longitude*
                      </Label>
                      <Input
                        value={item.lng ?? 0}
                        // invalid={campoInvalido(
                        //   vDados,
                        //   vErros,
                        //   'lng_access',
                        //   'int'
                        // )}
                        onChange={(e) => {
                          handleChangeItem(e?.target.value, index, 'lng')
                        }}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="todo-item-action mt-2">
                  <Link
                    to="/"
                    className="text-body d-flex align-items-center"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveItem(index)
                    }}
                  >
                    <Trash className="font-medium-3 text-danger cursor-pointer" />
                    Excluir Access Point #{index + 1}
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  const handleAddItem = () => {
    setData((prevState) => {
      return {
        ...prevState,
        access_point: [
          ...prevState.access_point,
          {
            id: 0,
          },
        ],
      }
    })
  }

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
                  active={active === '1'}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  Dados principais
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  Captive Portal
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '3'}
                  onClick={() => {
                    toggle('3')
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
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="nome">
                        Nome para identificação*
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={vDados?.nome ?? ''}
                        onChange={handleChange}
                        invalid={campoInvalido(vDados, vErros, 'nome')}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="marca_equipamento">
                        Marca da controladora*
                      </Label>
                      <Select
                        id="marca_equipamento"
                        noOptionsMessage={() => t('Vazio')}
                        placeholder={t('Selecione...')}
                        className={classnames('react-select', {
                          'is-invalid': campoInvalido(
                            vDados,
                            vErros,
                            'marca_equipamento',
                            'int'
                          ),
                        })}
                        classNamePrefix="select"
                        value={vMarca}
                        onChange={(e) => {
                          setMarca(e)
                          handleChange({
                            target: {
                              name: 'marca_equipamento',
                              value: e.value,
                            },
                          })
                        }}
                        options={vListaMarcas}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="hash">
                        Hash / Licença
                      </Label>
                      <Input
                        id="hash"
                        name="hash"
                        disabled={data.id > 0}
                        value={vDados?.hash ?? ''}
                        onChange={
                          data.id > 0 ? blockChange : (e) => handleChange(e)
                        }
                      />
                    </Col>
                    <Col
                      md={vUserData.perfil === 'adm' ? '6' : '9'}
                      className="mb-2"
                    >
                      <Label className="form-label" for="cliente_id">
                        Cliente*
                      </Label>
                      <Select
                        isClearable
                        id="cliente_id"
                        noOptionsMessage={() => t('Vazio')}
                        placeholder={t('Selecione...')}
                        value={vCliente}
                        isDisabled={vDados.id === 0 && data.cliente_id > 0}
                        options={vListaClientes}
                        className={classnames('react-select', {
                          'is-invalid': campoInvalido(
                            vDados,
                            vErros,
                            'cliente_id',
                            'int'
                          ),
                        })}
                        classNamePrefix="select"
                        onChange={(e) => {
                          setCliente(e)
                          handleChange({
                            target: {
                              name: 'cliente_id',
                              value: Number(e?.value),
                            },
                          })
                        }}
                      />
                    </Col>

                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="mac">
                        MAC
                      </Label>

                      <Input
                        id="mac"
                        name="mac"
                        value={vDados?.mac ?? ''}
                        onChange={handleChange}
                      />
                    </Col>
                    {vUserData.perfil === 'adm' ? (
                      <Col md="3" className="mb-2">
                        <Label className="form-label" for="id">
                          ID do Hotspot
                        </Label>
                        <Input
                          id="id"
                          name="id"
                          type="number"
                          disabled={data.id > 0}
                          value={vDados?.id ?? ''}
                          onChange={
                            data.id > 0 ? blockChange : (e) => handleChange(e)
                          }
                        />
                      </Col>
                    ) : null}
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="ip">
                        IP de liberação
                      </Label>
                      <Input
                        id="ip"
                        name="ip"
                        value={vDados?.ip ?? ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="porta">
                        Porta de liberação
                      </Label>
                      <Input
                        id="porta"
                        name="porta"
                        type="number"
                        value={vDados?.porta ?? ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="controladora_usuario">
                        Usuário de liberação
                      </Label>
                      <Input
                        id="controladora_usuario"
                        name="controladora_usuario"
                        value={vDados?.controladora_usuario ?? ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="controladora_senha">
                        Senha de liberação
                      </Label>
                      <Input
                        id="controladora_senha"
                        name="controladora_senha"
                        type="password"
                        autoComplete="new-password"
                        value={vDados?.controladora_senha ?? ''}
                        onChange={handleChange}
                      />
                    </Col>
                    {vDados?.marca_equipamento === 8 ? (
                      <Col md="3" className="mb-2">
                        <Label
                          className="form-label"
                          for="controladora_usuario"
                        >
                          Nome do site Unifi
                        </Label>
                        <Input
                          id="site_unifi"
                          name="site_unifi"
                          value={vDados?.site_unifi ?? ''}
                          onChange={handleChange}
                        />
                      </Col>
                    ) : null}
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="lat">
                        Latitude*
                      </Label>
                      <Input
                        id="lat"
                        name="lat"
                        value={vDados?.lat ?? ''}
                        onChange={handleChange}
                        invalid={campoInvalido(vDados, vErros, 'lat', 'int')}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="lng">
                        Longitude*
                      </Label>
                      <Input
                        id="lng"
                        name="lng"
                        value={vDados?.lng ?? ''}
                        onChange={handleChange}
                        invalid={campoInvalido(vDados, vErros, 'lng', 'int')}
                      />
                    </Col>
                    <Col md="3" className="mb-2 pt-md-2">
                      <div className="form-check form-switch pt-md-75">
                        <Input
                          type="switch"
                          id="usa_radius"
                          checked={vDados?.usa_radius ?? false}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                name: 'usa_radius',
                                value: e.target.checked,
                              },
                            })
                          }}
                        />
                        <Label
                          for="usa_radius"
                          className="form-check-label mt-25"
                        >
                          Utilizar RADIUS
                        </Label>
                      </div>
                    </Col>
                    <Col md="12" className="mb-1">
                      <div className="form-check form-switch">
                        <Input
                          type="switch"
                          id="ativo"
                          checked={vDados?.ativo ?? false}
                          onChange={(e) => {
                            handleChange({
                              target: {
                                name: 'ativo',
                                value: e.target.checked,
                              },
                            })
                          }}
                        />
                        <Label for="ativo" className="form-check-label mt-25">
                          Hotspot {vDados?.ativo ? 'ativado' : 'desativado'}
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <Col md="12">{renderItens()}</Col>

                  <Col md="12" className="mt-2 mb-1">
                    <Link
                      to="/"
                      className="text-primary d-flex justify-content-left align-items-center"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddItem()
                      }}
                    >
                      <Plus className="font-medium-3 cursor-pointer" />
                      <span className="ms-25">Adicionar Access Point</span>
                    </Link>
                  </Col>
                </Card>
              </TabPane>
              <TabPane tabId="2">
                <Card className="mb-0">
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row>
                      <Col className="mb-2" md="6">
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
                                          name: 'logo_captive',
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
                      <Col className="mb-2" md="6">
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
                                          name: 'imagem_fundo',
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
                          value={vDadosCP?.titulo ?? ''}
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
                          value={vDadosCP?.cor_primaria ?? ''}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="4" className="mb-2">
                        <Label className="form-label" for="vTipoLayout">
                          Tipo de Layout
                        </Label>
                        <Select
                          placeholder={t('Selecione...')}
                          noOptionsMessage={() => t('Vazio')}
                          className="react-select"
                          classNamePrefix="select"
                          value={vTipoLayout}
                          onChange={(e) => {
                            setTipoLayout(e)
                            handleChangeCP({
                              target: {
                                name: 'layout_captive',
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
                          URL da página exibida após a liberação do usuário*
                        </Label>
                        <Input
                          id="vRedirectUrl"
                          name="redirect_url"
                          value={vDadosCP?.redirect_url ?? ''}
                          onChange={handleChangeCP}
                          invalid={campoInvalido(
                            vDadosCP,
                            vErrosCP,
                            'redirect_url'
                          )}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vIntelifi">
                          Código Intelifi para anúncios
                        </Label>
                        <Input
                          id="vIntelifi"
                          name="intelifi_hid"
                          value={vDadosCP?.intelifi_hid ?? ''}
                          onChange={handleChangeCP}
                        />
                      </Col>
                      <Col md="6" className="mb-2">
                        <Label className="form-label" for="vTipoIntegracao">
                          Tipo de integração
                        </Label>
                        <Select
                          id="vTipoIntegracao"
                          placeholder={t('Selecione...')}
                          className="react-select"
                          noOptionsMessage={() => t('Vazio')}
                          classNamePrefix="select"
                          value={vTipoIntegracao}
                          onChange={(e) => {
                            setTipoIntegracao(e)
                            handleChangeCP({
                              target: {
                                name: 'tipo_integracao',
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
                                        name: 'dados_integracao',
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
                                  value={varDadosIntegracao2}
                                  onChange={(e) => {
                                    setVarDadosIntegracao2(e.target.value)
                                    handleChangeCP({
                                      target: {
                                        name: 'dados_integracao',
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
                            ''
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
                                        name: 'dados_integracao',
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
                                        name: 'dados_integracao',
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
                            ''
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
                                        name: 'dados_integracao',
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
                                        name: 'dados_integracao',
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
                                        name: 'dados_integracao',
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
                            ''
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
                                        name: 'dados_integracao',
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
                                        name: 'dados_integracao',
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
                                        name: 'dados_integracao',
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
                            ''
                          )}
                        </Fragment>
                      ) : (
                        ''
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
                                  name: 'nome',
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
                                  name: 'email',
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
                                  name: 'cpf',
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
                                  name: 'nascimento',
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
                                  name: 'celular',
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
                                  name: 'pais',
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
                                  name: 'cidade',
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
                      {vUserData.perfil === 'adm' ? (
                        <Col md="4" className="mb-2">
                          <div className="form-check form-switch">
                            <Input
                              type="switch"
                              id="vSmsCP"
                              checked={vDadosCP?.usa_sms ?? false}
                              onChange={(e) => {
                                handleChangeCP({
                                  target: {
                                    name: 'usa_sms',
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
                      ) : null}
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vGeneroCP"
                            checked={vDadosCP?.genero ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: 'genero',
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
                                  name: 'brasileiro',
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
                                  name: 'login_social',
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
                                  name: 'hotel',
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
                                  name: 'empresa_representa',
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
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="vIndicacaoCP"
                            checked={vDadosCP?.indicacao ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: 'indicacao',
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="vIndicacaoCP"
                            className="form-check-label mt-25"
                          >
                            Perguntar quem indicou o local
                          </Label>
                        </div>
                      </Col>
                      <Col md="4" className="mb-2">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            id="aceite_comunicacao"
                            checked={vDadosCP?.aceite_comunicacao ?? false}
                            onChange={(e) => {
                              handleChangeCP({
                                target: {
                                  name: 'aceite_comunicacao',
                                  value: e.target.checked,
                                },
                              })
                            }}
                          />
                          <Label
                            for="aceite_comunicacao"
                            className="form-check-label mt-25"
                          >
                            Pedir aceite de comunicações
                          </Label>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </TabPane>
              <TabPane tabId="3">
                <Card className="mb-0">
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <Row>
                      {vDados.marca_equipamento === 1 && !vDados.usa_radius ? (
                        <Col md="12" className="mb-2">
                          <Card className="mb-4">
                            <CardBody>
                              <h6 className="mb-75 text-center">
                                Teste de comunicação
                                {!vVerificandoControladora ? (
                                  <span>
                                    {vControladoraOK ? (
                                      <Smile
                                        size={24}
                                        className="ms-1 text-success"
                                      />
                                    ) : (
                                      <Frown
                                        size={24}
                                        className="ms-1 text-danger"
                                      />
                                    )}
                                    <Button
                                      className="ms-1"
                                      color="primary"
                                      outline
                                      onClick={handleConectados}
                                    >
                                      Verificar agora
                                    </Button>
                                  </span>
                                ) : (
                                  <Spinner
                                    type="grow"
                                    size="sm"
                                    className="ms-1"
                                    color="primary"
                                  />
                                )}
                              </h6>
                              <div
                                style={{ maxHeight: '290px', overflow: auto }}
                              >
                                <ListGroup flush>
                                  <pre>
                                    {!vVerificandoControladora
                                      ? vListaConectados?.length > 0
                                        ? vListaConectados.map(
                                            (item, index) => {
                                              return (
                                                <ListGroupItem
                                                  className="fonte-courier p-25"
                                                  key={index}
                                                >
                                                  {item}
                                                </ListGroupItem>
                                              )
                                            }
                                          )
                                        : null
                                      : null}
                                  </pre>
                                </ListGroup>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      ) : null}
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

export default HotspotEditCard
