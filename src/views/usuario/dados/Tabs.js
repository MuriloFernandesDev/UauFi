// ** React Imports
import { Fragment } from "react"

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"

// ** Icons Imports
import { Wifi, UserCheck, Mic, MessageSquare, Smartphone } from "react-feather"

// ** User Components
import PesquisaRespondida from "./PesquisaRespondida"
import Dispositivos from "./Dispositivos"
import PublicidadeVista from "./PublicidadeVista"
import LinhaDoTempo from "./LinhaDoTempo"
import Campanhas from "./Campanhas"
import HotspotsVisitados from "./HotspotsVisitados"

const UserTabs = ({ active, toggleTab, id }) => {
  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <Wifi className="font-medium-3 me-50" />
            <span className="fw-bold">Conexões</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <UserCheck className="font-medium-3 me-50" />
            <span className="fw-bold">Pesquisas</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <Mic className="font-medium-3 me-50" />
            <span className="fw-bold">Publicidade</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "4"} onClick={() => toggleTab("4")}>
            <MessageSquare className="font-medium-3 me-50" />
            <span className="fw-bold">Campanhas</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "5"} onClick={() => toggleTab("5")}>
            <Smartphone className="font-medium-3 me-50" />
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
          <PesquisaRespondida id={id} />
        </TabPane>
        <TabPane tabId="3">
          <PublicidadeVista id={id} />
        </TabPane>
        <TabPane tabId="4">
          <Campanhas id={id} />
        </TabPane>
        <TabPane tabId="5">
          <Dispositivos id={id} />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
