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
import { useHotspotId } from "@hooks/useHotspotId"

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props

  // ** Store Vars
  const dispatch = useDispatch()

  const [vListaHotspots, setListaHotspots] = useState(null)
  // ** Hooks
  const [hotspotId, setHotspotId] = useHotspotId()

  const getHotspots = () => {
    return api.get("/hotspot/lista/0").then((res) => {
      setListaHotspots(
        res.data.map((ret) => ({
          label: ret.nome,
          value: ret.id,
        }))
      )
    })
  }

  // ** ComponentDidMount
  useEffect(() => {
    dispatch(getBookmarks())
    getHotspots()
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
      <ul className="nav navbar-nav w-100">
        <NavItem className="w-100 me-1">
          <Select
            isClearable
            id="vHotspot"
            placeholder={"Filtrar por hotspot..."}
            className="react-select d-block"
            classNamePrefix="select"
            value={hotspotId}
            onChange={(e) => {
              setHotspotId(e)
            }}
            options={vListaHotspots}
          />
        </NavItem>
      </ul>
    </Fragment>
  )
}

export default NavbarBookmarks
