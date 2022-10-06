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

import Select from "react-select"

// ** Hooks
import { useClienteId } from "@hooks/useClienteId"

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props

  // ** Store Vars
  const dispatch = useDispatch()

  const [vListaClientes, setListaClientes] = useState(null)
  const [vMostrarListaClientes, setMostrarListaClientes] = useState(false)
  // ** Hooks
  const [clienteId, setClienteId] = useClienteId()

  const getClientes = () => {
    return api.get("/cliente/lista_simples/").then((res) => {
      setListaClientes(res.data)
      setMostrarListaClientes(res.data.length > 1)
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
              placeholder={"Filtrar por cliente..."}
              className="react-select d-block"
              classNamePrefix="select"
              value={clienteId}
              onChange={(e) => {
                setClienteId(e)
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
