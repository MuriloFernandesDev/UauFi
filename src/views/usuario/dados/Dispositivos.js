// ** React Imports
import { Fragment, useState, useEffect } from "react"

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Button, Spinner } from "reactstrap"

import { Link } from "react-router-dom"

// ** Store & Actions
import { getDispositivos } from "../store"

// ** Utils
import { formatDateTime } from "@utils"

// ** Icons Imports
import { Trash } from "react-feather"
import { auto } from "@popperjs/core"

const Dispositivos = (dados) => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const handleDelete = (id) => {
    console.log(id)
  }

  useEffect(() => {
    setCarregando(true)
    getDispositivos(dados.id)
      .then((response) => {
        setCarregando(false)

        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [])

  return (
    <Fragment>
      <Card>
        <CardBody style={{ maxHeight: "600px", overflow: auto }}>
          <CardTitle className="mb-75">Dispositivos utilizados</CardTitle>
          {!vCarregando ? (
            vDados?.length > 0 ? (
              vDados.map((item, index) => {
                return (
                  <div key={index} className="d-flex mt-2">
                    <div className="d-flex align-item-center justify-content-between flex-grow-1">
                      <div className="me-1">
                        <p className="fw-bolder mb-0">
                          {item.plataforma} {item.modelo} {item.marca}
                        </p>
                        <p className="mb-0">{item.mac}</p>
                        <span>
                          Cadastrado em: {formatDateTime(item.data_cadastro)}
                        </span>
                      </div>
                      <div className="mt-50 mt-sm-0">
                        <Link
                          to="/"
                          className="text-body m-0"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash className="font-medium-3 text-danger cursor-pointer" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : null
          ) : (
            <div className="text-center mt-3">
              <Spinner type="grow" size="sm" color="primary" />
            </div>
          )}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default Dispositivos
