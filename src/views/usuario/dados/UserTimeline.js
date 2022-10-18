// ** Custom Components
import Timeline from "@components/timeline"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"

// ** Timeline Data
const data = [
  {
    title: "Cadastrado",
    content: "Segunda-feira 20 de agosto de 2022",
    meta: "12 mins",
  },
  {
    title: "Visitou Padaria X",
    content: "Segunda-feira 20 de agosto de 2022",
    meta: "45 mins",
    color: "warning",
  },
  {
    title: "Visitou Padaria Y",
    content: "Segunda-feira 20 de agosto de 2022",
    meta: "45 mins",
    color: "warning",
  },
  {
    title: "Visitou Padaria XY",
    content: "Segunda-feira 20 de agosto de 2022",
    meta: "45 mins",
    color: "warning",
  },
]

const UserTimeline = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Linha do tempo</CardTitle>
      </CardHeader>
      <CardBody className="pt-1">
        <Timeline data={data} className="ms-50" />
      </CardBody>
    </Card>
  )
}

export default UserTimeline
