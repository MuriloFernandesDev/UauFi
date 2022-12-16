// ** React Import
import { useState, useEffect } from "react"

// ** Custom Components
import Sidebar from "@components/sidebar"

// ** Third Party Components
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"

import { useDispatch, useSelector } from "react-redux"

// ** Reactstrap Imports
import { Button, Label, Form, Input } from "reactstrap"

const vListaSituacao = [
  { value: "o", label: "Online" },
  { value: "n", label: "Cadastro novo" },
]

const SidebarMaisFiltros = ({ open, toggleSidebar }) => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.usuario)

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDataInicial, setDataInicial] = useState(null)
  const [vDataFinal, setDataFinal] = useState(null)
  const [vSituacao, setSituacao] = useState(null)

  // ** Vars
  const { handleSubmit } = useForm()

  // ** Function to handle form submit
  const onSubmit = () => {
    toggleSidebar({
      situacao: vSituacao,
      datai: vDataInicial,
      dataf: vDataFinal,
    })
  }

  // ** Get data on mount
  useEffect(() => {
    setDataInicial(store.params.datai)
    setDataFinal(store.params.dataf)
    //Valor padrão da situação (Online)
    const vSituacaoArray = (store.params.situacao ?? "")
      .split(",")
      .map((item) => item)

    setSituacao(
      vListaSituacao.filter((item) => vSituacaoArray?.includes(item.value))
    )
  }, [dispatch, store.params])

  return (
    <Sidebar
      size="lg"
      open={open}
      title="Mais filtros"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="data-inicio">
            Conexão inicial
          </Label>

          <Input
            id="data-inicio"
            name="data-inicio"
            type="date"
            value={vDataInicial}
            onChange={(e) => {
              setDataInicial(e.target.value)
            }}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="data-fim">
            Conexão final
          </Label>

          <Input
            id="data-fim"
            name="data-fim"
            type="date"
            value={vDataFinal}
            onChange={(e) => {
              setDataFinal(e.target.value)
            }}
          />
        </div>
        <div className="mb-1">
          <Label for="status-select">Situação</Label>
          <Select
            isClearable={true}
            isMulti={true}
            placeholder={t("Selecione...")}
            noOptionsMessage={() => t("Vazio")}
            className="react-select"
            classNamePrefix="select"
            options={vListaSituacao}
            value={vSituacao}
            onChange={(data) => {
              setSituacao(data)
            }}
          />
        </div>
        <Button type="submit" className="me-1" color="primary">
          Aplicar
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancelar
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarMaisFiltros
