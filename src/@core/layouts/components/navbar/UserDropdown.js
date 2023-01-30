// ** React Imports
import { Link } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

//Internacionalização
import { useTranslation } from 'react-i18next'

// ** Utils
import { isUserLoggedIn, getUserData } from '@utils'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** API
import api from '@src/services/api'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import {
  handleLogout,
  handleLogin,
  handlePararEmpersonar,
} from '@store/authentication'

import Impersonar from './Impersonar'

// ** Third Party Components
import { User, Power, Sun, Moon, Users } from 'react-feather'

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Spinner,
} from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

const UserDropdown = (props) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const ability = useContext(AbilityContext)

  // ** Hooks
  const { t } = useTranslation()

  // ** State
  const [userData, setUserData] = useState(null)
  const [vImpersonando, setImpersonando] = useState(false)

  const [show, setShow] = useState(null)

  // ** Vars
  const user = getUserData()

  // ** Props
  const { skin, setSkin } = props

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar

  const handleThemeToggler = () => {
    setSkin(skin === 'dark' ? 'light' : 'dark')
  }

  const handleImpersonar = (dados) => {
    dispatch(handleLogin(dados))
    ability.update(dados.ability)
    //navigate(getHomeRouteForLoggedInUser(dados.role))
    window.location.reload(false)
  }

  const handlePararImpersonar = () => {
    setImpersonando(true)
    dispatch(handlePararEmpersonar())
    api
      .post('/cliente_login/auth/', {
        email: '',
        senha: '',
      })
      .then((response) => {
        handleImpersonar(response.data)
      })
      .catch(() => {
        setImpersonando(false)
      })
  }

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
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
            {(userData && (userData['fullName'] || userData['username'])) || ''}
          </span>
          <span className="user-status">
            {userData
              ? userData?.fullName
                ? userData?.username
                : userData.role
              : ''}
          </span>
        </div>
        {!vImpersonando ? (
          <Avatar
            img={userAvatar}
            imgHeight="40"
            imgWidth="40"
            status="online"
            className="img-proporcional"
          />
        ) : (
          <Spinner type="grow" size="md" color="primary" />
        )}
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/adm/login/edit">
          <User size={14} className="me-75" />
          <span className="align-middle">{t('Meu perfil')}</span>
        </DropdownItem>

        {user.perfil === 'adm' && !user.impersonado ? (
          <DropdownItem className="w-100" onClick={() => setShow(!show)}>
            <Users size={14} className="me-75" />
            <span className="align-middle">{t('Impersonar')}</span>
            <Impersonar
              show={show}
              setShow={setShow}
              pEmail={user.email}
              handleImpersonar={handleImpersonar}
              setImpersonando={setImpersonando}
            />
          </DropdownItem>
        ) : null}
        {user.impersonado ? (
          <DropdownItem
            className="w-100"
            onClick={() => handlePararImpersonar()}
          >
            <Users size={14} className="me-75" />
            <span className="align-middle">{t('Parar de impersonar')}</span>
          </DropdownItem>
        ) : null}
        <DropdownItem
          className="d-lg-none w-100"
          onClick={() => handleThemeToggler()}
        >
          <ThemeToggler />
          <span className="align-middle">
            {`${
              skin === 'dark' ? t('Usar tema claro') : t('Usar tema escuro')
            }`}
          </span>
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">{t('Sair')}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
