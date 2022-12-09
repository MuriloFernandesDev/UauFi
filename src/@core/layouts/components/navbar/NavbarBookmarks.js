// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Third Party Components
import * as Icon from "react-feather"

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap"

// ** API
import api from "@src/services/api"

// ** Store & Actions
import { useDispatch } from "react-redux"
import { getBookmarks } from "@store/navbar"
import Select, { components } from "react-select"

// ** Hooks
import { useClienteId } from "@hooks/useClienteId"

import { useTranslation } from "react-i18next"

const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div>
        <strong>{data.nome}</strong>
      </div>
      <div>{data.hs_nome}</div>
    </components.Option>
  )
}

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props

  // ** Hooks
  const { t } = useTranslation()

  // ** Store Vars
  const dispatch = useDispatch()

  const [vListaClientes, setListaClientes] = useState(null)
  const [vMostrarListaClientes, setMostrarListaClientes] = useState(false)
  // ** Hooks
  const [clienteId, setClienteId] = useClienteId()

  const getClientes = () => {
    return api.get("/cliente/lista_select_topo").then((res) => {
      setListaClientes(res.data)
      setMostrarListaClientes(res.data.length > 1)
      if (res.data.length === 1) {
        setClienteId(res.data[0])
      }
    })
  }

  // ** ComponentDidMount
  useEffect(() => {
    dispatch(getBookmarks())
    getClientes()
  }, [])

  return (
    <Fragment>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-1">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}
          >
            <Icon.Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      {vMostrarListaClientes ? (
        <ul className="nav navbar-nav w-100">
          <NavItem className="w-100 me-1">
            <Select
              isClearable
              id="vCliente"
              noOptionsMessage={() => t("Vazio")}
              loadingMessage={() => t("Pesquisando...")}
              placeholder={t("Filtrar por cliente...")}
              className="react-select d-block"
              classNamePrefix="select"
              value={clienteId}
              onChange={(e) => {
                setClienteId(e)
              }}
              components={{
                Option: OptionComponent,
              }}
              options={vListaClientes}
            />
          </NavItem>
        </ul>
      ) : (
        ""
      )}
    </Fragment>
  )
}

export default NavbarBookmarks
