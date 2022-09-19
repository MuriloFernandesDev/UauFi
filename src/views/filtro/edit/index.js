// ** React
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

// ** API
import api from "@src/services/api"

// ** Reactstrap
import { Row, Col, Spinner } from "reactstrap"

// ** Editar filtro
import EditCard from "./EditCard"

// ** Terceiros
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// ** Modal de apresentação de erros

const MySwal = withReactContent(Swal)

const handleError = (error, errorMessage, errorIcon) => {
  return MySwal.fire({
    title: error,
    text: errorMessage,
    icon: errorIcon,
    customClass: {
      confirmButton: "btn btn-primary",
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
    buttonsStyling: false,
  })
}

const FiltroEdit = () => {
  // ** Hooks
  const { id } = useParams()

  const navigate = useNavigate()

  // ** States
  const [data, setData] = useState(null)
  const [vCarregando, setCarregando] = useState(true)

  // ** Função para salvar dados & respostas a erros
  const handleSalvar = (pDados) => {
    if (pDados.id > 0) {
      api
        .put("/filtro", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Filtro editado com sucesso!", {
              position: "bottom-right",
            })
            navigate("/filtro")
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            handleError(
              "Atenção!",
              "Preencha todos os campos corretamente.",
              "warning"
            )
          } else if (error.response.status === 503) {
            handleError(
              "Hotspot offline",
              "Tente novamente mais tarde.",
              "error"
            )
          } else {
            handleError(
              "Erro inesperado",
              "Por favor, contate um administrador.",
              "error"
            )
          }
        })
    } else {
      api
        .post("/filtro", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Filtro criado com sucesso!", {
              position: "bottom-right",
            })
            navigate("/filtro")
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            handleError(
              "Atenção!",
              "Preencha todos os campos corretamente.",
              "warning"
            )
          } else if (error.response.status === 503) {
            handleError(
              "Hotspot offline",
              "Tente novamente mais tarde.",
              "error"
            )
          } else {
            handleError(
              "Erro inesperado",
              "Por favor, contate um administrador.",
              "error"
            )
          }
        })
    }
  }

  // ** Get filter on mount based on id
  useEffect(() => {
    api.get(`/filtro/${id}`).then((response) => {
      setData(response.data[0])
      setCarregando(false)
    })
  }, [])

  return vCarregando ? (
    <div className="text-center">
      <Spinner color="primary" />
    </div>
  ) : (
    <div>
      <Row>
        <Col sm={12}>
          <EditCard data={data} setSalvarDados={handleSalvar} />
        </Col>
      </Row>
    </div>
  )
}

export default FiltroEdit
