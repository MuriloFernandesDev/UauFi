// ** React Imports
import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// ** Custom Hooks
import useJwt from '@src/auth/jwt/useJwt'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { AlertTriangle, AlignCenter, Wifi, X } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@src/@core/components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** API
import api from '@src/services/api'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Spinner,
  Button,
  CardText,
  CardTitle,
} from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { getUserData } from '../../../utility/Utils'

const ToastContent = ({ t, mensagem }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color="warning" icon={<AlertTriangle size={12} />} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>Ops!</h6>
          <X
            size={12}
            className="cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>{mensagem}</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: '',
  loginEmail: '',
}

const Login = ({ s }) => {
  // ** Hooks
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const [vEntrando, setEntrando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vDadosSlug, setDadosSlug] = useState({
    logo: null,
    title: '',
    primaryColor: '',
    secondColor: '',
    slug: 'uau-fi',
  })

  //useEffect para verificar se j?? existe um usuario logado
  useEffect(() => {
    const user = getUserData()

    if (user) {
      navigate(getHomeRouteForLoggedInUser(user.role))
    } else {
      setLoading(false)
    }
  }, [])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })
  const source = require(`@src/assets/images/pages/bg-login.jpg`).default

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setEntrando(true)
      useJwt
        .login({ email: data.loginEmail, senha: data.password })
        .then((res) => {
          if (res.data !== '') {
            const data = {
              ...res.data,
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            }
            dispatch(handleLogin(data))
            ability.update(res.data.ability)
            navigate(getHomeRouteForLoggedInUser(data.role))
          } else {
            toast((t) => (
              <ToastContent t={t} mensagem={'E-mail e/ou senha inv??lidos!'} />
            ))
          }
          setEntrando(false)
        })
        .catch((err) => {
          setEntrando(false)
          toast((t) => (
            <ToastContent
              t={t}
              mensagem={'Sistema offline, tente novamente mais tarde!'}
            />
          ))
          console.log(err)
        })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
          })
        }
      }
    }
  }

  const getDadosSlug = () => {
    return api
      .get(`/cliente/tema?slug=${slug ?? s}`)
      .then((res) => {
        setDadosSlug(res.data)
      })
      .catch((error) => {
        console.error('Erro ao pegar dados:', error)
      })
  }

  useEffect(() => {
    // ** Requisitar perfil slug
    getDadosSlug()
  }, [])

  return (
    <div className="auth-wrapper auth-cover">
      {loading ? (
        <div
          style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size="md" />
        </div>
      ) : (
        <Row className="auth-inner m-0">
          <Col
            className="d-none d-lg-flex align-items-center p-5"
            lg="8"
            sm="12"
            style={{
              backgroundImage: `url("${source}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></Col>
          <Col
            className="d-flex align-items-center auth-bg px-2 p-lg-5"
            lg="4"
            sm="12"
          >
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
              <div className="text-center mb-4">
                {vDadosSlug.logo ? (
                  <img
                    alt="Logotipo"
                    src={vDadosSlug.logo}
                    style={{ maxHeight: '100%', maxWidth: '60%' }}
                  ></img>
                ) : (
                  <Wifi size={30} />
                )}
              </div>
              <CardTitle tag="h3" className="fw-bold mb-1">
                Bem-vindo ao seu dashboard!
              </CardTitle>
              <CardText className="mb-2">
                Entre usando seu login e senha
              </CardText>
              <Form
                className="auth-login-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Login
                  </Label>
                  <Controller
                    id="loginEmail"
                    name="loginEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        type="text"
                        placeholder="seu login"
                        invalid={errors.loginEmail && true}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Senha
                    </Label>
                    <Link to="/esqueci-senha" tabIndex={-1}>
                      <small>Esqueceu?</small>
                    </Link>
                  </div>
                  <Controller
                    id="password"
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className="input-group-merge"
                        invalid={errors.password && true}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="form-check mb-1">
                  <Input type="checkbox" id="remember-me" defaultChecked />
                  <Label className="form-check-label" for="remember-me">
                    Manter conectado
                  </Label>
                </div>

                {vEntrando ? (
                  <Button type="submit" color="primary" block disabled>
                    <Spinner size="sm" />
                    <span className="ms-50">Entrando...</span>
                  </Button>
                ) : (
                  <Button type="submit" color="primary" block>
                    Entrar
                  </Button>
                )}
              </Form>
            </Col>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default Login
