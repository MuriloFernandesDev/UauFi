// ** React
import { Fragment, useEffect, useState } from "react"

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
} from "reactstrap"

// ** Icons
import { Check, Move } from "react-feather"

// ** Terceiros
import { ReactSortable } from "react-sortablejs"
import classnames from "classnames"

// ** Custom Components
import Avatar from "@components/avatar"

// ** API
import api from "@src/services/api"

// ** Default Imagem
import defaultImagem from "@src/assets/images/pages/semfoto.png"

const CardapioProdutoCard = () => {
  // ** States
  const [vListaCategorias, setListaCategorias] = useState(null)
  const [vListaProdutos, setListaProdutos] = useState(null)

  // ** State
  const [activeList, setActiveLIst] = useState("0")
  const [active, setActive] = useState("1")

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
    }
  }

  const handleOrdenarCategoria = (v) => {
    if (
      JSON.stringify(v?.map((item) => item.id)) !==
      JSON.stringify(vListaCategorias?.map((item) => item.id))
    ) {
      setListaCategorias(v)
      api.post("/cardapio_categoria/ordenar", v).then((response) => {
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
      api.post("/cardapio_produto/ordenar", v).then((response) => {
        setListaProdutos(response.data)
      })
    }
  }

  const renderCategoria = () => {
    return (
      <div className="nav-vertical">
        <h5 className="text-center mb-1">
          <strong>Categorias</strong>
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
                  <NavItem className="ps-0">
                    <NavLink
                      key={`${item.id}-${index}`}
                      className={classnames("todo-item cursor-pointer", {
                        active: activeList === `${item.id}`,
                      })}
                      onClick={() => toggleList(`${item.id}`)}
                      action
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
                  key={`${produto.id}-${produto_index}`}
                  className="todo-item"
                >
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area w-100">
                      <Move className="drag-icon" />
                      <div className="d-flex justify-content-left align-items-center">
                        <Avatar
                          className="me-50"
                          img={produto.imagem ?? defaultImagem}
                          width="32"
                          height="32"
                        />
                        <div className="d-flex flex-column">
                          <div>
                            <h6 className="user-name text-truncate mb-0">
                              {produto.titulo ?? ""}
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
                  Link / QrCode
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === "2"}
                  onClick={() => {
                    toggle("2")
                  }}
                >
                  Ordenar itens
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === "3"}
                  onClick={() => {
                    toggle("3")
                  }}
                >
                  Visualização final
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="py-50" activeTab={active}>
              <TabPane tabId="1">
                <Card className="mb-0">
                  <Row>
                    <Col md="12" className="mb-2">
                      QrCode
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
            </TabContent>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default CardapioProdutoCard
