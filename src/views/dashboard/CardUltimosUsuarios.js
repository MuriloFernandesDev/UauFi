// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Reactstrap Imports
import { Table, Card, Spinner } from "reactstrap"

import { useEffect, useState } from "react"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"

// ** Utils
import { formatDateTime } from "@utils"

// ** API
import api from "@src/services/api"

const CompanyTable = () => {
  // ** States
  const [vDados, setDados] = useState(null)
  const [vProcessando, setProcessando] = useState(true)

  // const vTimeoutPesquisa = useRef()

  const getDados = () => {
    // if (vTimeoutPesquisa) {
    //   clearTimeout(vTimeoutPesquisa.current)
    // }
    // vTimeoutPesquisa.current = setTimeout(
    //   () => {
    setProcessando(true)
    return api
      .get("/usuario/ultimas_conexoes")
      .then((res) => {
        setProcessando(false)
        setDados(res.data)
      })
      .catch(() => {
        setProcessando(false)
        setDados(null)
      })
    //   },
    //   vDados ? 60000 : 1
    // )
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  const renderData = () => {
    return vDados?.map((col) => {
      return (
        <tr key={col.acesso_id}>
          <td>
            <Link
              to={`/usuario/dados/${col.id}`}
              className="d-flex justify-content-left align-items-center"
            >
              <Avatar
                className="me-1"
                img={(col && col.foto_url) || defaultAvatar}
                width="32"
                height="32"
              />
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <span className="fw-bolder h5 mb-25">{col.nome}</span>

                  <span className="font-small-2 text-muted">
                    {col.ultimo_quarto
                      ? `Quarto: ${col.ultimo_quarto ?? ""}`
                      : ""}
                    {col.celular ? ` Cel: ${col.celular}` : ""}
                  </span>
                </div>
              </div>
            </Link>
          </td>
          <td>
            <div className="d-flex flex-column">
              <span className="mb-25">{col.plataforma ?? ""}</span>
              <span className="font-small-2 text-muted">{col.mac}</span>
            </div>
          </td>
          <td>
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
            <th>Últimos usuários conectados</th>
            <th>Dispositivo</th>
            <th>
              Conexão
              {vProcessando ? (
                <Spinner
                  type="grow"
                  size="sm"
                  color="primary"
                  className="ms-1"
                />
              ) : null}
            </th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
