// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"

import { getClientes, getMarcas } from "../store"

const HotspotEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vCliente, setCliente] = useState(null)
  const [vMarca, setMarca] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)
  const [vListaMarcas, setListaMarcas] = useState(null)

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
    setSalvarDados(vDados)
  }

  // ** Get Hotspot on mount based on id
  useEffect(() => {
    handleClientes()
    handleMarcas()
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
                  Dados principais
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
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="nome">
                        Nome para identificação
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={vDados?.nome ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="6" className="mb-2">
                      <Label className="form-label" for="cliente_id">
                        Cliente
                      </Label>
                      <Select
                        isClearable
                        id="cliente_id"
                        noOptionsMessage={() => "Vazio"}
                        placeholder={"Selecione..."}
                        value={vCliente}
                        options={vListaClientes}
                        className="react-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          setCliente(e)
                          handleChange({
                            target: {
                              name: "cliente_id",
                              value: Number(e?.value),
                            },
                          })
                        }}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="marca_equipamento">
                        Marca da controladora
                      </Label>
                      <Select
                        id="marca_equipamento"
                        noOptionsMessage={() => "Vazio"}
                        placeholder={"Selecione..."}
                        className="react-select"
                        classNamePrefix="select"
                        value={vMarca}
                        onChange={(e) => {
                          setMarca(e)
                          handleChange({
                            target: {
                              name: "marca_equipamento",
                              value: e.value,
                            },
                          })
                        }}
                        options={vListaMarcas}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="hash">
                        Hash / Licença
                      </Label>
                      <Input
                        id="hash"
                        name="hash"
                        value={vDados?.hash ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="mac">
                        MAC
                      </Label>

                      <Input
                        id="mac"
                        name="mac"
                        value={vDados?.mac ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="ip">
                        IP de liberação
                      </Label>
                      <Input
                        id="ip"
                        name="ip"
                        value={vDados?.ip ?? ""}
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
                        value={vDados?.porta ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="usuario">
                        Usuário de liberação
                      </Label>
                      <Input
                        id="usuario"
                        name="usuario"
                        value={vDados?.usuario ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="3" className="mb-2">
                      <Label className="form-label" for="senha">
                        Senha de liberação
                      </Label>
                      <Input
                        id="senha"
                        name="senha"
                        type="password"
                        autoComplete="new-password"
                        value={vDados?.senha ?? ""}
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="radius_usu">
                        Usuário RADIUS
                      </Label>
                      <Input
                        id="radius_usu"
                        name="radius_usu"
                        value={vDados?.radius_usu ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="radius_pwd">
                        Senha RADIUS
                      </Label>
                      <Input
                        id="radius_pwd"
                        name="radius_pwd"
                        type="password"
                        autoComplete="new-password"
                        value={vDados?.radius_pwd ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md="4" className="mb-2">
                      <Label className="form-label" for="radius_secret">
                        Secret RADIUS
                      </Label>
                      <Input
                        id="radius_secret"
                        name="radius_secret"
                        type="password"
                        autoComplete="new-password"
                        value={vDados?.radius_secret ?? ""}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tabId="2">
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

export default HotspotEditCard
