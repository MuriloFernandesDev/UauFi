// ** Custom Components
import Timeline from "@components/timeline"
import { Download, Trash, Upload, User, Wifi } from 'react-feather'
// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// ** Store & Actions
import { getAcessos } from '../store'
import { useDispatch } from 'react-redux'
// ** Utils
import { formatDateTime } from "@utils"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Spinner } from 'reactstrap'
import { auto } from '@popperjs/core'
import ReactPaginate from 'react-paginate'

const LinhaDoTempo = (dados) => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** States
  const [vCarregando, setCarregando] = useState(true)
  const [vDados, setDados] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const handlePagination = async (propsPage) => {
   setCarregando(true)
    getAcessos({ id: dados.id, page: propsPage.selected + 1, perPage: 25 })
      .then((response) => {
        setCarregando(false)
        const { data } = response
        setTotal(data.total)
        setDados(data.dados)
        setCurrentPage(propsPage)
      })
      .catch(() => {
        setCarregando(false)
      })
  }

  const formatarBytes = (valor) => {
    let vUnidade = ' Bytes'
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = ' KB'
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = ' MB'
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = ' GB'
    }
    if (valor > 1024) {
      valor = valor / 1024
      vUnidade = ' TB'
    }
    return `${new Intl.NumberFormat().format(valor.toFixed(1))} ${vUnidade}`
  }

  // ** Get suer on mount
  useEffect(() => {
    setCarregando(true)
    getAcessos({ id: dados.id, page: 1, perPage: 25 })
      .then((response) => {
        setCarregando(false)
        const { data } = response
        setCurrentPage(currentPage + 1)
        setTotal(data.total)
        setDados(data.dados)
      })
      .catch(() => {
        setCarregando(false)
      })
  }, [dispatch])

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Linha do tempo</CardTitle>
      </CardHeader>
      <CardBody className="pt-1" style={{ height: '367px', overflow: auto }}>
        {!vCarregando ? (
          vDados?.length > 0 ? (
            <>
              <Timeline
                data={vDados.map((d) => ({
                  title: d.hotspot.nome,
                  icon: d.id > 0 ? <Wifi size={14} /> : <User size={14} />,
                  color: d.id > 0 ? 'success' : 'primary',
                  content: `${
                    d.id === 0 ? 'Dia do cadastro - ' : ''
                  }${formatDateTime(d.entrada)}${
                    d.id > 0 ? ` - ${formatDateTime(d.saida ?? '')}` : ''
                  }`,
                  meta: (
                    <Link
                      to="/"
                      className="text-body"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Trash className="font-medium-3 text-danger cursor-pointer" />
                    </Link>
                  ),
                  customContent: (
                    <div className="d-flex justify-content-between flex-wrap borda-inferior-suave">
                      <div className="d-flex flex-column">
                        <h6 className="mb-0 text-truncate text-muted">
                          {d.dispositivo?.plataforma ?? ''}{' '}
                          {d.dispositivo?.modelo ?? ''}{' '}
                          {d.dispositivo?.marca ?? ''}
                        </h6>
                        <span className="text-truncate text-muted">
                          {d.dispositivo?.mac ?? ''}
                        </span>
                        <span className="text-truncate text-muted">
                          {d.ip ?? ''}
                        </span>
                      </div>
                      <div className="d-flex flex-column mt-sm-0 mt-50">
                        {d.bytes_upload ?? 0 > 0 ? (
                          <div>
                            <span>{formatarBytes(d.bytes_upload)}</span>
                            <Upload
                              size={14}
                              className="ms-50 mb-25 text-primary"
                            />
                          </div>
                        ) : null}
                        {d.bytes_download ?? 0 > 0 ? (
                          <div>
                            <span>{formatarBytes(d.bytes_download)}</span>
                            <Download
                              size={14}
                              className="ms-50 mb-25 text-primary"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ),
                }))}
                className="me-50"
              />

              <ReactPaginate
                nextLabel=""
                breakLabel="..."
                previousLabel=""
                pageCount={Math.ceil(total / 25) || 1}
                activeClassName="active"
                breakClassName="page-item"
                pageClassName={'page-item'}
                breakLinkClassName="page-link"
                nextLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousLinkClassName={'page-link'}
                previousClassName={'page-item prev'}
                onPageChange={(page) => handlePagination(page)}
                forcePage={
                  currentPage !== 0
                    ? currentPage <= Math.ceil(total / 25)
                      ? currentPage - 1
                      : 0
                    : 0
                }
                containerClassName={
                  'pagination react-paginate justify-content-end p-1'
                }
              />
            </>
          ) : null
        ) : (
          <div className="text-center mt-3">
            <Spinner type="grow" size="sm" color="primary" />
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default LinhaDoTempo
