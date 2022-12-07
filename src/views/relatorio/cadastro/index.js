// ** React
import { Fragment, useState } from "react"

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, Spinner } from "reactstrap"

// ** Icons
import { Check } from "react-feather"

// ** Terceiros
import { useTranslation } from "react-i18next"

// ** API
import api from "@src/services/api"

const ExportarEmail = () => {
  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vCarregando, setCarregando] = useState(false)

  const [vDataInicial, setDataInicial] = useState(null)
  const [vDataFinal, setDataFinal] = useState(null)

  const handleVisualizar = () => {
    setCarregando(true)
    api
      .get(`/usuario/exportar_email/${vDataInicial}/${vDataFinal}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "emails.xlsx")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setCarregando(false)
      })
  }

  return (
    <Row>
      <Col md="8" className="offset-md-2">
        <Card className="mb-1 p-2">
          <h5 className="text-center ps-2 pe-2">
            Análise quantitativa dos usuários que visitaram seu estabelecimento
            nas datas informadas
          </h5>
          <Row className="mt-2">
            <Col md="4">
              <Label className="form-label" for="data_inicial">
                Data inicial da visita
              </Label>
              <Input
                id="data_inicial"
                type="date"
                value={vDataInicial ?? ""}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </Col>
            <Col md="4">
              <Label className="form-label" for="data_final">
                Data final da visita
              </Label>
              <Input
                id="data_final"
                type="date"
                value={vDataFinal ?? ""}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </Col>
            <Col md="4" className="text-end">
              <Button.Ripple
                color="primary"
                onClick={handleVisualizar}
                className="mt-2"
                disabled={vCarregando}
              >
                {!vCarregando ? (
                  <Fragment>
                    <Check size={17} />
                    <span className="align-middle ms-25">
                      {t("Visualizar")}
                    </span>
                  </Fragment>
                ) : (
                  <Spinner size="sm" color="light" />
                )}
              </Button.Ripple>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default ExportarEmail
