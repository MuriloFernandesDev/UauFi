import { useEffect, useState } from 'react'

// ** API
import api from '@src/services/api'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Spinner,
  CardText,
} from 'reactstrap'

import { useTranslation } from 'react-i18next'

const Plataforma = () => {
  // ** States
  const [vDados, setDados] = useState(null)
  const [vProcessando, setProcessando] = useState(true)
  const [vOptions, setOptions] = useState(null)
  const { t } = useTranslation()

  const getDados = () => {
    setProcessando(true)
    //return
    return api
      .get('/conexao/perc_plataforma')
      .then((res) => {
        setProcessando(false)
        setDados(res.data)
        setOptions({
          legend: {
            show: false,
          },
          labels: res.data?.valores?.map(({ label }) => label),

          dataLabels: {
            enabled: true,
            formatter(val) {
              return `${parseInt(val)}%`
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '2rem',
                    fontFamily: 'Montserrat',
                  },
                  value: {
                    fontSize: '1rem',
                    fontFamily: 'Montserrat',
                    formatter(val) {
                      return `${parseInt(val)}%`
                    },
                  },
                  total: {
                    show: true,
                    fontSize: '1.5rem',
                    label: res.data?.maior_label ?? '',
                    formatter() {
                      return `${res.data?.maior_value}%`
                    },
                  },
                },
              },
            },
          },
        })
      })
      .catch(() => {
        setDados(null)
        setProcessando(false)
      })
  }

  useEffect(() => {
    // ** Requisitar lista
    getDados()
  }, [])

  return (
    <Card className="earnings-card">
      <CardBody>
        <Row>
          <Col xs="6">
            <h5 className="mb-3 text-nowrap">{t('Plataformas')}</h5>
            {!vProcessando ? (
              <div>
                <div className="font-small-2">{t('Total')}</div>
                <h5 className="mb-2">{vDados?.total ?? '0'}</h5>{' '}
                <CardText className="text-muted font-small-2">
                  <span>{t('Dispositivos')}</span>
                </CardText>
              </div>
            ) : (
              <div className="mb-4">&nbsp;</div>
            )}
          </Col>
          <Col
            xs="6"
            className="d-flex justify-content-center text-center align-items-center"
          >
            {!vProcessando ? (
              vDados?.valores ? (
                <Chart
                  options={vOptions}
                  series={vDados?.valores?.map(({ value }) => value)}
                  type="donut"
                  height={165}
                />
              ) : null
            ) : (
              <Spinner type="grow" size="md" color="primary" />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Plataforma
