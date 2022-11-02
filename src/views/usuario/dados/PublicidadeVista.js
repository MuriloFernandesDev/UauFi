// ** React Imports
import { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap"

// ** Store & Actions
import { getPublicidade } from "../store"

// ** Utils
import { formatDateTime } from "@utils"

import { Trash } from "react-feather"

const PublicidadeVista = (dados) => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const handleDelete = (id) => {
    console.log(id)
  }

  useEffect(() => {
    setCarregando(true)
    getPublicidade(dados.id)
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
      {!vCarregando ? (
        vDados?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Visualizações</CardTitle>
            </CardHeader>
            <CardBody className="pb-0">
              <Row>
                {vDados.map((item, index) => {
                  return (
                    <Col key={`${item.id}-${index}`} className="mb-2" sm="3">
                      <div className="border rounded">
                        <CardImg
                          className="img-fluid"
                          src={item?.item_path}
                          alt="Mídia"
                          top
                        />
                        <div className="m-0">
                          <div className="text-center mb-1">
                            {item.hotspot_nome}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-center">
                              {formatDateTime(item.data_hora)}
                            </div>
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
                    </Col>
                  )
                })}
              </Row>
            </CardBody>
          </Card>
        ) : null
      ) : (
        <div className="text-center mt-3">
          <Spinner type="grow" size="sm" color="primary" />
        </div>
      )}
    </Fragment>
  )
}

export default PublicidadeVista
