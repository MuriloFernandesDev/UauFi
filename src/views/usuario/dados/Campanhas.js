// ** React Imports
import { useState, useEffect } from "react"

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Spinner, Table } from "reactstrap"

// ** Store & Actions
import { getCampanhas } from "../store"

// ** Utils
import { formatDateTime } from "@utils"

const Campanhas = (dados) => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  useEffect(() => {
    setCarregando(true)
    getCampanhas(dados.id)
      .then((response) => {
        setCarregando(false)

        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [])

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
          {!vCarregando ? (
            vDados?.length > 0 ? (
              vDados.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-start">
                      {formatDateTime(item.data_hora)}
                    </td>
                    <td className="text-start">{item.mensagem}</td>
                    <td className="text-start">{item.tipo}</td>
                  </tr>
                )
              })
            ) : null
          ) : (
            <tr>
              <td colSpan={3} className="text-center mt-3">
                <Spinner type="grow" size="sm" color="primary" />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  )
}

export default Campanhas
