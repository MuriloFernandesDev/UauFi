// ** Reactstrap
import { Card, CardBody, CardText, Spinner } from "reactstrap"

// ** Imagens
import medal from "@src/assets/images/illustration/badge.svg"

// ** Hooks
import { useEffect, useState } from "react"

// ** API
import api from "@src/services/api"

// ** Utils
import { formatDateTime } from "@utils"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"
import { Link } from "react-router-dom"

const CardUsuarioMaisVisita = () => {
  // ** States
  const [vDados, setDados] = useState({ nome: "", qtd: "0", ultima_visita: "" })

  const [vProcessando, setProcessando] = useState(true)

  const getDados = () => {
    setProcessando(true)
    return api
      .get("/conexao/usuario_mais_visita")
      .then((res) => {
        setProcessando(false)
        setDados(res.data)
      })
      .catch((error) => {
        setProcessando(false)
        console.error("Erro ao pegar dados:", error)
      })
  }

  useEffect(() => {
    // ** Requisitar dados
    getDados()
  }, [])

  return (
    <Card className="card-congratulations-medal">
      <CardBody>
        <h6 className="mb-1">Usuário que mais te visitou:</h6>

        {!vProcessando ? (
          vDados?.qtd > 0 ? (
            <Link to={`/usuario/dados/${vDados?.id}`}>
              <div>
                <h5>
                  <Avatar
                    className="me-1"
                    img={(vDados && vDados.foto_url) || defaultAvatar}
                  />
                  {vDados?.nome}
                </h5>
                <CardText className="font-small-3">
                  <span>
                    Última visita {formatDateTime(vDados?.ultima_visita)}
                  </span>
                </CardText>
                <h3 className="mb-75 mt-1">{vDados?.qtd} visitas</h3>
              </div>
            </Link>
          ) : (
            <div className="mb-2">
              <h6>Ninguém se conectou aqui ainda 😔</h6>
            </div>
          )
        ) : (
          <div className="mb-2">
            <Spinner type="grow" color="primary" />
          </div>
        )}
        <img
          className="congratulation-medal"
          src={medal}
          alt="Medalha"
          height="80"
        />
      </CardBody>
    </Card>
  )
}

export default CardUsuarioMaisVisita
