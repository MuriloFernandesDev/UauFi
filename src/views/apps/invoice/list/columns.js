// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { deleteInvoice } from '../store'

// ** Reactstrap Imports
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown
} from 'reactstrap'

// ** Third Party Components
import {
  Eye,
  Copy,
  Trash,
  MoreVertical
} from 'react-feather'

// ** renders client column
const renderClient = row => {
  if (row.logo.length) {
    return <Avatar className='me-50' img={row.logo} width='32' height='32' />
  } else {
    return <Avatar color='light-primary' className='me-50' content={row.nome ? row.nome : ''} initials />
  }
}

// ** Table columns
export const columns = [
  {
    name: 'Cliente',
    minWidth: '450px',
    // selector: row => row.client.name,
    cell: row => {
      const nome = row.nome ? row.nome : '',
        email = row.email ? row.email : ''
      return (
        <div className='d-flex justify-content-left align-items-center'>
          {renderClient(row)}
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{nome}</h6>
            <small className='text-truncate text-muted mb-0'>{email}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: <div className='text-end w-100'>Ações</div>,
    minWidth: '80px',
    cell: row => (
      <div className='text-end w-100'>
        <div className='column-action d-inline-flex'>
          <Link to={`/apps/invoice/edit/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Eye size={17} className='mx-1' />
          </Link>
        
          <UncontrolledTooltip placement='top' target={`pw-tooltip-${row.id}`}>
            Visualizar
          </UncontrolledTooltip>
          <UncontrolledDropdown>
            <DropdownToggle tag='span'>
              <MoreVertical size={17} className='cursor-pointer' />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(deleteInvoice(row.id))
                }}
              >
                <Trash size={14} className='me-50' />
                <span className='align-middle'>Deletar</span>
              </DropdownItem>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <Copy size={14} className='me-50' />
                <span className='align-middle'>Duplicar</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    )
  }
]