// ** React
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap
import {
  Row,
  Col,
  Card,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Label,
  Spinner,
} from 'reactstrap'

// ** Icons
import { Check, Move } from 'react-feather'

import QRCodeCanvas from 'qrcode.react'

// ** Terceiros
import { ReactSortable } from 'react-sortablejs'
import classnames from 'classnames'

// ** Custom Components
import Avatar from '@components/avatar'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

// ** API
import api from '@src/services/api'

// ** Default Imagem
import defaultImagem from '@src/assets/images/pages/semfoto.png'

const CardapioProdutoCard = () => {
  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vListaCategorias, setListaCategorias] = useState(null)
  const [vListaProdutos, setListaProdutos] = useState(null)
  const [vDados, setDados] = useState(null)
  const [vCardapioBase, setCardapioBase] = useState(null)
  const [vPesquisando, setPesquisando] = useState(false)

  // ** State
  const [activeList, setActiveLIst] = useState('0')
  const [active, setActive] = useState('1')

  // ** Guardar o Cliente selecionado para atualizar a página caso mude
  const sClienteId = localStorage.getItem('clienteId')

  const toggleList = (list) => {
    if (activeList !== list) {
      setActiveLIst(list)
      api
        .get(`/cardapio_produto/lista?categoria_id=${list}`)
        .then((response) => {
          setListaProdutos(response.data)
        })
    }
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
      if (tab === '3') {
        document.getElementById('iframe_cardapio').src = `${vDados.link}`
      }
    }
  }

  const handleOrdenarCategoria = (v) => {
    if (
      JSON.stringify(v?.map((item) => item.id)) !==
      JSON.stringify(vListaCategorias?.map((item) => item.id))
    ) {
      setListaCategorias(v)
      api.post('/cardapio_categoria/ordenar', v).then((response) => {
        setListaCategorias(response.data)
      })
    }
  }

  const handleOrdenarProduto = (v) => {
    if (
      JSON.stringify(v?.map((item) => item.id)) !==
      JSON.stringify(vListaProdutos?.map((item) => item.id))
    ) {
      setListaProdutos(v)
      api.post('/cardapio_produto/ordenar', v).then((response) => {
        setListaProdutos(response.data)
      })
    }
  }

  const getDados = () => {
    setPesquisando(true)
    api.get(`/cardapio_categoria/lista`).then((response) => {
      setListaCategorias(response.data)
      if (response.data?.length > 0) {
        toggleList(`${response.data[0].id}`)
      }
    })
    api.get(`/cardapio/informacoes`).then((response) => {
      setDados(response.data)
      setPesquisando(false)
    })
  }

  const handleDuplicar = () => {
    setPesquisando(true)
    api.post(`/cardapio/duplicar/${vCardapioBase.value}`).then(() => {
      getDados()
    })
  }

  const renderCategoria = () => {
    return (
      <div className="nav-vertical">
        <h5 className="text-center mb-1">
          <strong>{t('Categorias')}</strong>
        </h5>
        <Nav tabs className="nav-left todo-app-list list-group w-100 mb-0">
          {vListaCategorias?.length ? (
            <ReactSortable
              tag="ul"
              list={vListaCategorias}
              handle=".drag-icon"
              className="todo-list media-list"
              setList={(newState) => handleOrdenarCategoria(newState)}
            >
              {vListaCategorias.map((item, index) => {
                return (
                  <NavItem
                    className="ps-0"
                    key={`nav-item-${item.id}-${index}`}
                  >
                    <NavLink
                      key={`nav-link-${item.id}-${index}`}
                      className={classnames('todo-item cursor-pointer', {
                        active: activeList === `${item.id}`,
                      })}
                      onClick={() => toggleList(`${item.id}`)}
                    >
                      <div className="todo-title-wrapper">
                        <div className="todo-title-area w-100">
                          <Move className="drag-icon" />
                          <div className="w-100 pe-2 ps-1">{item.titulo}</div>
                        </div>
                      </div>
                    </NavLink>
                  </NavItem>
                )
              })}
            </ReactSortable>
          ) : (
            <div className="no-results show"></div>
          )}
        </Nav>
      </div>
    )
  }

  const renderProduto = () => {
    return (
      <div className="todo-app-list list-group">
        <h5 className="text-center mb-1">
          <strong>Produtos</strong>
        </h5>
        {vListaProdutos?.length ? (
          <ReactSortable
            tag="ul"
            list={vListaProdutos}
            handle=".drag-icon"
            className="todo-list media-list"
            setList={(newState) => handleOrdenarProduto(newState)}
          >
            {vListaProdutos.map((produto, produto_index) => {
              return (
                <li
                  key={`li-prod-${produto.id}-${produto_index}`}
                  className="todo-item"
                >
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area w-100">
                      <Move className="drag-icon" />
                      <div className="d-flex justify-content-left align-items-center">
                        <Avatar
                          className="me-50 img-proporcional"
                          img={produto.imagem ?? defaultImagem}
                          width="32"
                          height="32"
                        />
                        <div className="d-flex flex-column">
                          <div>
                            <h6 className="user-name text-truncate mb-0">
                              {produto.titulo ?? ''}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ReactSortable>
        ) : null}
      </div>
    )
  }

  const downloadQR = () => {
    const canvas = document.getElementById('QrCode')
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'QrCode.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  // ** Get filter on mount based on id
  useEffect(() => {
    getDados()
  }, [])

  return sClienteId?.length > 0 ? (
    <Row>
      <Col sm="12">
        <Card className="p-2 pb-0">
          {vPesquisando ? (
            <div className="text-center mb-2">
              <Spinner color="primary" />
            </div>
          ) : vDados?.existe ? (
            <Fragment>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    active={active === '1'}
                    onClick={() => {
                      toggle('1')
                    }}
                  >
                    QrCode
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '2'}
                    onClick={() => {
                      toggle('2')
                    }}
                  >
                    {t('Ordenar itens')}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={active === '3'}
                    onClick={() => {
                      toggle('3')
                    }}
                  >
                    {t('Visualização final')}
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent className="py-50" activeTab={active}>
                <TabPane tabId="1">
                  <Card className="mb-0">
                    <Row>
                      <Col md="12" className="mb-2 text-center">
                        <QRCodeCanvas
                          id="QrCode"
                          value={vDados?.link}
                          size={400}
                          level={'H'}
                          includeMargin={false}
                        />
                      </Col>
                      <Col md="12" className="mb-2 text-center">
                        <Button
                          color="primary"
                          onClick={() => downloadQR()}
                          outline
                        >
                          Baixar QrCode
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
                <TabPane tabId="2">
                  <Card className="mb-0">
                    <Row>
                      <Col md="4" className="mb-1 border-end">
                        {renderCategoria()}
                      </Col>
                      <Col md="8" className="mb-1">
                        {renderProduto()}
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
                <TabPane tabId="3">
                  <Card className="mb-0">
                    <Row>
                      <Col md="12" className="text-center mb-1">
                        <iframe
                          height="700px"
                          width="400px"
                          id="iframe_cardapio"
                          src=""
                        ></iframe>
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
              </TabContent>
            </Fragment>
          ) : vDados?.cardapios?.length > 1 ? (
            <Card className="mb-0">
              <Row>
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="cliente_id">
                    {t(
                      'O Cliente não possui cardápio digital, mas você pode criar um, duplicando o cardápio existente no cliente abaixo'
                    )}
                  </Label>
                  <Select
                    isClearable
                    id="cliente_id"
                    noOptionsMessage={() => t('Vazio')}
                    placeholder={t('Selecione...')}
                    value={vCardapioBase}
                    options={vDados.cardapios}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(e) => {
                      setCardapioBase(e)
                    }}
                  />
                </Col>
                <Col md="12" className="mb-2 text-center">
                  <Button
                    color="primary"
                    onClick={() => handleDuplicar()}
                    disabled={!vCardapioBase}
                  >
                    {t('Duplicar')}
                  </Button>
                </Col>
              </Row>
            </Card>
          ) : null}
        </Card>
      </Col>
    </Row>
  ) : (
    <Card className="mb-0">
      <Row>
        <Col md="12" className="m-2 text-center">
          <h5 className="m-0">{t('Selecione um cliente no campo acima')}</h5>
        </Col>
      </Row>
    </Card>
  )
}

export default CardapioProdutoCard
