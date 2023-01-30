// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap'

// ** Icons Imports
import { Clock, RefreshCw } from 'react-feather'

// ** Charts
import CampanhaDados from './CampanhaDados'

import { useTranslation } from 'react-i18next'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'

// ** API
import api from '@src/services/api'

// ** Third Party Components
import 'chart.js/auto'

const RelatorioCampanha = () => {
  const vDefault = [{ nome: '', valor: 0, qtd: 0, percentual: 0 }]
  const vParametrosGet = { sortColumn: 'qtd', sort: 'desc' }
  // ** States
  const [vCampanhaAgendada, setCampanhaAgendada] = useState(vDefault)
  const [vCarregando1, setCarregando1] = useState(true)
  const [vCarregando2, setCarregando2] = useState(true)
  const [vCampanhaRecorrente, setCampanhaRecorrente] = useState(vDefault)
  const [active, toggleTab] = useState('1')
  const { t } = useTranslation()

  const getCampanhaAgendada = () => {
    setCarregando1(true)
    return api
      .get('/campanha_agendada/lista', { params: vParametrosGet })
      .then((res) => {
        setCampanhaAgendada(res.data)
        setCarregando1(false)
      })
      .catch(() => {
        setCarregando1(false)
      })
  }

  const getCampanhaRecorrente = () => {
    setCarregando2(true)
    return api
      .get('/campanha_recorrente/lista', { params: vParametrosGet })
      .then((res) => {
        setCampanhaRecorrente(res.data)
        setCarregando2(false)
      })
      .catch(() => {
        setCarregando2(false)
      })
  }

  useEffect(() => {
    // ** Requisitar listas

    getCampanhaAgendada()
    getCampanhaRecorrente()
  }, [])

  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Clock className="font-medium-3 me-50" />
            <span className="fw-bold">{t('Agendadas')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <RefreshCw className="font-medium-3 me-50" />
            <span className="fw-bold">{t('Recorrentes')}</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          {vCarregando1 ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <CampanhaDados valores={vCampanhaAgendada} tipo={'agendada'} />
          )}
        </TabPane>
        <TabPane tabId="2">
          {vCarregando2 ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <CampanhaDados valores={vCampanhaRecorrente} tipo={'recorrente'} />
          )}
        </TabPane>
      </TabContent>
    </Fragment>
  )
}

export default RelatorioCampanha
