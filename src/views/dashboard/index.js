// ** React Imports
import { useContext } from "react"

// ** Reactstrap Imports
import { Row, Col } from "reactstrap"

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors"

// ** Demo Components
import CardUltimosUsuarios from "./CardUltimosUsuarios"
import Plataforma from "./Plataforma"
import CardUsuarioMaisVisita from "./CardUsuarioMaisVisita"
import CardQuantidades from "./CardQuantidades"
import NovosCad from "./NovosCad"
import CardVisitasMes from "./CardVisitasMes"
import CardGeneros from "./CardGeneros"

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss"
import "@styles/base/pages/dashboard-ecommerce.scss"

// ** Third Party Components
import "chart.js/auto"

const EcommerceDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardUsuarioMaisVisita />
        </Col>
        <Col xl="8" md="6" xs="12">
          <CardQuantidades cols={{ xl: "3", sm: "6" }} />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="4" md="12">
          <Row className="match-height">
            <Col lg="12" md="6" xs="12">
              <CardVisitasMes />
            </Col>
            <Col lg="12" md="6" xs="12">
              <Plataforma />
            </Col>
          </Row>
        </Col>
        <Col lg="8" md="12">
          <NovosCad
            primary={colors.primary.main}
            warning={colors.warning.main}
          />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="8" xs="12">
          <CardUltimosUsuarios />
        </Col>
        <Col lg="4" md="6" xs="12">
          <CardGeneros />
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
