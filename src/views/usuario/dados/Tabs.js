// ** React Imports
import { Fragment } from "react"

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

// ** Icons Imports
import { User, Lock, Bookmark, Bell, Link } from "react-feather"

// ** User Components
import SecurityTab from "./SecurityTab"
import Connections from "./Connections"
import BillingPlanTab from "./BillingTab"
import LinhaDoTempo from "./LinhaDoTempo"
import Notifications from "./Notifications"
import HotspotsVisitados from "./HotspotsVisitados"

const UserTabs = ({ active, toggleTab, id }) => {
  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <User className="font-medium-3 me-50" />
            <span className="fw-bold">Conexões</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <Lock className="font-medium-3 me-50" />
            <span className="fw-bold">Pesquisas</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <Bookmark className="font-medium-3 me-50" />
            <span className="fw-bold">Publicidade</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
            <Bell className="font-medium-3 me-50" />
            <span className="fw-bold">Campanhas</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
            <Link className="font-medium-3 me-50" />
            <span className="fw-bold">Dispositivos</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <HotspotsVisitados id={id} />
          <LinhaDoTempo id={id} />
        </TabPane>
        <TabPane tabId="2">
          <SecurityTab id={id} />
        </TabPane>
        <TabPane tabId="3">
          <BillingPlanTab id={id} />
        </TabPane>
        <TabPane tabId="4">
          <Notifications id={id} />
        </TabPane>
        <TabPane tabId="5">
          <Connections id={id} />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
