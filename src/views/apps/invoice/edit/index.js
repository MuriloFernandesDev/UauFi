// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** Third Party Components
import api from '../../../../services/api'

// ** Reactstrap Imports
import { Alert, Row, Col } from 'reactstrap'

// ** Invoice Edit Components
import EditCard from './EditCard'

const InvoiceEdit = () => {
  // ** Hooks
  const { id } = useParams()

  const navigate = useNavigate()

  // ** States
  const [data, setData] = useState(null)
  const [vCarregando, setCarregando] = useState(true)

  // ** Função para salvar dados
  const handleSalvar = (pDados) => {

    if (pDados.id > 0) {
      api.put('/cliente', pDados).then(response => {
        if (response.status === 200) {
          navigate(-1)
        }
        console.log(response)
      })
    } else {
      api.post('/cliente', pDados).then(response => {
        if (response.status === 200) {
          navigate(-1)
        }
        console.log(response)
      })
    }
  }

  // ** Get invoice on mount based on id
  useEffect(() => {
    if (id !== '-1') {
      api.get(`/cliente/${id}`).then(response => {
        setData(response.data[0])
        setCarregando(false)
      })
    } else {
      setCarregando(false)
    }
  }, [])

  return (vCarregando) ? (
    <span>Carregando</span>
  ) : (
    <div>
      <Row>
        <Col sm={12}>
          <EditCard data={data} setSalvarDados={handleSalvar} />
        </Col>
      </Row>
    </div>
  )
}

export default InvoiceEdit
