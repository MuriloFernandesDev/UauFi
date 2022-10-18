// ** Reactstrap Imports
import { Card, CardTitle, CardBody, Table, Input, Button } from "reactstrap"

const typesArr = [
  {
    data: "00/00/0000 00:00:00",
    mensagem: "eae",
    tipo: "SMS",
  },
  {
    data: "00/00/0000 00:00:00",
    mensagem: "ola",
    tipo: "SMS",
  },
  {
    data: "00/00/0000 00:00:00",
    mensagem: "oi",
    tipo: "SMS",
  },
  {
    data: "00/00/0000 00:00:00",
    mensagem: "volta",
    tipo: "SMS",
  },
]

const Notifications = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-50" tag="h4">
          Campanhas, mensagens e SMS
        </CardTitle>
      </CardBody>
      <Table className="text-nowrap text-center border-bottom" responsive>
        <thead>
          <tr>
            <th className="text-start">Data/Hora</th>
            <th className="text-start">Mensagem</th>
            <th className="text-start">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {typesArr.map((type, index) => {
            return (
              <tr key={index}>
                <td className="text-start">{type.data}</td>
                <td className="text-start">{type.mensagem}</td>
                <td className="text-start">{type.tipo}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Card>
  )
}

export default Notifications
