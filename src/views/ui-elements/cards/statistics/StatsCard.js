// ** Third Party Components
import { User, Wifi, UserPlus, Smartphone } from 'react-feather'

// ** Custom Components
import Avatar from '@src/@core/components/avatar'

// ** Hooks
import { useEffect, useState } from 'react'

// ** API
import api from '@src/services/api'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
  Spinner,
} from 'reactstrap'

const StatsCard = () => {
  const [vValor1, setValor1] = useState(null)
  const [vProcessando1, setProcessando1] = useState(true)

  const [vValor2, setValor2] = useState(null)
  const [vProcessando2, setProcessando2] = useState(true)

  const [vValor3, setValor3] = useState(null)
  const [vProcessando3, setProcessando3] = useState(true)

  const [vValor4, setValor4] = useState(null)
  const [vProcessando4, setProcessando4] = useState(true)

  const getDados1 = () => {
    setProcessando1(true)
    return api
      .get('/conexao/qtd_total/')
      .then((res) => {
        setProcessando1(false)
        setValor1(res.data.valor)
      })
      .catch((error) => {
        setProcessando1(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados2 = () => {
    setProcessando2(true)
    return api
      .get('/conexao/qtd_dispositivo_online/')
      .then((res) => {
        setProcessando2(false)
        setValor2(res.data.valor)
      })
      .catch((error) => {
        setProcessando2(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados3 = () => {
    setProcessando3(true)
    return api
      .get('/conexao/cadastro_total/')
      .then((res) => {
        setProcessando3(false)
        setValor3(res.data.valor)
      })
      .catch((error) => {
        setProcessando3(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados4 = () => {
    setProcessando4(true)
    return api
      .get('/conexao/usuario_total')
      .then((res) => {
        setProcessando4(false)
        setValor4(res.data.valor)
      })
      .catch((error) => {
        setProcessando4(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  useEffect(() => {
    // ** Requisitar dados
    getDados1()
    getDados2()
    getDados3()
    getDados4()
  }, [])

  return (
    <Card className="card-statistics">
      <CardHeader>
        <h5>Quantidades totais</h5>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>
          <Col sm="6" xl="3" className="mb-2 mb-xl-0">
            <div className="d-flex align-items-center">
              <Avatar
                color="light-primary"
                icon={<Smartphone size={24} />}
                className="me-2"
              />
              <div className="my-auto">
                {vProcessando1 ? (
                  <Spinner type="grow" size="sm" color="primary" />
                ) : (
                  <h4 className="fw-bolder mb-0">{vValor1}</h4>
                )}

                <CardText className="font-small-3 mb-0">
                  Conexões realizadas
                </CardText>
              </div>
            </div>
          </Col>

          <Col sm="6" xl="3" className="mb-2 mb-xl-0">
            <div className="d-flex align-items-center">
              <Avatar
                color="light-info"
                icon={<Wifi size={24} />}
                className="me-2"
              />
              <div className="my-auto">
                {vProcessando2 ? (
                  <Spinner type="grow" size="sm" color="primary" />
                ) : (
                  <h4 className="fw-bolder mb-0">{vValor2}</h4>
                )}

                <CardText className="font-small-3 mb-0">
                  Online no momento
                </CardText>
              </div>
            </div>
          </Col>

          <Col sm="6" xl="3" className="mb-2 mb-sm-0">
            <div className="d-flex align-items-center">
              <Avatar
                color="light-info"
                icon={<UserPlus size={24} />}
                className="me-2"
              />
              <div className="my-auto">
                {vProcessando3 ? (
                  <Spinner type="grow" size="sm" color="primary" />
                ) : (
                  <h4 className="fw-bolder mb-0">{vValor3}</h4>
                )}

                <CardText className="font-small-3 mb-0">
                  Total de cadastros
                </CardText>
              </div>
            </div>
          </Col>

          <Col sm="6" xl="3">
            <div className="d-flex align-items-center">
              <Avatar
                color="light-success"
                icon={<User size={24} />}
                className="me-2"
              />
              <div className="my-auto">
                {vProcessando4 ? (
                  <Spinner type="grow" size="sm" color="primary" />
                ) : (
                  <h4 className="fw-bolder mb-0">{vValor4}</h4>
                )}

                <CardText className="font-small-3 mb-0">
                  Total de usuários
                </CardText>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
