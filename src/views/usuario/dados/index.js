// ** React Imports
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

// ** Store & Actions
import { getUsuario } from "../store"
import { useDispatch } from "react-redux"

// ** Reactstrap Imports
import { Row, Col, Alert, Spinner } from "reactstrap"

// ** User View Components
import UserTabs from "./Tabs"
import UserInfoCard from "./UserInfoCard"

// ** Styles
import "@styles/react/apps/app-users.scss"

const DadosUsuario = () => {
  // ** Store Vars
  const dispatch = useDispatch()

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

  return vCarregando ? (
    <div className="text-center">
      <Spinner color="primary" />
    </div>
  ) : vDados?.id > 0 ? (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard dados={vDados} />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
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
  )
}
export default DadosUsuario
