// ** React
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"

// ** API
import api from "@src/services/api"

// ** Reactstrap
import { Row, Col, Spinner } from "reactstrap"

// ** Editar Login
import EditCard from "./EditCard"
import { getClienteLogin } from "../store"
import { useDispatch, useSelector } from "react-redux"

// ** Terceiros
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import UILoader from "@components/ui-loader"

// ** Context
import { AbilityContext as PermissaoContext } from "@src/utility/context/Can"

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

const ClienteLoginEdit = () => {
  // ** Hooks
  const { id } = useParams()

  const navigate = useNavigate()

  // ** Store vars
  const dispatch = useDispatch()
  const vParFiltro = useSelector((state) => state.cliente_login.params)

  // ** States
  const [data, setData] = useState(null)
  const [vCarregando, setCarregando] = useState(true)
  const [vSalvando, setSalvando] = useState(false)

  // ** Context
  const permissao = useContext(PermissaoContext)

  const handleOK = () => {
    setSalvando(false)
    dispatch(getClienteLogin(vParFiltro))
    if (permissao.can("read", "adm_login")) {
      navigate("/adm/login")
    } else {
      navigate(-1)
    }
  }

  // ** Função para salvar dados & respostas a erros
  const handleSalvar = (pDados) => {
    setSalvando(true)
    if (pDados.id > 0) {
      api
        .put("/cliente_login", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Login editado com sucesso!", {
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
        .post("/cliente_login", pDados)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Login criado com sucesso!", {
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

  // ** Get Dados on mount based on id
  useEffect(() => {
    api.get(`/cliente_login/${id}`).then((response) => {
      setData(response.data[0])
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

export default ClienteLoginEdit
