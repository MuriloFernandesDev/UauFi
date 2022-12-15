// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Reactstrap Imports
import { Table, Card, Spinner } from "reactstrap"

import { useEffect, useState, useRef } from "react"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"

// ** Utils
import { formatDateTime } from "@utils"

// ** API
import api from "@src/services/api"
import { RefreshCw } from "react-feather"

const CardUltimosUsuarios = () => {
  // ** States
  const [vDados, setDados] = useState(null)
  const [vProcessando, setProcessando] = useState(true)

  const vTimeoutPesquisa = useRef()

  const getDados = (tempo) => {
    if (vTimeoutPesquisa) {
      clearTimeout(vTimeoutPesquisa.current)
    }
    vTimeoutPesquisa.current = setTimeout(() => {
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
    }, tempo)
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados(vDados ? 60000 : 1)
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
                className="me-1 img-proporcional"
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
          <td colSpan={2}>
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
            <th>Conexão</th>
            <th style={{ width: "10px" }} className="pe-1 pb-0">
              {vProcessando ? (
                <Spinner
                  type="grow"
                  size="sm"
                  color="primary"
                  className="ms-1"
                />
              ) : (
                <Link
                  to="/"
                  className="text-body m-0"
                  onClick={(e) => {
                    e.preventDefault()
                    getDados(1)
                  }}
                >
                  <RefreshCw className="font-medium-3 text-success cursor-pointer" />
                </Link>
              )}
            </th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CardUltimosUsuarios
