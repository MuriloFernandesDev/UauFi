// ** React
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

// ** Reactstrap
import { Card, CardBody, Button } from 'reactstrap'

const EditActions = ({ setSalvarDados }) => {
  const navigate = useNavigate()
  return (
    <Fragment>
      <Card>
        <CardBody className='p-0'>
          <div className='d-flex justify-content-between flex-row m-2'>
            <div>
              <Button color='primary' onClick={setSalvarDados}>
                Salvar
              </Button>
            </div>
            <div>
              <Button color='primary' outline onClick={() => navigate(-1)}>
                Cancelar e voltar
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>      
    </Fragment>
  )
}

export default EditActions
