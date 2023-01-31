import { Marker, InfoWindow, MarkerProps } from '@react-google-maps/api'
import { useState } from 'react'
import { MapaProps } from '@src/types'
import { useTranslation } from 'react-i18next'

interface MarkerProp extends MarkerProps {
  data: MapaProps
}

const MarkerComponent = ({ data, ...rest }: MarkerProp) => {
  const {
    lat: vLat,
    lng: vLng,
    bairro,
    cidade,
    endereco,
    endereco_nr,
    uf,
    hotspot_nome,
    total_visitas,
    total_usuarios_online,
  } = data

  //state para definir se a janela de informações do marker aparecerá ou não
  const [showInfoWindow, setShowInfoWindo] = useState(false)

  const { t: translate } = useTranslation()

  //função para alterar o state da janela de informações
  function handleShowInfoWindow() {
    setShowInfoWindo(!showInfoWindow)
  }

  return (
    <Marker {...rest} onClick={handleShowInfoWindow} title={hotspot_nome}>
      {showInfoWindow && (
        //janela de informações
        <InfoWindow
          onCloseClick={handleShowInfoWindow}
          position={{ lat: vLat, lng: vLng }}
        >
          <div className="d-flex flex-column">
            <h1 className="mb-0 text-black fs-4">{hotspot_nome}</h1>
            <p className="mb-0 text-black fs-6">
              {endereco}, {endereco_nr} - {bairro}
            </p>
            <p className="mb-0 text-black fs-6">
              {cidade} - {uf}
            </p>
            {total_usuarios_online && total_usuarios_online > 0 && (
              <p>
                Esse local possui{' '}
                {total_usuarios_online.toLocaleString('pt-BR')} usuários onlines
                no momento.
              </p>
            )}
            {total_visitas && total_visitas > 0 && (
              <p>
                {translate('Esse local possui')}{' '}
                {total_visitas.toLocaleString('pt-BR')}{' '}
                {translate('de visitas até agora.')}
              </p>
            )}

            <a
              href={`https://maps.google.com/?q=${vLat},${vLng}`}
              target={'_blank'}
            >
              {translate('Visualize no google maps')}
            </a>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )
}

export default MarkerComponent
