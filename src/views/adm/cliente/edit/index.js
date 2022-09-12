// ** React
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ** API
import api from '@src/services/api'

// ** Reactstrap 
import { Row, Col, Spinner } from 'reactstrap'

// ** Editar Cliente
import EditCard from './EditCard'

const ClienteEdit = () => {
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
        //console.log(response)
      })
    } else {
      api.post('/cliente', pDados).then(response => {
        if (response.status === 200) {
          navigate(-1)
        }
        //console.log(response)
      })
    }
  }

  // ** Get Cliente on mount based on id
  useEffect(() => {
      api.get(`/cliente/${id}`).then(response => {
        setData(response.data[0])
        setCarregando(false)
      })    
  }, [])

  return (vCarregando) ? (
    <div className='text-center'>
      <Spinner color='primary' />
    </div>    
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

export default ClienteEdit
