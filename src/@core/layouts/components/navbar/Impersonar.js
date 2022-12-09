// ** React Imports
import { useState, Fragment } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { selectThemeColors } from "@utils"

// ** API
import api from "@src/services/api"

// ** Reactstrap Imports
import { Label, Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap"

// ** Third Party Components
import { components } from "react-select"
import AsyncSelect from "react-select/async"
import { useTranslation } from "react-i18next"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png"

const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div className="d-flex justify-content-left align-items-center">
        <Avatar
          className="my-0 me-1 img-proporcional"
          size="sm"
          img={data?.foto?.length > 0 ? data.foto : defaultAvatar}
        />
        <div className="d-flex flex-column">
          <h6 className="user-name text-truncate mb-0">{data.email}</h6>
          <div>{data.nome}</div>
          <div>{data.cliente_nome}</div>
        </div>
      </div>
    </components.Option>
  )
}

const Impersonar = ({
  show,
  setShow,
  pEmail,
  handleImpersonar,
  setImpersonando,
}) => {
  // ** Variáveis de estado
  const [query, setQuery] = useState("")

  // ** Hooks
  const { t } = useTranslation()

  const handleDBInputChange = (newValue) => {
    setQuery(newValue)
  }

  const handleDBChange = (value) => {
    setImpersonando(true)
    api
      .post("/cliente_login/auth/", {
        email: pEmail,
        senha: "",
        email_impersonar: value.email,
      })
      .then((response) => {
        handleImpersonar(response.data)
      })
      .catch(() => {
        setImpersonando(false)
      })
  }

  const loadOptionsDB = () => {
    return api
      .get("/cliente_login/lista", { params: { q: query, limit: 20 } })
      .then((res) => {
        return res.data.map((ret) => ({
          label: ret.label,
          value: ret.id,
          email: ret.email,
          cliente_nome: ret.cliente_nome,
          foto: ret.foto,
          nome: ret.nome,
        }))
      })
  }

  return (
    <Fragment>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-4">
          <h1 className="text-center mb-1">Impersonar</h1>
          <p className="text-center">
            Utilize o dashboard com as permissões do login abaixo
          </p>
          <Row>
            <Col md="12" className="mb-2">
              <Label
                for="login_id"
                className="form-label fw-bolder font-size font-small-4 mb-50"
              >
                Logins disponíveis
              </Label>
              <AsyncSelect
                defaultOptions
                isClearable={true}
                noOptionsMessage={() => t("Vazio")}
                loadingMessage={() => t("Pesquisando...")}
                placeholder={t("Selecione...")}
                id="login_id"
                name="db-react-select"
                className="react-select"
                classNamePrefix="select"
                onChange={handleDBChange}
                theme={selectThemeColors}
                loadOptions={loadOptionsDB}
                onInputChange={handleDBInputChange}
                components={{
                  Option: OptionComponent,
                }}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Impersonar
