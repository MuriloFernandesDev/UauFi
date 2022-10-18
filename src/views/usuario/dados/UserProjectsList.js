// ** Reactstrap Imports
import { Card, CardHeader, Progress } from "reactstrap"

// ** Third Party Components
import { ChevronDown } from "react-feather"
import DataTable from "react-data-table-component"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss"

const projectsArr = [
  {
    progress: 60,
    hours: "210:30h",
    progressColor: "info",
    totalTasks: "233/240",
    subtitle: "React Project",
    title: "Padaria X",
    img: require("@src/assets/images/icons/brands/react-label.png").default,
  },
  {
    hours: "89h",
    progress: 15,
    totalTasks: "9/50",
    progressColor: "danger",
    subtitle: "UI/UX Project",
    title: "Padaria Y",
    img: require("@src/assets/images/icons/brands/xd-label.png").default,
  },
  {
    progress: 90,
    hours: "129:45h",
    totalTasks: "100/190",
    progressColor: "success",
    subtitle: "Vuejs Project",
    title: "Padaria XY",
    img: require("@src/assets/images/icons/brands/vue-label.png").default,
  },
]

export const columns = [
  {
    sortable: true,
    minWidth: "300px",
    name: "Hotspot",
    selector: (row) => row.title,
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="avatar-wrapper">
            <Avatar
              className="me-1"
              img={row.img}
              alt={row.title}
              imgWidth="32"
            />
          </div>
          <div className="d-flex flex-column">
            <span className="text-truncate fw-bolder">{row.title}</span>
            <small className="text-muted">{row.subtitle}</small>
          </div>
        </div>
      )
    },
  },
  {
    name: "Visitas",
    selector: (row) => row.totalTasks,
  },
  {
    name: "",
    selector: (row) => row.progress,
    sortable: true,
    cell: (row) => {
      return (
        <div className="d-flex flex-column w-100">
          <small className="mb-1">{`${row.progress}%`}</small>
          <Progress
            value={row.progress}
            style={{ height: "6px" }}
            className={`w-100 progress-bar-${row.progressColor}`}
          />
        </div>
      )
    },
  },
  {
    name: "Tempo",
    selector: (row) => row.hours,
  },
]

const UserProjectsList = () => {
  return (
    <Card>
      <CardHeader tag="h4">Lugares visitados</CardHeader>
      <div className="react-dataTable user-view-account-projects">
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={projectsArr}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
    </Card>
  )
}

export default UserProjectsList
