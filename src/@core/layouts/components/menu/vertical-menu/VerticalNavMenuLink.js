// ** React Imports
import { NavLink } from 'react-router-dom'

import { useContext, useState, useEffect } from "react"

// ** API
import api from "@src/services/api"

// ** Third Party Components
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

// ** Context
import { AbilityContext as PermissaoContext } from "@src/utility/context/Can"

const VerticalNavMenuLink = ({ item, activeItem }) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink


   // ** Guardar o Cliente selecionado para atualizar a página caso mude
   const sClienteId = localStorage.getItem("clienteId")

  //* Context
  const permissao = useContext(PermissaoContext)

  const [clientCredit, setClientCredit] = useState()

  const handlePesquisar = (dados) => {
    dados.clienteId = sClienteId
    api
      .get(`/cliente_credito/${dados.clienteId?.length >= 1 ? 'carteira' : 'credito_nao_aprovado'}`)
      .then((res) => {
        setClientCredit(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // ** Hooks
  const { t } = useTranslation()
  useEffect(() => {
      handlePesquisar(
        {
          clienteId: sClienteId,
        },
        true
      )
  }, [])
  
  return (
    <li
    className={classnames({
      'nav-item': !item.children,
      disabled: item.disabled,
      active: item.navLink === activeItem
    })}
    >
      <LinkTag
        className={`d-flex align-items-center ${permissao.can("create", "minha_carteira") && item.badge && clientCredit && clientCredit.cliente_credito.length && 'justify-content-between'}`}
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              className: ({ isActive }) => {
                if (isActive && !item.disabled) {
                  return `d-flex align-items-center ${permissao.can("create", "minha_carteira") && item.badge && clientCredit && clientCredit.cliente_credito.length && 'justify-content-between'} active`
                }
              }
            })}
            onClick={e => {
              if (item.navLink.length === 0 || item.navLink === '#' || item.disabled === true) {
                e.preventDefault()
              }
            }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{t(item.title)}</span>

        {permissao.can("create", "minha_carteira") && item.badge && clientCredit && clientCredit.cliente_credito.length >= 1 ? (
          <Badge className='float-end' color='warning' pill>
            {clientCredit.cliente_credito.length}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
