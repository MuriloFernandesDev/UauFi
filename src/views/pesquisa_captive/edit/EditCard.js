// ** React
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classnames from 'classnames'

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, Badge } from 'reactstrap'

// ** Icons
import { CornerUpLeft, Check, Move, Trash, Plus } from 'react-feather'

// ** Utils
import { campoInvalido, mostrarMensagem } from '@utils'

// ** Terceiros
import Select from 'react-select'
import { useTranslation } from 'react-i18next'
import { ReactSortable } from 'react-sortablejs'
import { getFiltros, getHotspot } from '../store'

const vListaFrequencia = [
  { value: 1, label: 'Sempre' },
  { value: 2, label: 'Uma vez por dia para cada usuário' },
  { value: 3, label: 'Uma vez para cada usuário' },
]

const vListaDiaSemana = [
  { value: 1, label: 'Dom' },
  { value: 2, label: 'Seg' },
  { value: 3, label: 'Ter' },
  { value: 4, label: 'Qua' },
  { value: 5, label: 'Qui' },
  { value: 6, label: 'Sex' },
  { value: 7, label: 'Sab' },
]

const PlanoEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vDiaSemana, setDiaSemana] = useState(
    vListaDiaSemana
      .filter((item) =>
        [
          data.mostra_dom ? 1 : 0,
          data.mostra_seg ? 2 : 0,
          data.mostra_ter ? 3 : 0,
          data.mostra_qua ? 4 : 0,
          data.mostra_qui ? 5 : 0,
          data.mostra_sex ? 6 : 0,
          data.mostra_sab ? 7 : 0,
        ].includes(item.value)
      )
      .map((ret) => ({
        label: ret.label,
        value: ret.value,
      }))
  )
  const [vListaFiltros, setListaFiltros] = useState(null)
  const [vFiltro, setFiltro] = useState(null)
  const [vFrequencia, setFrequencia] = useState(
    data?.frequencia
      ? vListaFrequencia.filter((item) => item.value === data.frequencia)[0]
      : null
  )
  const [vErros, setErros] = useState({})
  const vCamposObrigatorios = [{ nome: 'nome' }, { nome: 'extra_hotspot_id' }]

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // ** Organização da informação
  const handleChangeItem = (v, i, n) => {
    const { itens: vItem } = vDados
    vItem[i] = {
      ...vItem[i],
      [n]: v,
    }
    setData((prevState) => ({
      ...prevState,
      itens: vItem,
    }))
  }

  const handleFiltros = () => {
    getFiltros().then((res) => {
      const FiltrosVar = res
      setListaFiltros(FiltrosVar)

      if (vDados?.id !== undefined) {
        FiltrosVar?.map((res) => {
          if (res.value === vDados.filtro_id) {
            setFiltro({ value: res.value, label: res.label })
          }
        })
      }
    })
  }

  const handleHotspots = () => {
    getHotspot().then((res) => {
      const hotspotsVar = res
      setListaHotspots(hotspotsVar)

      //Selecionar o item no componente
      if (data?.extra_hotspot_id) {
        const vHotspotArray = data?.extra_hotspot_id
          ?.split(',')
          .map((item) => parseInt(item))
        setHotspot(
          hotspotsVar
            ?.filter((item) => vHotspotArray?.includes(item.value))
            .map((ret) => ({
              label: ret.label,
              value: ret.value,
            }))
        )
      }
    })
  }

  const handleRemoveItem = (index) => {
    setData((prevState) => {
      return {
        ...prevState,
        itens: [
          ...prevState.itens.slice(0, index),
          ...prevState.itens.slice(index + 1),
        ],
      }
    })
  }

  const handleAddItem = () => {
    setData((prevState) => {
      return {
        ...prevState,
        itens: [
          ...prevState.itens,
          {
            id: 0,
          },
        ],
      }
    })
  }

  const handleOrdenarItem = (v) => {
    setData((prevState) => {
      return {
        ...prevState,
        itens: v,
      }
    })
  }

  const setDados = () => {
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
      vDados.mostra_dom = vDiaSemana.some((item) => item.value === 1)
      vDados.mostra_seg = vDiaSemana.some((item) => item.value === 2)
      vDados.mostra_ter = vDiaSemana.some((item) => item.value === 3)
      vDados.mostra_qua = vDiaSemana.some((item) => item.value === 4)
      vDados.mostra_qui = vDiaSemana.some((item) => item.value === 5)
      vDados.mostra_sex = vDiaSemana.some((item) => item.value === 6)
      vDados.mostra_sab = vDiaSemana.some((item) => item.value === 7)
      setSalvarDados(vDados)
    } else {
      mostrarMensagem(
        'Atenção!',
        'Preencha todos os campos obrigatórios.',
        'warning'
      )
    }
  }

  const renderItens = () => {
    return (
      <div className="todo-app-list list-group mb-2">
        {vDados?.itens?.length ? (
          <ReactSortable
            tag="ul"
            list={vDados?.itens}
            handle=".drag-icon"
            className="todo-list media-list"
            setList={(newState) => handleOrdenarItem(newState)}
          >
            {vDados?.itens.map((item, index) => {
              return (
                <li key={`${item.id}-${index}`} className="todo-item">
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area w-100">
                      {vDados?.id > 0 ? null : <Move className="drag-icon" />}
                      <div className="w-100 pe-2">
                        {vDados?.id > 0 ? (
                          <span className="text-body">
                            {item.texto ?? ''}{' '}
                            {item.texto_livre ? (
                              <Badge color="secondary">
                                {t('Opção texto livre')}
                              </Badge>
                            ) : null}
                          </span>
                        ) : (
                          <Row>
                            <Col md="8">
                              <Input
                                value={item.texto ?? ''}
                                placeholder="Digite a opção de resposta aqui..."
                                onChange={(e) => {
                                  handleChangeItem(
                                    e?.target.value,
                                    index,
                                    'texto'
                                  )
                                }}
                              />
                            </Col>
                            <Col md="4" className="pt-50">
                              <div className="form-check form-switch">
                                <Input
                                  type="switch"
                                  id={`texto_livre${item.id}-${index}`}
                                  checked={item.texto_livre ?? false}
                                  onChange={(e) => {
                                    handleChangeItem(
                                      e?.target.checked,
                                      index,
                                      'texto_livre'
                                    )
                                  }}
                                />
                                <Label
                                  for={`texto_livre${item.id}-${index}`}
                                  className="form-check-label mt-25"
                                >
                                  {t('Opção texto livre')}
                                </Label>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </div>
                    {vDados?.id > 0 ? null : (
                      <div className="todo-item-action">
                        <Link
                          to="/"
                          className="text-body"
                          onClick={(e) => {
                            e.preventDefault()
                            handleRemoveItem(index)
                          }}
                        >
                          <Trash className="font-medium-3 text-danger cursor-pointer" />
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ReactSortable>
        ) : (
          <div className="no-results show"></div>
        )}
      </div>
    )
  }

  useEffect(() => {
    // ** Requisitar listas
    handleFiltros()
    handleHotspots()
  }, [])

  return (
    <Row>
      <Col sm="12">
        <Fragment>
          <Card className="mb-1">
            <div className="d-flex justify-content-between flex-row m-1">
              <div>
                <Button.Ripple
                  color="primary"
                  onClick={() => navigate('/pesquisa_captive')}
                >
                  <CornerUpLeft size={17} />
                </Button.Ripple>
              </div>
              <div>
                <Button.Ripple color="success" onClick={setDados}>
                  <Check size={17} />
                  <span className="align-middle ms-25">{t('Salvar')}</span>
                </Button.Ripple>
              </div>
            </div>
          </Card>
        </Fragment>
      </Col>
      <Col sm="12">
        <Card className="p-2 pb-0">
          <Fragment>
            <Card className="mb-0">
              <Row>
                <Col md="12" className="mb-2">
                  <Label className="form-label" for="nome">
                    Digite a pergunta*
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    disabled={vDados?.id > 0}
                    value={vDados?.nome ?? ''}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, vErros, 'nome')}
                  />
                </Col>

                <Col md="8" className="mb-2">
                  <Label className="form-label" for="extra_hotspot_id">
                    Selecione o(s) Hotspot(s)*
                  </Label>
                  <Select
                    isClearable
                    id="extra_hotspot_id"
                    noOptionsMessage={() => t('Vazio')}
                    isMulti
                    placeholder={''}
                    className={classnames('react-select', {
                      'is-invalid': campoInvalido(
                        vDados,
                        vErros,
                        'extra_hotspot_id'
                      ),
                    })}
                    classNamePrefix="select"
                    value={vHotspot}
                    onChange={(e) => {
                      setHotspot(e)
                      handleChange({
                        target: {
                          name: 'extra_hotspot_id',
                          value: e
                            ?.map((item) => item.value.toString())
                            .toString(),
                        },
                      })
                    }}
                    options={vListaHotspots}
                  />
                </Col>

                <Col md="4" className="mb-2">
                  <Label className="form-label" for="filtro_id">
                    Filtro
                  </Label>
                  <Select
                    isClearable
                    id="filtro_id"
                    noOptionsMessage={() => t('Vazio')}
                    placeholder={t('Selecione...')}
                    value={vFiltro}
                    options={vListaFiltros}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(e) => {
                      setFiltro(e)
                      handleChange({
                        target: {
                          name: 'filtro_id',
                          value: Number(e?.value),
                        },
                      })
                    }}
                  />
                </Col>
                <Col md="8" className="mb-2">
                  <Label className="form-label" for="dia_semana">
                    {t('Dia da semana')}
                  </Label>
                  <Select
                    isClearable
                    id="dia_semana"
                    isMulti={true}
                    noOptionsMessage={() => t('Vazio')}
                    value={vDiaSemana}
                    placeholder={'Todos os dias'}
                    className="react-select"
                    classNamePrefix="select"
                    options={vListaDiaSemana}
                    onChange={(e) => setDiaSemana(e)}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <Label className="form-label" for="frequencia">
                    {t('Frequência')}
                  </Label>
                  <Select
                    isClearable
                    id="frequencia"
                    noOptionsMessage={() => t('Vazio')}
                    placeholder={t('Selecione...')}
                    className="react-select"
                    classNamePrefix="select"
                    value={vFrequencia}
                    options={vListaFrequencia}
                    onChange={(e) => {
                      setFrequencia(e)
                      handleChange({
                        target: {
                          name: 'frequencia',
                          value: e?.value,
                        },
                      })
                    }}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <Label className="form-label" for="data_inicial">
                    Data Inicial
                  </Label>
                  <Input
                    id="data_inicial"
                    name="data_inicial"
                    type="date"
                    value={vDados?.data_inicial ?? ''}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="4" className="mb-2">
                  <Label className="form-label" for="data_final">
                    {t('Data Final')}
                  </Label>
                  <Input
                    id="data_final"
                    name="data_final"
                    type="date"
                    value={vDados?.data_final ?? ''}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="2" className="mb-2">
                  <Label className="form-label" for="hora_inicial">
                    Horário Inicial
                  </Label>
                  <Input
                    id="hora_inicial"
                    name="hora_inicial"
                    type="time"
                    value={vDados?.hora_inicial ?? ''}
                    onChange={handleChange}
                  />
                </Col>
                <Col md="2" className="mb-2">
                  <Label className="form-label" for="hora_final">
                    {t('Horário Final')}
                  </Label>
                  <Input
                    id="hora_final"
                    name="hora_final"
                    type="time"
                    value={vDados?.hora_final ?? ''}
                    onChange={handleChange}
                  />
                </Col>

                <Col md="12">
                  <div className="divider divider-dark">
                    <div className="divider-text text-dark">
                      {t('Opções de resposta')}
                    </div>
                  </div>
                </Col>
                <Col md="12" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="multipla_escolha"
                      checked={vDados?.multipla_escolha ?? false}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: 'multipla_escolha',
                            value: e.target.checked,
                          },
                        })
                      }}
                    />
                    <Label
                      for="multipla_escolha"
                      className="form-check-label mt-25"
                    >
                      {t('Permitir que o usuário selecione mais de uma opção')}
                    </Label>
                  </div>
                </Col>
                {vDados?.id > 0 ? null : (
                  <Col md="12" className="mb-2">
                    <Link
                      to="/"
                      className="text-primary d-flex justify-content-left align-items-center"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddItem()
                      }}
                    >
                      <Plus className="font-medium-3 cursor-pointer" />
                      <span className="ms-25">
                        {t('Adicionar opção de resposta')}
                      </span>
                    </Link>
                  </Col>
                )}
                <Col md="12">{renderItens()}</Col>
                <Col md="12" className="mb-2">
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      id="ativo"
                      checked={vDados?.ativo ?? false}
                      onChange={(e) => {
                        handleChange({
                          target: {
                            name: 'ativo',
                            value: e.target.checked,
                          },
                        })
                      }}
                    />
                    <Label for="ativo" className="form-check-label mt-25">
                      {vDados?.ativo
                        ? t('Pesquisa ativa')
                        : t('Pesquisa desativada')}
                    </Label>
                  </div>
                </Col>
              </Row>
            </Card>
          </Fragment>
        </Card>
      </Col>
    </Row>
  )
}

export default PlanoEditCard
