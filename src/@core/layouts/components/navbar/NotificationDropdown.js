// ** Custom Components
import Avatar from "@components/avatar"

// ** React Imports
import { Link } from "react-router-dom"

// ** Hooks
import { useEffect, useState, useRef } from "react"

// ** API
import api from "@src/services/api"

// ** Third Party Components
import PerfectScrollbar from "react-perfect-scrollbar"
import { Gift } from "react-feather"

// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap"
import { formatDate } from "@utils"

const NotificationDropdown = () => {
  const [vDados, setDados] = useState(null)
  const [vProcessando, setProcessando] = useState(true)
  const vTimeoutPesquisa = useRef()

  const getDados = () => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    vTimeoutPesquisa.current = setTimeout(
      () => {
        setProcessando(true)
        return api
          .get("/usuario/aniversariantes")
          .then((res) => {
            setProcessando(false)
            setDados(res.data)
          })
          .catch((error) => {
            setProcessando(false)
            console.error("Erro ao pegar dados:", error)
          })
      },
      vDados ? 60000 : 1
    )
  }

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return !vProcessando ? (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {vDados?.map((item, index) => {
          return (
            <Link
              key={index}
              to={`/usuario/dados/${item.id}`}
              className="d-flex"
            >
              <div className="list-item d-flex align-items-center">
                <div className="me-1">
                  {item.foto_url?.length ? (
                    <Avatar
                      className="me-1"
                      img={item.foto_url}
                      width="32"
                      height="32"
                    />
                  ) : (
                    <Avatar
                      initials
                      className="me-1"
                      color="light-primary"
                      content={item.nome || ""}
                    />
                  )}
                </div>
                <div className="list-item-body flex-grow-1">
                  <p className="media-heading">
                    <span className="fw-bolder">{item.nome}</span>
                  </p>
                  <small className="notification-text">
                    {formatDate(item.nascimento)}
                  </small>
                </div>
              </div>
            </Link>
          )
        })}
      </PerfectScrollbar>
    ) : null
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  return vDados?.length > 0 ? (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Gift size={21} />
        <Badge pill color="success" className="badge-up">
          {vDados?.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">
              Aniversariantes do dia
            </h4>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
      </DropdownMenu>
    </UncontrolledDropdown>
  ) : null
}

export default NotificationDropdown
