// ** React
import { Fragment, useState, useContext } from 'react'

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, Spinner } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Utils
import { campoInvalido, mostrarMensagem } from '@utils'

// ** Icons
import { Calendar, Check, Clock, UserPlus, Wifi } from 'react-feather'

// ** Terceiros
import { useTranslation } from 'react-i18next'

import CardQtdUsuario from './CardQtdUsuario'
import CardFaixaEtaria from './CardFaixaEtaria'
import CardGenero from './CardGenero'

// ** API
import api from '@src/services/api'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/charts/recharts.scss'

// ** Third Party Components
import 'chart.js/auto'

const ExportarEmail = () => {
  // ** Hooks
  const { t } = useTranslation()

  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** States
  const [vDados, setDados] = useState({ data_inicial: null, data_final: null })
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [{ nome: 'data_inicial' }, { nome: 'data_final' }]
  const [vDatasOK, setDatasOK] = useState(false)

  const [vValor1, setValor1] = useState(null)
  const [vProcessando1, setProcessando1] = useState(true)

  const [vValor2, setValor2] = useState(null)
  const [vProcessando2, setProcessando2] = useState(true)

  const [vValor3, setValor3] = useState(null)
  const [vProcessando3, setProcessando3] = useState(true)

  const [vValor4, setValor4] = useState(null)
  const [vProcessando4, setProcessando4] = useState(true)

  const [vValor5, setValor5] = useState(null)
  const [vProcessando5, setProcessando5] = useState(true)

  const [vValor6, setValor6] = useState(null)
  const [vProcessando6, setProcessando6] = useState(true)

  const [vValor10, setValor10] = useState(null)
  const [vProcessando10, setProcessando10] = useState(true)

  const [vValor7, setValor7] = useState(null)
  const [vProcessando7, setProcessando7] = useState(true)

  const [vValor8, setValor8] = useState(null)
  const [vProcessando8, setProcessando8] = useState(true)

  const [vValor9, setValor9] = useState(null)
  const [vProcessando9, setProcessando9] = useState(true)

  // ** Organiza????o da informa????o
  const handleChange = (e) => {
    const { name, value } = e.target
    setDados((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const getDados1 = () => {
    setProcessando1(true)
    return api
      .get(`/conexao/tempo_medio/${vDados.data_inicial}/${vDados.data_final}`)
      .then((res) => {
        setProcessando1(false)
        setValor1(res.data)
      })
      .catch((error) => {
        setProcessando1(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados2 = () => {
    setProcessando2(true)
    return api
      .get(
        `/conexao/total_conexoes/${vDados.data_inicial}/${vDados.data_final}`
      )
      .then((res) => {
        setProcessando2(false)
        setValor2(res.data)
      })
      .catch((error) => {
        setProcessando2(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados3 = () => {
    setProcessando3(true)
    return api
      .get(
        `/conexao/media_ultima_visita/${vDados.data_inicial}/${vDados.data_final}`
      )
      .then((res) => {
        setProcessando3(false)
        setValor3(res.data)
      })
      .catch((error) => {
        setProcessando3(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados4 = () => {
    setProcessando4(true)
    return api
      .get(`/conexao/qtd_visita/${vDados.data_inicial}/${vDados.data_final}`)
      .then((res) => {
        setProcessando4(false)
        setValor4(res.data)
      })
      .catch((error) => {
        setProcessando4(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados5 = (p) => {
    setProcessando5(true)
    return api
      .get(
        `/conexao/qtd_usuario_periodo/${vDados.data_inicial}/${vDados.data_final}/${p}`
      )
      .then((res) => {
        setProcessando5(false)
        setValor5(res.data)
      })
      .catch((error) => {
        setProcessando5(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados6 = (p) => {
    setProcessando6(true)
    return api
      .get(
        `/conexao/qtd_conexoes_autenticadas/${vDados.data_inicial}/${vDados.data_final}/${p}`
      )
      .then((res) => {
        setProcessando6(false)
        setValor6(res.data)
      })
      .catch((error) => {
        setProcessando6(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados10 = (p) => {
    setProcessando10(true)
    return api
      .get(
        `/conexao/qtd_conexoes_nao_autenticadas/${vDados.data_inicial}/${vDados.data_final}/${p}`
      )
      .then((res) => {
        setProcessando10(false)
        setValor10(res.data)
      })
      .catch((error) => {
        setProcessando10(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados7 = (p) => {
    setProcessando7(true)
    return api
      .get(
        `/conexao/qtd_genero_periodo/${vDados.data_inicial}/${vDados.data_final}/${p}`
      )
      .then((res) => {
        setProcessando7(false)
        setValor7(res.data)
      })
      .catch((error) => {
        setProcessando7(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados8 = () => {
    setProcessando8(true)
    return api
      .get(
        `/conexao/tempo_medio_dia/${vDados.data_inicial}/${vDados.data_final}`
      )
      .then((res) => {
        setProcessando8(false)
        setValor8(res.data)
      })
      .catch((error) => {
        setProcessando8(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const getDados9 = () => {
    setProcessando9(true)
    return api
      .get(`/conexao/visita_idade/${vDados.data_inicial}/${vDados.data_final}`)
      .then((res) => {
        setProcessando9(false)
        setValor9(res.data)
      })
      .catch((error) => {
        setProcessando9(false)
        console.error('Erro ao pegar dados:', error)
      })
  }

  const handleVisualizar = () => {
    setDatasOK(false)
    let vCamposOK = true
    vCamposObrigatorios.forEach((campo) => {
      if (campoInvalido(vDados, null, campo.nome, campo.tipo)) {
        vCamposOK = false
        setErros((ant) => ({
          ...ant,
          [campo.nome]: {},
        }))
      }
    })

    if (vCamposOK) {
      getDados1()
      getDados2()
      getDados3()
      getDados4()
      getDados5('day')
      getDados6('day')
      getDados7('day')
      getDados8()
      getDados9()
      getDados10('day')
      setDatasOK(true)
    } else {
      mostrarMensagem('Aten????o!', 'Selecione as duas datas.', 'warning')
    }
  }

  return (
    <Fragment>
      <Row>
        <Col md="8" className="offset-md-2 mb-2">
          <Card className="mb-1 p-2">
            <h5 className="text-center ps-2 pe-2">
              {t(
                'An??lise quantitativa dos usu??rios que visitaram seu estabelecimento nas datas informadas'
              )}
            </h5>
            <Row className="mt-2">
              <Col md="4">
                <Label className="form-label" for="data_inicial">
                  {t('Data inicial da visita')}*
                </Label>
                <Input
                  id="data_inicial"
                  name="data_inicial"
                  type="date"
                  value={vDados.data_inicial ?? ''}
                  onChange={handleChange}
                  invalid={campoInvalido(vDados, vErros, 'data_inicial')}
                />
              </Col>
              <Col md="4">
                <Label className="form-label" for="data_final">
                  {t('Data final da visita')}*
                </Label>
                <Input
                  id="data_final"
                  name="data_final"
                  type="date"
                  value={vDados.data_final ?? ''}
                  onChange={handleChange}
                  invalid={campoInvalido(vDados, vErros, 'data_final')}
                />
              </Col>
              <Col md="4" className="text-end">
                <Button.Ripple
                  color="primary"
                  onClick={handleVisualizar}
                  className="mt-2"
                >
                  <Check size={17} />
                  <span className="align-middle ms-25">{t('Visualizar')}</span>
                </Button.Ripple>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {vDatasOK ? (
        <Fragment>
          <Row className="match-height">
            <Col lg="3" sm="6">
              {vProcessando1 ? (
                <Card className="text-center p-3">
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />
                  </div>
                </Card>
              ) : (
                <StatsHorizontal
                  icon={<Clock size={21} />}
                  color="success"
                  stats={vValor1}
                  statTitle="Tempo m??dio de perman??ncia"
                />
              )}
            </Col>
            <Col lg="3" sm="6">
              {vProcessando2 ? (
                <Card className="text-center p-3">
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />
                  </div>
                </Card>
              ) : (
                <StatsHorizontal
                  icon={<Wifi size={21} />}
                  color="danger"
                  stats={vValor2}
                  statTitle="Total de conex??es"
                />
              )}
            </Col>
            <Col lg="3" sm="6">
              {vProcessando3 ? (
                <Card className="text-center p-3">
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />
                  </div>
                </Card>
              ) : (
                <StatsHorizontal
                  icon={<Calendar size={21} />}
                  color="warning"
                  stats={vValor3}
                  statTitle={t('Tempo m??dio desde a ??ltima visita')}
                />
              )}
            </Col>
            <Col lg="3" sm="6">
              {vProcessando4 ? (
                <Card className="text-center p-3">
                  <div>
                    <Spinner type="grow" size="sm" color="primary" />
                  </div>
                </Card>
              ) : (
                <StatsHorizontal
                  icon={<UserPlus size={21} />}
                  color="primary"
                  stats={vValor4}
                  statTitle={t('Visitas no per??odo')}
                />
              )}
            </Col>
          </Row>
          <Row className="match-height">
            <Col md="6">
              <CardQtdUsuario
                primary={colors.primary.main}
                titulo={'Quantidade de usu??rios'}
                dados={vValor5}
                proc={vProcessando5}
                getdados={getDados5}
              />
            </Col>
            <Col md="6">
              <CardQtdUsuario
                primary={colors.primary.main}
                titulo={'Total de conex??es'}
                dados={vValor6}
                proc={vProcessando6}
                getdados={getDados6}
              />
            </Col>
          </Row>
          <Row className="match-height">
            <Col md="6">
              <CardQtdUsuario
                primary={colors.primary.main}
                titulo={'Total de MACs n??o autenticados'}
                dados={vValor10}
                proc={vProcessando10}
                getdados={getDados10}
              />
            </Col>
            <Col md="6">
              <CardQtdUsuario
                primary={colors.primary.main}
                titulo={t('Tempo m??dio de perman??ncia por dia (em minutos)')}
                dados={vValor8}
                proc={vProcessando8}
                getdados={getDados8}
                selectOculto={true}
              />
            </Col>
          </Row>
          <Row className="match-height">
            <Col md="6">
              <CardGenero
                primary={colors.primary.main}
                titulo={t('G??neros por per??odo')}
                dados={vValor7}
                proc={vProcessando7}
                getdados={getDados7}
              />
            </Col>
            <Col md="6">
              <CardFaixaEtaria
                primary={colors.primary.main}
                titulo={t('Usu??rios por faixa et??ria')}
                dados={vValor9}
                proc={vProcessando9}
                getdados={getDados9}
              />
            </Col>
          </Row>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default ExportarEmail
