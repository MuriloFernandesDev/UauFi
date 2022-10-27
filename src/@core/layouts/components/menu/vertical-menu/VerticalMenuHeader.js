// ** React Imports
import { useEffect } from "react"

// ** Config
import themeConfig from "@configs/themeConfig"

// ** Utils
import { getUserData } from "@utils"

const VerticalMenuHeader = (props) => {
  // ** Props
  const { menuCollapsed, setGroupOpen, menuHover } = props

  // ** Vars
  const user = getUserData()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  return (
    <div className="navbar-header pe-1 ps-1">
      <ul className="nav navbar-nav" style={{ height: "100%" }}>
        <li className="nav-item">
          <img
            src={
              themeConfig.layout.skin === "dark"
                ? user.url_logo_dark
                : user.url_logo_light
            }
            width="100%"
            height="53"
            alt="logo"
            className="img-proporcional"
          />
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
