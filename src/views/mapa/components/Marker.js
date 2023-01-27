import { Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const MarkerComponent = ({ data, ...rest }) => {
  const {
    lat: latData,
    lng: longData,
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

  //função para alterar o state da janela de informações
  function handleShowInfoWindow() {
    setShowInfoWindo(!showInfoWindow)
  }

  return (
    <Marker
      {...rest}
      position={{ lat: latData, lng: longData }}
      onClick={handleShowInfoWindow}
      title={hotspot_nome}
    >
      {showInfoWindow && (
        //janela de informações
        <InfoWindow
          onCloseClick={handleShowInfoWindow}
          position={{ lat: latData, lng: longData }}
        >
          <div className="d-flex flex-column">
            <h1 className="mb-0 text-black fs-4">{hotspot_nome}</h1>
            <p className="mb-0 text-black fs-6">
              {endereco}, {endereco_nr} - {bairro}
            </p>
            <p className="mb-0 text-black fs-6">
              {cidade} - {uf}
            </p>
            {total_usuarios_online > 0 && (
              <p>
                Esse local possui{' '}
                {total_usuarios_online.toLocaleString('pt-BR')} usuários onlines
                no momento.
              </p>
            )}
            {total_visitas > 0 && (
              <p>
                Esse local possui {total_visitas.toLocaleString('pt-BR')} de
                visitas até agora.
              </p>
            )}

            <a
              href={`https://maps.google.com/?q=${latData},${longData}`}
              target={'_blank'}
            >
              Visualize no google maps
            </a>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )
}

export default MarkerComponent
