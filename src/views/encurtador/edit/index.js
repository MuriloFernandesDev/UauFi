// ** React
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

// ** API
import api from "@src/services/api"

// ** Reactstrap
import { Row, Col, Spinner } from "reactstrap"

// ** Editar Encurtador
import EditCard from "./EditCard"

// ** Terceiros
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import UILoader from "@components/ui-loader"
import { getEncurtador } from "../store"
import { useDispatch, useSelector } from "react-redux"

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

const EncurtadorEdit = () => {
  // ** Hooks
  const { id } = useParams()
  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const vParFiltro = useSelector((state) => state.url_encurtada.params)

  // ** States
  const [data, setData] = useState(null)
  const [vCarregando, setCarregando] = useState(true)
  const [vSalvando, setSalvando] = useState(false)

  const handleOK = () => {
    setSalvando(false)
    dispatch(getEncurtador(vParFiltro))
    navigate("/encurtador")
  }

  // ** Função para salvar dados & respostas a erros
  const handleSalvar = (pDados) => {
    setSalvando(true)
    if (pDados.id > 0) {
      api
        .put("/url_encurtada", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Encurtador editado com sucesso!", {
              position: "bottom-right",
            })
            handleOK()
          }
        })
        .catch((error) => {
          setSalvando(false)
          if (error.response.status === 400) {
            handleError(
              "Atenção!",
              "Preencha todos os campos corretamente.",
              "warning"
            )
          } else if (error.response.status === 503) {
            handleError("Ops...", error.response.data, "error")
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
        .post("/url_encurtada", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Encurtador criado com sucesso!", {
              position: "bottom-right",
            })
            handleOK()
          }
        })
        .catch((error) => {
          setSalvando(false)
          if (error.response.status === 400) {
            handleError(
              "Atenção!",
              "Preencha todos os campos corretamente.",
              "warning"
            )
          } else if (error.response.status === 503) {
            handleError("Ops...", error.response.data, "error")
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
    api.get(`/url_encurtada/${id}`).then((response) => {
      setData(response.data)
      setCarregando(false)
    })
  }, [])

  return vCarregando ? (
    <div className="text-center">
      <Spinner color="primary" />
    </div>
  ) : (
    <UILoader blocking={vSalvando}>
      <Row>
        <Col sm={12}>
          <EditCard data={data} setSalvarDados={handleSalvar} />
        </Col>
      </Row>
    </UILoader>
  )
}

export default EncurtadorEdit