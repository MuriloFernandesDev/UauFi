// ** React Imports
import { useEffect, useState, Fragment } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

// ** Store & Actions
import { getUsuario } from "../store"
import { useDispatch } from "react-redux"

// ** Reactstrap Imports
import { Row, Col, Alert, Spinner, Card, Button } from "reactstrap"

// ** Icons
import { CornerUpLeft } from "react-feather"

// ** User View Components
import UserTabs from "./Tabs"
import UserInfoCard from "./UserInfoCard"

// ** Styles
import "@styles/react/apps/app-users.scss"

const DadosUsuario = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  // ** Hooks
  const { id } = useParams()

  // ** Get suer on mount
  useEffect(() => {
    setCarregando(true)
    getUsuario(parseInt(id))
      .then((response) => {
        setCarregando(false)
        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [dispatch])

  const [active, setActive] = useState("1")

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <Fragment>
      <Col sm="12">
        <Card className="mb-1">
          <div className="d-flex justify-content-between flex-row m-1">
            <div>
              <Button.Ripple color="primary" onClick={() => navigate(-1)}>
                <CornerUpLeft size={17} />
              </Button.Ripple>
            </div>
            <div></div>
          </div>
        </Card>
      </Col>
      {vCarregando ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : vDados?.id > 0 ? (
        <div className="app-user-view">
          <Row>
            <Col xl="4" md="5">
              <UserInfoCard dados={vDados} />
            </Col>
            <Col xl="8" md="7">
              <UserTabs active={active} toggleTab={toggleTab} id={id} />
            </Col>
          </Row>
        </div>
      ) : (
        <Alert color="danger">
          <h4 className="alert-heading">Usuário não encontrado</h4>
          <div className="alert-body">
            Usuário: {id} não existe ou não nunca passou por aqui. Verifique a{" "}
            <Link to="/usuario/lista">lista completa</Link>
          </div>
        </Alert>
      )}
    </Fragment>
  )
}
export default DadosUsuario
