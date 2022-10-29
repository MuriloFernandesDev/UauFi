// ** React Imports
import { useState, Fragment, useEffect } from "react"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  ModalBody,
  ModalHeader,
} from "reactstrap"

// ** Third Party Components
import Swal from "sweetalert2"
import Select from "react-select"
import { Check, X, Wifi, MapPin } from "react-feather"
import { useForm, Controller } from "react-hook-form"
import withReactContent from "sweetalert2-react-content"

// ** Store & Actions
import { getInfoUsuario, getTotais } from "../store"
import { useDispatch } from "react-redux"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { selectThemeColors, formatDate, formatDateTime } from "@utils"

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss"

import toast from "react-hot-toast"

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]

const countryOptions = [
  { value: "uk", label: "UK" },
  { value: "usa", label: "USA" },
  { value: "france", label: "France" },
  { value: "russia", label: "Russia" },
  { value: "canada", label: "Canada" },
]

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "dutch", label: "Dutch" },
]

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

const UserInfoCard = ({ dados }) => {
  // ** State
  const [show, setShow] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()

  // ** States
  const [vDados, setDados] = useState(true)
  const [vTotais, setTotais] = useState(true)

  // ** Hook
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: dados.nome,
      lastName: dados.nome.split(" ")[1],
      firstName: dados.nome.split(" ")[0],
    },
  })

  // ** render user img
  const renderUserImg = () => {
    if (dados !== null && dados.foto_url?.length) {
      return (
        <img
          height="110"
          width="110"
          alt="foto"
          src={dados?.foto_url}
          className="img-fluid rounded mt-3 mb-2"
        />
      )
    } else {
      return (
        <Avatar
          initials
          color={"light-primary"}
          className="rounded mt-3 mb-2"
          content={dados.nome}
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(48px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "110px",
            width: "110px",
          }}
        />
      )
    }
  }

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          })
        }
      }
    }
  }

  const handleReset = () => {
    reset({
      username: dados.nome,
      lastName: dados.nome.split(" ")[1],
      firstName: dados.nome.split(" ")[0],
    })
  }

  // ** Modal de exclusão
  const handleDeleteConfirmation = (row) => {
    return MySwal.fire({
      title: "Tem certeza?",
      text: "Sua ação removerá todos os dados deste usuário e isso não poderá ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover!",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
        popup: "animate__animated animate__fadeIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        api
          .delete(`/usuario/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              handleFilter(store.params.q)

              toast.success("Removido com sucesso!", {
                position: "bottom-right",
              })
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              handleError("Atenção!", "Não autorizado.", "warning")
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
    })
  }

  // ** Get suer on mount
  useEffect(() => {
    getInfoUsuario(dados.id).then((response) => {
      setDados(response)
    })
    getTotais(dados.id).then((response) => {
      setTotais(response)
    })
  }, [dispatch])

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section">
            <div className="d-flex align-items-center flex-column">
              {renderUserImg()}
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4>{dados.nome ?? ""}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around my-2 pt-75">
            <div className="d-flex align-items-start me-2">
              <Badge color="light-primary" className="rounded p-75">
                <MapPin className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {new Intl.NumberFormat().format(vTotais?.visitas ?? 0)}
                </h4>
                <small>Visitas</small>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <Badge color="light-primary" className="rounded p-75">
                <Wifi className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {new Intl.NumberFormat().format(vTotais?.conexoes ?? 0)}
                </h4>
                <small>Conexões</small>
              </div>
            </div>
          </div>
          <h4 className="fw-bolder border-bottom pb-50 mb-1">Dados</h4>
          <div className="info-container">
            {dados !== null ? (
              <ul className="list-unstyled">
                <li className="mb-75">
                  <span className="fw-bolder me-25">Nome:</span>
                  <span>{dados.nome ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25 text-nowrap">E-mail:</span>
                  <span>{dados.email ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">CPF:</span>
                  <span>{dados.cpf ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Nascimento:</span>
                  <span>{formatDate(dados.nascimento) ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Gênero:</span>
                  <span className="text-capitalize">
                    {vDados?.genero ?? ""}
                  </span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Cidade:</span>
                  <span>{vDados?.cidade ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Estado:</span>
                  <span>{vDados?.estado ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Celular:</span>
                  <span>{dados.celular ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">País:</span>
                  <span>{vDados?.pais ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Data do cadastro:</span>
                  <span>{formatDateTime(dados.data_cadastro) ?? ""}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">Login social:</span>
                  <span>{dados.social_type ?? ""}</span>
                </li>
                {dados.ultimo_quarto ? (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">Último quarto:</span>
                    <span>{dados.ultimo_quarto ?? ""}</span>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
          <div className="d-flex justify-content-center pt-2">
            <Button
              color="primary"
              className="d-none"
              onClick={() => setShow(true)}
            >
              Editar
            </Button>
            <Button
              className="ms-1"
              color="danger"
              outline
              onClick={handleDeleteConfirmation}
            >
              Remover cadastro
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">Edit User Information</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 pt-75">
              <Col md={6} xs={12}>
                <Label className="form-label" for="firstName">
                  First Name
                </Label>
                <Controller
                  defaultValue=""
                  control={control}
                  id="firstName"
                  name="firstName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="John"
                      invalid={errors.firstName && true}
                    />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="lastName">
                  Last Name
                </Label>
                <Controller
                  defaultValue=""
                  control={control}
                  id="lastName"
                  name="lastName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Doe"
                      invalid={errors.lastName && true}
                    />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className="form-label" for="username">
                  Username
                </Label>
                <Controller
                  defaultValue=""
                  control={control}
                  id="username"
                  name="username"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="username"
                      placeholder="john.doe.007"
                      invalid={errors.username && true}
                    />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="billing-email">
                  Billing Email
                </Label>
                <Input
                  type="email"
                  id="billing-email"
                  defaultValue={dados.email}
                  placeholder="example@domain.com"
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="status">
                  Status:
                </Label>
                <Select
                  id="status"
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={statusOptions}
                  theme={selectThemeColors}
                  defaultValue={
                    statusOptions[
                      statusOptions.findIndex(
                        (i) => i.value === dados.hotspot_id
                      )
                    ]
                  }
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="tax-id">
                  Tax ID
                </Label>
                <Input
                  id="tax-id"
                  placeholder="Tax-1234"
                  defaultValue={dados.celular}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="contact">
                  Contact
                </Label>
                <Input
                  id="contact"
                  defaultValue={dados.celular}
                  placeholder="+1 609 933 4422"
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="language">
                  language
                </Label>
                <Select
                  id="language"
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={languageOptions}
                  theme={selectThemeColors}
                  defaultValue={languageOptions[0]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="country">
                  Country
                </Label>
                <Select
                  id="country"
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions[0]}
                />
              </Col>
              <Col xs={12}>
                <div className="d-flex align-items-center mt-1">
                  <div className="form-switch">
                    <Input
                      type="switch"
                      defaultChecked
                      id="billing-switch"
                      name="billing-switch"
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="billing-switch"
                    >
                      <span className="switch-icon-left">
                        <Check size={14} />
                      </span>
                      <span className="switch-icon-right">
                        <X size={14} />
                      </span>
                    </Label>
                  </div>
                  <Label
                    className="form-check-label fw-bolder"
                    for="billing-switch"
                  >
                    Use as a billing address?
                  </Label>
                </div>
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="primary">
                  Submit
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => {
                    handleReset()
                    setShow(false)
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default UserInfoCard
