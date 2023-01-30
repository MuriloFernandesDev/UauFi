// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, Form, Input } from 'reactstrap'

// ** Third Party Components
import Cleave from 'cleave.js/react'

const SidebarCreditos = ({ open, toggleSidebar }) => {
  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vValor, setValor] = useState(null)

  // ** Vars
  const { handleSubmit } = useForm()

  const optMoeda = { numeral: true, numeralDecimalMark: ',', delimiter: '.' }

  // ** Function to handle form submit
  const onSubmit = () => {
    toggleSidebar(vValor)
  }

  return (
    <Sidebar
      size="lg"
      open={open}
      title="Solicitar mais crédito"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="data-inicio">
            {t('Valor')}
          </Label>
          <Cleave
            className="form-control w-100"
            value={vValor ?? ''}
            onChange={(e) => {
              setValor(e.target.value)
            }}
            options={optMoeda}
          />
        </div>

        <Button type="submit" className="me-1" color="primary">
          {t('Solicitar')}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          {t('Cancelar')}
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarCreditos
