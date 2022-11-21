// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import Select from "react-select"
import { getClientes } from "../store"

const CardapioCategoriaEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaCliente, setListaClientes] = useState(null)
  const [vCliente, setCliente] = useState(null)

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleClientes = () => {
    getClientes().then((res) => {
      setListaClientes(res)

      if (vDados?.id !== undefined) {
        res?.map((res) => {
          if (res.value === vDados.cliente_id) {
            setCliente({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get filter on mount based on id

  useEffect(() => {
    // ** Requisitar listas
    handleClientes()
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
                  onClick={() => navigate("/cardapio_categoria")}
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
                  <Label className="form-label" for="quarto">
                    Título*
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={vDados?.titulo ?? ""}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="6" className="mb-2">
                  <Label className="form-label" for="cliente_id">
                    Selecione um Cliente*
                  </Label>
                  <Select
                    isClearable
                    id="cliente_id"
                    noOptionsMessage={() => "Vazio"}
                    placeholder={"Selecione..."}
                    value={vCliente}
                    options={vListaCliente}
                    isDisabled={
                      (vDados.id === 0 && data.cliente_id > 0) || vDados.enviado
                    }
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
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="descricao">
                    Descrição
                  </Label>
                  <Input
                    value={vDados?.descricao ?? ""}
                    type="textarea"
                    id="descricao"
                    name="descricao"
                    style={{ minHeight: "100px" }}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="ativo"
                      checked={vDados?.ativo}
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
                      Categoria {vDados?.ativo ? "ativada" : "desativada"}
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

export default CardapioCategoriaEditCard
