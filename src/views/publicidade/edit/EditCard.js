// ** React
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classnames from 'classnames'

// ** Reactstrap
import { Row, Col, Card, Input, Button, Label, CardImg } from 'reactstrap'

// ** Icons
import { CornerUpLeft, Check, Trash } from 'react-feather'

// ** Utils
import { campoInvalido, mostrarMensagem } from '@utils'

// ** Terceiros
import Select from 'react-select'
import { useTranslation } from 'react-i18next'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getFiltros, getHotspot } from '../store'

const vListaTipo = [
  { value: 1, label: 'Imagem' },
  { value: 2, label: 'Vídeo' },
]

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

const PublicidadeEditCard = ({ data, setSalvarDados }) => {
  const navigate = useNavigate()

  // ** Hooks
  const { t } = useTranslation()

  // ** States
  const [vDados, setData] = useState(data)
  const [vListaHotspots, setListaHotspots] = useState(null)
  const [vHotspot, setHotspot] = useState(null)
  const [vTipo, setTipo] = useState(
    data?.tipo ? vListaTipo.filter((item) => item.value === data.tipo)[0] : null
  )
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
  const vCamposObrigatorios = [
    { nome: 'nome' },
    { nome: 'extra_hotspot_id' },
    { nome: 'data_inicial' },
    { nome: 'data_final' },
    { nome: 'duracao', tipo: 'int' },
  ]

  // ** Organização da informação
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
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

  const handleChangeItem = (e, i) => {
    const reader = new FileReader(),
      files = e.target.files,
      vI = i
    reader.onload = function () {
      const { propaganda_item: vItem } = vDados
      vItem[vI] = {
        ...vItem[vI],
        item_path: reader.result,
      }
      setData((prevState) => ({
        ...prevState,
        propaganda_item: vItem,
      }))
    }
    reader.readAsDataURL(files[0])
  }

  const handleRemoveItem = (index) => {
    setData((prevState) => {
      return {
        ...prevState,
        propaganda_item: [
          ...prevState.propaganda_item.slice(0, index),
          ...prevState.propaganda_item.slice(index + 1),
        ],
      }
    })
  }

  const handleAddItem = (e) => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setData((prevState) => {
        return {
          ...prevState,
          propaganda_item: [
            ...prevState.propaganda_item,
            {
              id: 0,
              item_path: reader.result,
              type: vTipo.label,
            },
          ],
        }
      })
    }
    reader.readAsDataURL(files[0])
  }

  const renderItens = () => {
    return vDados?.propaganda_item.map((item, index) => {
      const typeVideo = item.item_path.split(';', 2)[0].split('/', 2)[1]
      console.log(typeVideo)
      return (
        <Col key={`${item.id}-${index}`} className="mb-2" md="3">
          <div className="border rounded">
            {item.type === 'Vídeo' ? (
              <video controls className="img-fluid">
                <source
                  type={`video/${typeVideo}`}
                  src={item?.item_path?.length > 0 && item?.item_path}
                />
              </video>
            ) : (
              <CardImg
                className="img-fluid"
                src={
                  item?.item_path?.length > 0 ? item?.item_path : defaultImagem
                }
                alt="Mídia"
                top
              />
            )}
            <div className="m-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button
                    tag={Label}
                    size="sm"
                    className="m-1"
                    color="secondary"
                    outline
                  >
                    Trocar mídia
                    <Input
                      type="file"
                      name="item_path"
                      indice={index}
                      onChange={(e) => {
                        handleChangeItem(e, index)
                      }}
                      hidden
                      accept={
                        item.type === 'Vídeo'
                          ? '.mp4, .m4v, .mov'
                          : '.jpg, .jpeg, .png, .gif, .webp'
                      }
                    />
                  </Button>
                </div>
                <Link
                  to="/"
                  className="text-body m-1"
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveItem(index)
                  }}
                >
                  <Trash className="font-medium-3 text-danger cursor-pointer" />
                </Link>
              </div>
            </div>
          </div>
        </Col>
      )
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

  // ** Get filter on mount based on id

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
                  onClick={() => navigate('/publicidade')}
                >
                  <CornerUpLeft size={17} />
                </Button.Ripple>
              </div>
              <div>
                <Button.Ripple color="success" onClick={setDados}>
                  <Check size={17} />
                  <span className="align-middle ms-25">Salvar</span>
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
                    Nome da publicidade*
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
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
                    Dia da semana
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
                    Frequência
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
                <Col md="3" className="mb-2">
                  <Label className="form-label" for="data_inicial">
                    Data Inicial*
                  </Label>
                  <Input
                    id="data_inicial"
                    name="data_inicial"
                    type="date"
                    value={vDados?.data_inicial ?? ''}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, vErros, 'data_inicial')}
                  />
                </Col>
                <Col md="3" className="mb-2">
                  <Label className="form-label" for="data_final">
                    Data Final*
                  </Label>
                  <Input
                    id="data_final"
                    name="data_final"
                    type="date"
                    value={vDados?.data_final ?? ''}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, vErros, 'data_final')}
                  />
                </Col>

                <Col md="3" className="mb-2">
                  <Label className="form-label" for="duracao">
                    Tempo de exibição (segundos)*
                  </Label>
                  <Input
                    id="duracao"
                    name="duracao"
                    type="number"
                    placeholder="Segundos"
                    value={vDados?.duracao ?? ''}
                    onChange={handleChange}
                    invalid={campoInvalido(vDados, vErros, 'duracao', 'int')}
                  />
                </Col>

                <Col md="3" className="mb-2">
                  <Label className="form-label" for="tipo">
                    Tipo de mídia
                  </Label>
                  <Select
                    id="tipo"
                    noOptionsMessage={() => t('Vazio')}
                    placeholder={t('Selecione...')}
                    className="react-select"
                    classNamePrefix="select"
                    value={vTipo}
                    options={vListaTipo}
                    onChange={(e) => {
                      setTipo(e)
                      handleChange({
                        target: {
                          name: 'tipo',
                          value: e?.value,
                        },
                      })
                    }}
                  />
                </Col>
                {renderItens()}
                {(vDados?.tipo === 2 &&
                  vDados?.propaganda_item?.length === 0) ||
                vDados?.tipo === 1 ? (
                  <Col className="mb-2" md="3">
                    <div className="border rounded p-2 text-center">
                      <div className="d-flex flex-column">
                        <div>
                          <div className="mb-1">
                            <small className="text-muted">
                              Resolução recomendada: 800x500px.
                              <br />
                              Tamanho máximo: 5mb.
                            </small>
                          </div>
                          <div className="d-inline-block">
                            <div className="mb-0">
                              <Button
                                tag={Label}
                                className="me-75"
                                size="sm"
                                color="secondary"
                                outline
                              >
                                Adicionar mídia
                                <Input
                                  type="file"
                                  onChange={handleAddItem}
                                  hidden
                                  accept={
                                    vTipo.label === 'Vídeo'
                                      ? '.mp4, .m4v, .mov'
                                      : '.jpg, .jpeg, .png, .gif, .webp'
                                  }
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ) : null}

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
                        ? 'Publicidade ativa'
                        : 'Publicidade desativada'}
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

export default PublicidadeEditCard
