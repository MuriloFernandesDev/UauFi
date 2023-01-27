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
} from 'reactstrap'

// ** Icons
import { Check, Move } from 'react-feather'

// ** Terceiros
import { ReactSortable } from 'react-sortablejs'
import classnames from 'classnames'

// ** Custom Components
import Avatar from '@components/avatar'

// ** API
import api from '@src/services/api'

// ** Default Imagem
import defaultImagem from '@src/assets/images/pages/semfoto.png'

const CardapioProdutoCard = ({ setSalvarDados }) => {
  // ** States
  const [vListaCategorias, setListaCategorias] = useState(null)
  const [vListaProdutos, setListaProdutos] = useState(null)

  // ** State
  const [activeList, setActiveLIst] = useState('0')

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

  const renderCategoria = () => {
    return (
      <div className="nav-vertical">
        <Nav tabs className="nav-left todo-app-list list-group">
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
                  <NavItem>
                    <NavLink
                      key={`${item.id}-${index}`}
                      className={classnames('todo-item cursor-pointer', {
                        active: activeList === `${item.id}`,
                      })}
                      onClick={() => toggleList(`${item.id}`)}
                      action
                    >
                      <div className="todo-title-wrapper">
                        <div className="todo-title-area w-100">
                          <Move className="drag-icon" />
                          <div className="w-100 pe-2 ps-2">{item.titulo}</div>
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
      <div className="todo-app-list list-group mb-2">
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
                  key={`${produto.id}-${produto_index}`}
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

  // ** Get filter on mount based on id
  useEffect(() => {
    api.get(`/cardapio_categoria/lista`).then((response) => {
      setListaCategorias(response.data)
    })
  }, [])

  return (
    <Row>
      <Col sm="12">
        <Fragment>
          <Card className="mb-1">
            <div className="d-flex justify-content-between flex-row m-1">
              <div></div>
              <div>
                <Button.Ripple
                  color="success"
                  onClick={setSalvarDados(vListaCategorias)}
                >
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
                <Col md="4" className="mb-2">
                  {renderCategoria()}
                </Col>
                <Col md="8" className="mb-2">
                  {renderProduto()}
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
