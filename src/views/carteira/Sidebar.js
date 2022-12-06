// ** React Import
import { useState, useEffect } from "react"

// ** Custom Components
import Sidebar from "@components/sidebar"

// ** Third Party Components
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"

import { useDispatch } from "react-redux"

// ** Reactstrap Imports
import { Button, Label, Form, Input } from "reactstrap"

const SidebarCreditos = ({ open, toggleSidebar }) => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vValor, setValor] = useState(null)

  // ** Vars
  const { handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = () => {
    toggleSidebar({
      valor: vValor,
    })
  }

  // ** Get data on mount
  useEffect(() => {
    //
  }, [dispatch])

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
            {t("Valor")}
          </Label>

          <Input
            id="data-inicio"
            name="data-inicio"
            value={vValor}
            onChange={(e) => {
              setValor(e.target.value)
            }}
          />
        </div>

        <Button type="submit" className="me-1" color="primary">
          Solicitar
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancelar
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarCreditos
