// ** React Imports
import { Fragment, useState } from "react"
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Alert,
  Input,
  Modal,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  ModalHeader,
} from "reactstrap"

// ** Third Party Components
import Cleave from "cleave.js/react"
import "cleave.js/dist/addons/cleave-phone.us"

import {
  Trash,
  Settings,
  MessageSquare,
  ChevronRight,
  CheckSquare,
  Square,
} from "react-feather"

// ** Images
import qrCode from "@src/assets/images/icons/qrcode.png"

const AppAuthComponent = ({ setShow, setShowDetailModal }) => {
  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }

  return (
    <Fragment>
      <h1 className="text-center mb-2 pb-50">Add Authenticator App</h1>
      <h4>Authenticator Apps</h4>
      <p>
        Using an authenticator app like Google Authenticator, Microsoft
        Authenticator, Authy, or 1Password, scan the QR code. It will generate a
        6 digit code for you to enter below.
      </p>
      <div className="d-flex justify-content-center my-2 py-50">
        <img src={qrCode} alt="QR Code" className="img-fluid" width="122" />
      </div>
      <Alert color="warning">
        <h4 className="alert-heading">ASDLKNASDA9AHS678dGhASD78AB</h4>
        <div className="alert-body fw-normal">
          If you having trouble using the QR code, select manual entry on your
          app
        </div>
      </Alert>
      <Row className="gy-1">
        <Col xs={12}>
          <Input placeholder="Enter authentication code" />
        </Col>
        <Col className="d-flex justify-content-end" xs={12}>
          <Button
            outline
            color="secondary"
            className="mt-1 me-1"
            onClick={toggle}
          >
            Cancel
          </Button>
          <Button color="primary" className="mt-1">
            <span className="me-50">Continue</span>
            <ChevronRight size={14} />
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

const AppSMSComponent = ({ setShow, setShowDetailModal }) => {
  const toggle = () => {
    setShow(false)
    setShowDetailModal(false)
  }
  return (
    <Fragment>
      <h1 className="text-center mb-2 pb-50">Add your number</h1>
      <h4>Verify Your Mobile Number for SMS</h4>
      <p>
        Enter your mobile phone number with country code and we will send you a
        verification code.
      </p>
      <Row className="gy-1 mt-1">
        <Col xs={12}>
          <Cleave
            className="form-control"
            placeholder="1 234 567 8900"
            options={{ phone: true, phoneRegionCode: "US" }}
          />
        </Col>
        <Col className="d-flex justify-content-end" xs={12}>
          <Button
            outline
            color="secondary"
            className="mt-1 me-1"
            onClick={toggle}
          >
            Cancel
          </Button>
          <Button color="primary" className="mt-1">
            <span className="me-50">Continue</span>
            <ChevronRight size={14} />
          </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

const SecurityTab = () => {
  // ** Hooks
  const [show, setShow] = useState(false)
  const [authType, setAuthType] = useState("authApp")
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleContinue = () => {
    setShow(false)
    setShowDetailModal(true)
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-50">Qual sua cor favorita?</CardTitle>
          <div className="d-flex mt-2">
            <div className="flex-shrink-0">
              <CheckSquare className="font-medium-3 me-2" />
            </div>
            <div className="d-flex align-item-center justify-content-between flex-grow-1">
              <div className="me-1">
                <p className="fw-bolder mb-0">Azul</p>
              </div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="flex-shrink-0">
              <Square className="font-medium-3 me-2" />
            </div>
            <div className="d-flex align-item-center justify-content-between flex-grow-1">
              <div className="me-1">
                <p className="fw-bolder mb-0">Vermelho</p>
              </div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="flex-shrink-0">
              <Square className="font-medium-3 me-2" />
            </div>
            <div className="d-flex align-item-center justify-content-between flex-grow-1">
              <div className="me-1">
                <p className="fw-bolder mb-0">Verde</p>
              </div>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div className="flex-shrink-0">
              <Square className="font-medium-3 me-2" />
            </div>
            <div className="d-flex align-item-center justify-content-between flex-grow-1">
              <div className="me-1">
                <p className="fw-bolder mb-0">Amarelo</p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between border-top mt-2 pt-2">
            <h6 className="m-0">Nome do Hotspot (00/00/0000 00:00:00)</h6>
            <div className="action-icons">
              <Link
                to="/"
                className="text-body"
                onClick={(e) => e.preventDefault()}
              >
                <Trash className="font-medium-3 text-danger cursor-pointer" />
              </Link>
            </div>
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
        <ModalBody className="pb-5 px-sm-5 mx-50">
          <h1 className="text-center mb-1">Select Authentication Method</h1>
          <p className="text-center mb-3">
            you also need to select a method by which the proxy
            <br />
            authenticates to the directory serve
          </p>
          <div className="custom-options-checkable">
            <input
              type="radio"
              id="authApp"
              name="authType"
              checked={authType === "authApp"}
              className="custom-option-item-check"
              onChange={() => setAuthType("authApp")}
            />
            <label
              htmlFor="authApp"
              className="custom-option-item d-flex align-items-center flex-column flex-sm-row px-3 py-2 mb-2"
            >
              <span>
                <Settings className="font-large-2 me-sm-2 mb-2 mb-sm-0" />
              </span>
              <span>
                <span className="custom-option-item-title d-block h3">
                  Authenticator Apps
                </span>
                <span className="mt-75">
                  Get codes from an app like Google Authenticator, Microsoft
                  Authenticator, Authy or 1Password.
                </span>
              </span>
            </label>
            <input
              type="radio"
              id="authSMS"
              name="authType"
              checked={authType === "authSMS"}
              className="custom-option-item-check"
              onChange={() => setAuthType("authSMS")}
            />
            <label
              htmlFor="authSMS"
              className="custom-option-item d-flex align-items-center flex-column flex-sm-row px-3 py-2 mb-2"
            >
              <span>
                <MessageSquare className="font-large-2 me-sm-2 mb-2 mb-sm-0" />
              </span>
              <span>
                <span className="custom-option-item-title d-block h3">SMS</span>
                <span className="mt-75">
                  We will send a code via SMS if you need to use your backup
                  login method.
                </span>
              </span>
            </label>
          </div>
          <Button
            color="primary"
            className="float-end mt-2"
            onClick={handleContinue}
          >
            <span className="me-50">Continue</span>
            <ChevronRight size={14} />
          </Button>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showDetailModal}
        className="modal-dialog-centered modal-lg"
        toggle={() => setShowDetailModal(!showDetailModal)}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowDetailModal(!showDetailModal)}
        ></ModalHeader>
        <ModalBody className="pb-5 px-sm-5 mx-50">
          {authType === "authApp" ? (
            <AppAuthComponent
              setShow={setShow}
              setShowDetailModal={setShowDetailModal}
            />
          ) : (
            <AppSMSComponent
              setShow={setShow}
              setShowDetailModal={setShowDetailModal}
            />
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default SecurityTab
