// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Reactstrap Imports
import { Table, Card } from "reactstrap"

import { useEffect, useState, useRef } from "react"

// ** Utils
import { formatDateTime } from "@utils"

// ** API
import api from "@src/services/api"

const CompanyTable = () => {
  // ** States
  const [vDados, setDados] = useState(null)

  const vTimeoutPesquisa = useRef()

  const getDados = () => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    vTimeoutPesquisa.current = setTimeout(
      () => {
        return api
          .get("/usuario/ultimas_conexoes")
          .then((res) => {
            setDados(res.data)
          })
          .catch(() => {
            setDados(null)
          })
      },
      vDados ? 60000 : 1
    )
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [vDados])

  const renderData = () => {
    return vDados?.map((col) => {
      return (
        <tr key={col.id}>
          <td>
            <div className="d-flex justify-content-left align-items-center">
              <Avatar
                className="me-1"
                img={col.foto_url}
                width="32"
                height="32"
              />
              <div className="d-flex flex-column">
                <Link
                  to={`/usuario/dados/${col.id}`}
                  className="user_name text-truncate text-body"
                >
                  <span className="fw-bolder">{col.nome}</span>
                </Link>
                <small className="text-truncate text-muted mb-0">
                  {col.ultimo_quarto
                    ? `Quarto: ${col.ultimo_quarto ?? ""}`
                    : ""}
                  {col.celular ? ` Cel: ${col.celular}` : ""}
                </small>
              </div>
            </div>
          </td>
          <td className="text-nowrap">
            <div className="d-flex flex-column">
              <span className="mb-25">{col.plataforma ?? ""}</span>
              <span className="font-small-2 text-muted">{col.mac}</span>
            </div>
          </td>
          <td className="text-nowrap">
            <div className="d-flex flex-column">
              <span className="mb-25">{formatDateTime(col.entrada)}</span>
              <span className="font-small-2 text-muted">{col.hotspot}</span>
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <Card>
      <Table responsive>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Dispositivo</th>
            <th>Conexão</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
