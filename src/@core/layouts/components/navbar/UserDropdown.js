// ** React Imports
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { isUserLoggedIn } from "@utils"

// ** Store & Actions
import { useDispatch } from "react-redux"
import { handleLogout } from "@store/authentication"

// ** Third Party Components
import { User, Users, Power, Sun, Moon } from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"

const UserDropdown = (props) => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState(null)

  // ** Props
  const { skin, setSkin } = props

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  const handleThemeToggler = () => {
    setSkin(skin === "dark" ? "light" : "dark")
  }

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun size={14} className="me-75" />
    } else {
      return <Moon size={14} className="me-75" />
    }
  }

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name text-nowrap fw-bold">
            {(userData && (userData["fullName"] || userData["username"])) || ""}
          </span>
          <span className="user-status">
            {userData
              ? userData?.fullName
                ? userData?.username
                : userData.role
              : ""}
          </span>
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/adm/login/edit">
          <User size={14} className="me-75" />
          <span className="align-middle">Meu perfil</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/adm/login/edit">
          <Users size={14} className="me-75" />
          <span className="align-middle">Impersonar</span>
        </DropdownItem>
        <DropdownItem
          className="d-block d-lg-none"
          onClick={() => handleThemeToggler()}
        >
          <ThemeToggler />
          <span className="align-middle">Mudar tema</span>
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
