// ** Custom Components
import AvatarGroup from '@src/@core/components/avatar'

// ** Images
import react from '@src/assets/images/icons/react.svg'
import vuejs from '@src/assets/images/icons/vuejs.svg'
import angular from '@src/assets/images/icons/angular.svg'
import bootstrap from '@src/assets/images/icons/bootstrap.svg'
import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'

// ** Icons Imports
import { MoreVertical, Edit, Trash } from 'react-feather'

// ** Reactstrap Imports
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap'

const avatarGroupData1 = [
  {
    title: 'Melissa',
    img: avatar1,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Jana',
    img: avatar2,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Halla',
    img: avatar3,
    imgHeight: 22,
    imgWidth: 22,
  },
]

const avatarGroupData2 = [
  {
    title: 'Wing',
    img: avatar1,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Octavia',
    img: avatar2,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Benedict',
    img: avatar3,
    imgHeight: 22,
    imgWidth: 22,
  },
]

const avatarGroupData3 = [
  {
    title: 'Jade',
    img: avatar1,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Alisa',
    img: avatar2,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Alisa',
    img: avatar3,
    imgHeight: 22,
    imgWidth: 22,
  },
]

const avatarGroupData4 = [
  {
    title: 'Alexa',
    img: avatar1,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Lee',
    img: avatar2,
    imgHeight: 22,
    imgWidth: 22,
  },
  {
    title: 'Shellie',
    img: avatar3,
    imgHeight: 22,
    imgWidth: 22,
  },
]

const TableSmall = () => {
  return (
    <Table size="sm" responsive>
      <thead>
        <tr>
          <th>Project</th>
          <th>Client</th>
          <th>Users</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img
              className="me-75"
              src={angular}
              alt="angular"
              height="18"
              width="18"
            />
            <span className="align-middle fw-bold">Angular Project</span>
          </td>
          <td>Peter Charles</td>
          <td>
            <AvatarGroup data={avatarGroupData1} />
          </td>
          <td>
            <Badge pill color="light-primary" className="me-1">
              Active
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Edit className="me-50" size={15} />{' '}
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Trash className="me-50" size={15} />{' '}
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <img
              className="me-75"
              src={react}
              alt="react"
              height="18"
              width="18"
            />
            <span className="align-middle fw-bold">React Project</span>
          </td>
          <td>Ronald Frest</td>
          <td>
            <AvatarGroup data={avatarGroupData2} />
          </td>
          <td>
            <Badge pill color="light-success" className="me-1">
              Completed
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Edit className="me-50" size={15} />{' '}
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Trash className="me-50" size={15} />{' '}
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <img
              className="me-75"
              src={vuejs}
              alt="vuejs"
              height="18"
              width="18"
            />
            <span className="align-middle fw-bold">Vuejs Project</span>
          </td>
          <td>Jack Obes</td>
          <td>
            <AvatarGroup data={avatarGroupData3} />
          </td>
          <td>
            <Badge pill color="light-info" className="me-1">
              Scheduled
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Edit className="me-50" size={15} />{' '}
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Trash className="me-50" size={15} />{' '}
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <img
              className="me-75"
              src={bootstrap}
              alt="bootstrap"
              height="18"
              width="18"
            />
            <span className="align-middle fw-bold">Bootstrap Project</span>
          </td>
          <td>Jerry Milton</td>
          <td>
            <AvatarGroup data={avatarGroupData4} />
          </td>
          <td>
            <Badge pill color="light-warning" className="me-1">
              Pending
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Edit className="me-50" size={15} />{' '}
                  <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                  <Trash className="me-50" size={15} />{' '}
                  <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default TableSmall
