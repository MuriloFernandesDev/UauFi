// ** React
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, Table } from "reactstrap"

// ** Icons
import { CornerUpLeft, Check } from "react-feather"

// ** Terceiros
import "cleave.js/dist/addons/cleave-phone.br"
import Select from "react-select"

// ** API
import api from "@src/services/api"

const ClienteLoginEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** States
  const [vDados, setData] = useState(data)
  const [vCliente, setCliente] = useState(null)
  const [vListaClientes, setListaClientes] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleChangeCBX = (e) => {
    const { name } = e.target,
      pos = Number(e.target.attributes.pos.value)

    const vDadosAnt =
      vDados[name] && vDados[name].length >= pos
        ? vDados[name]
        : (vDados[name] ?? "").padEnd(pos, "0")

    const vNovoValor =
      vDadosAnt.substring(0, pos - 1) +
      (e.target.checked ? "1" : "0") +
      vDadosAnt.substring(pos + 1)

    setData((prevState) => ({
      ...prevState,
      [name]: vNovoValor,
    }))
  }

  const getClientes = () => {
    return api.get("/cliente/lista_simples").then((res) => {
      setListaClientes(res.data)

      //Selecionar o item no componente
      if (data?.clientes) {
        const vClienteArray = data?.clientes
          ?.split(",")
          .map((item) => parseInt(item))
        setCliente(
          res.data?.filter((item) => vClienteArray?.includes(item.value))
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

  const setDados = () => {
    setSalvarDados(vDados)
  }

  // ** Get cliente on mount based on id
  useEffect(() => {
    // ** Requisitar listas
    getClientes()
  }, [])

  // ** Table columns
  const renderAcesso = (descricao, campo, arrayPos) => {
    return (
      <tr>
        <td className="text-start">{descricao}</td>
        {!arrayPos || arrayPos.includes(1) ? (
          <td>
            <div className="d-flex form-check justify-content-center">
              <Input
                type="checkbox"
                name={campo}
                pos={1}
                checked={vDados[campo]?.substring(0, 1) === "1"}
                onChange={handleChangeCBX}
              />
            </div>
          </td>
        ) : null}
        {!arrayPos || arrayPos.includes(2) ? (
          <td>
            <div className="d-flex form-check justify-content-center">
              <Input
                type="checkbox"
                name={campo}
                pos={2}
                defaultChecked={vDados[campo]?.substring(1, 2) === "1"}
                onChange={handleChangeCBX}
              />
            </div>
          </td>
        ) : null}
        {!arrayPos || arrayPos.includes(3) ? (
          <td>
            <div className="d-flex form-check justify-content-center">
              <Input
                type="checkbox"
                name={campo}
                pos={3}
                defaultChecked={vDados[campo]?.substring(2, 3) === "1"}
                onChange={handleChangeCBX}
              />
            </div>
          </td>
        ) : null}
        {!arrayPos || arrayPos.includes(4) ? (
          <td>
            <div className="d-flex form-check justify-content-center">
              <Input
                type="checkbox"
                name={campo}
                pos={4}
                defaultChecked={vDados[campo]?.substring(3, 4) === "1"}
                onChange={handleChangeCBX}
              />
            </div>
          </td>
        ) : null}
      </tr>
    )
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
            <Row>
              <Col lg="6">
                <Row>
                  <Col className="mb-2" sm="12">
                    <div className="border rounded p-2">
                      <h5 className="mb-1">Foto / Avatar</h5>
                      <div className="d-flex flex-column flex-md-row">
                        <img
                          className="me-2 mb-1 mb-md-0 img-fluid img-proporcional"
                          src={vDados?.foto}
                          alt="Foto"
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
                              <Input
                                type="file"
                                name="foto"
                                onChange={onChangeImagem}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg="6">
                <Row>
                  <Col md="12" className="mb-2">
                    <Label className="form-label" for="nome">
                      Nome
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                      value={vDados?.email ?? ""}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md="6" className="mb-2">
                    <Label className="form-label" for="senha">
                      Senha
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
                </Row>
              </Col>

              <Col md="12" className="mb-2">
                <Label className="form-label" for="clientes">
                  Clientes permitidos
                </Label>
                <Select
                  isClearable
                  id="clientes"
                  noOptionsMessage={() => "Vazio"}
                  isMulti
                  placeholder={""}
                  className="react-select"
                  classNamePrefix="select"
                  value={vCliente}
                  onChange={(e) => {
                    setCliente(e)
                    handleChange({
                      target: {
                        name: "clientes",
                        value: e
                          ?.map((item) => item.value.toString())
                          .toString(),
                      },
                    })
                  }}
                  options={vListaClientes}
                />
              </Col>
              <Col md="12" className="mb-2">
                <Table
                  className="text-nowrap text-center border-bottom"
                  responsive
                >
                  <thead>
                    <tr>
                      <th className="text-start">Permissões de acesso</th>
                      <th>Cadastra</th>
                      <th>Visualiza</th>
                      <th>Altera</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderAcesso("Administrativo - Cliente", "adm_clientes")}
                    {renderAcesso("Administrativo - Hotspot", "adm_hotspot")}
                    {renderAcesso("Administrativo - Login", "adm_login")}
                    {renderAcesso(
                      "Administrativo - Plano de conexão",
                      "plano_conexao"
                    )}
                    {renderAcesso(
                      "Administrativo - Libera/Bloqueia mac",
                      "permissao_mac"
                    )}
                    {renderAcesso("Evento", "evento")}
                    {renderAcesso("Pesquisa", "adm_pesquisa")}
                    {renderAcesso("Publicidade", "adm_publicidade")}
                    {renderAcesso("Filtros", "filtro_campanha")}
                    {renderAcesso("Campanha - Push (App)", "campanha_push")}
                    {renderAcesso("Campanha - SMS", "campanha_sms")}
                    {renderAcesso(
                      "Campanha - Recorrente - Push (App)",
                      "campanha_rec_push"
                    )}
                    {renderAcesso(
                      "Campanha - Recorrente - SMS",
                      "campanha_rec_sms"
                    )}
                    {renderAcesso("Encurtador de URL", "encurtador_url")}
                  </tbody>
                </Table>
              </Col>
              <Col md="12" className="mb-2">
                <Table
                  className="text-nowrap text-center border-bottom"
                  responsive
                >
                  <thead>
                    <tr>
                      <th className="text-start">Outros acessos</th>
                      <th>Permitir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderAcesso("Usuários", "status_usuario", [1])}
                    {renderAcesso(
                      "Minha carteira - Visualizar",
                      "minha_carteira",
                      [1]
                    )}
                    {renderAcesso(
                      "Minha carteira - Solicitar aumento",
                      "minha_carteira",
                      [2]
                    )}
                    {renderAcesso(
                      "Relatórios - Campanha enviada",
                      "rel_campanha",
                      [1]
                    )}
                    {renderAcesso(
                      "Relatórios - Cadastros/Conexões",
                      "rel_cad_conexoes",
                      [1]
                    )}
                    {renderAcesso(
                      "Relatórios - Exportar e-mails",
                      "rel_exportar_email",
                      [1]
                    )}
                    {renderAcesso(
                      "Relatórios - Exportar registros",
                      "rel_exportar_registros",
                      [1]
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default ClienteLoginEditCard
