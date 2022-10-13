// ** React Imports
import { useContext } from "react"

// ** Reactstrap Imports
import { Row, Col } from "reactstrap"

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors"

// ** Demo Components
import CompanyTable from "./CompanyTable"
import Plataforma from "@src/views/ui-elements/cards/analytics/Plataforma"
import CardUsuarioMaisVisita from "@src/views/ui-elements/cards/advance/CardUsuarioMaisVisita"
import StatsCard from "@src/views/ui-elements/cards/statistics/StatsCard"
import NovosCad from "@src/views/ui-elements/cards/analytics/NovosCad"
import OrdersBarChart from "@src/views/ui-elements/cards/statistics/OrdersBarChart"
import ProfitLineChart from "@src/views/ui-elements/cards/statistics/ProfitLineChart"
import CardBrowserStates from "@src/views/ui-elements/cards/advance/CardBrowserState"

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss"
import "@styles/base/pages/dashboard-ecommerce.scss"

const EcommerceDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** vars
  const trackBgColor = "#e9ecef"

  return (
    <div id="dashboard-ecommerce">
      <Row className="match-height">
        <Col xl="4" md="6" xs="12">
          <CardUsuarioMaisVisita />
        </Col>
        <Col xl="8" md="6" xs="12">
          <StatsCard cols={{ xl: "3", sm: "6" }} />
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg="4" md="12">
          <Row className="match-height">
            <Col lg="6" md="3" xs="6">
              <OrdersBarChart warning={colors.warning.main} />
            </Col>
            <Col lg="6" md="3" xs="6">
              <ProfitLineChart info={colors.info.main} />
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
          <CompanyTable />
        </Col>
        <Col lg="4" md="6" xs="12">
          <CardBrowserStates colors={colors} trackBgColor={trackBgColor} />
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
