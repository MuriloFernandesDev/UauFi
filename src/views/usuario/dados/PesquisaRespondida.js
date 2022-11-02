// ** React Imports
import { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, Spinner } from "reactstrap"

// ** Store & Actions
import { getRespostas } from "../store"

// ** Utils
import { formatDateTime } from "@utils"

import { Trash, CheckSquare, Square } from "react-feather"

const PesquisaRespondida = (dados) => {
  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)

  const handleDelete = (hash, pesquisa_id) => {
    console.log(hash, pesquisa_id)
  }

  useEffect(() => {
    setCarregando(true)
    getRespostas(dados.id)
      .then((response) => {
        setCarregando(false)

        setDados(response)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [])

  const renderData = () => {
    return vDados.map((pergunta, i) => {
      return (
        <Card key={i}>
          <CardBody>
            <CardTitle className="mb-50">{pergunta.nome}</CardTitle>
            {pergunta.item.map((resposta, ii) => {
              return (
                <div key={ii} className="d-flex mt-2">
                  <div className="flex-shrink-0">
                    {resposta.sel ? (
                      <CheckSquare className="font-medium-3 me-2" />
                    ) : (
                      <Square className="font-medium-3 me-2" />
                    )}
                  </div>
                  <div className="d-flex align-item-center justify-content-between flex-grow-1">
                    <div className="me-1">
                      <p className="fw-bolder mb-0">{resposta.texto}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="d-flex justify-content-between border-top mt-2 pt-2">
              <h6 className="m-0">
                {pergunta.hotspot_nome} ({formatDateTime(pergunta.data_hora)})
              </h6>
              <div className="action-icons">
                <Link
                  to="/"
                  className="text-body"
                  onClick={(e) => {
                    handleDelete(pergunta.hash, pergunta.pesquisa_id)
                    e.preventDefault()
                  }}
                >
                  <Trash className="font-medium-3 text-danger cursor-pointer" />
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      )
    })
  }

  return (
    <Fragment>
      {!vCarregando ? (
        vDados?.length > 0 ? (
          renderData()
        ) : null
      ) : (
        <div className="text-center mt-3">
          <Spinner type="grow" size="sm" color="primary" />
        </div>
      )}
    </Fragment>
  )
}

export default PesquisaRespondida
