// ** Custom Components
import Timeline from "@components/timeline"
import { Download, Trash, Upload, User, Wifi } from "react-feather"

import { Link } from "react-router-dom"

// ** React Imports
import { useEffect, useState } from "react"

import PerfectScrollbar from "react-perfect-scrollbar"

// ** Store & Actions
import { getAcessos } from "../store"
import { useDispatch } from "react-redux"

// ** Utils
import { formatDateTime } from "@utils"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Spinner } from "reactstrap"
import { auto } from "@popperjs/core"

const LinhaDoTempo = (dados) => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const formatarBytes = (valor) => {
    let vUnidade = " Bytes"
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = " KB"
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = " MB"
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = " GB"
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = " TB"
    }
    return `${new Intl.NumberFormat().format(valor)} ${vUnidade}`
  }

  // ** Get suer on mount
  useEffect(() => {
    setCarregando(true)
    getAcessos(dados.id)
      .then((response) => {
        setCarregando(false)
        const dadosVar = response.map((d) => ({
          title: d.hotspot.nome,
          icon: d.id > 0 ? <Wifi size={14} /> : <User size={14} />,
          color: d.id > 0 ? "success" : "primary",
          content: `${d.id === 0 ? "Dia do cadastro - " : ""}${formatDateTime(
            d.entrada
          )}${d.id > 0 ? ` - ${formatDateTime(d.saida)}` : ""}`,
          meta: (
            <Link
              to="/"
              className="text-body"
              onClick={(e) => e.preventDefault()}
            >
              <Trash className="font-medium-3 text-danger cursor-pointer" />
            </Link>
          ),
          customContent: (
            <div className="d-flex justify-content-between flex-wrap borda-inferior-suave">
              <div className="d-flex flex-column">
                <h6 className="mb-0 text-truncate text-muted">
                  {d.dispositivo?.plataforma ?? ""}{" "}
                  {d.dispositivo?.modelo ?? ""} {d.dispositivo?.marca ?? ""}
                </h6>
                <span className="text-truncate text-muted">
                  {d.dispositivo?.mac ?? ""}
                </span>
                <span className="text-truncate text-muted">{d.ip ?? ""}</span>
              </div>
              <div className="d-flex flex-column mt-sm-0 mt-50">
                {d.bytes_upload ?? 0 > 0 ? (
                  <div>
                    <span>{formatarBytes(d.bytes_upload)}</span>
                    <Upload size={14} className="ms-50 mb-25 text-primary" />
                  </div>
                ) : null}
                {d.bytes_download ?? 0 > 0 ? (
                  <div>
                    <span>{formatarBytes(d.bytes_download)}</span>
                    <Download size={14} className="ms-50 mb-25 text-primary" />
                  </div>
                ) : null}
              </div>
            </div>
          ),
        }))
        setDados(dadosVar)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [dispatch])

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Linha do tempo</CardTitle>
      </CardHeader>
      <CardBody className="pt-1" style={{ height: "367px", overflow: auto }}>
        {!vCarregando ? (
          vDados?.length > 0 ? (
            <Timeline data={vDados} className="me-50" />
          ) : null
        ) : (
          <div className="text-center mt-3">
            <Spinner type="grow" size="sm" color="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default LinhaDoTempo
