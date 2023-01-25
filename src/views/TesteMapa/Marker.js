import { Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const MarkerComponent = ({ data, ...rest }) => {
  const { lat: latData, lng: longData, title, address, city, state, cep } = data

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
      title="teste"
      // Código abaixo para alterar aparencia do Marker
      // onLoad={(marker) => {
      //   const customIcon = (opts) =>
      //     Object.assign(
      //       {
      //         path: 'M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z',
      //         fillColor: '#34495e',
      //         fillOpacity: 1,
      //         strokeColor: '#000',
      //         strokeWeight: 1,
      //         scale: 1,
      //       },
      //       opts
      //     )

      //   marker.setIcon(
      //     customIcon({
      //       fillColor: 'green',
      //       strokeColor: 'white',
      //     })
      //   )
      // }}
    >
      {showInfoWindow && (
        //janela de informações
        <InfoWindow
          onCloseClick={handleShowInfoWindow}
          position={{ lat: latData, lng: longData }}
        >
          <div className="d-flex flex-column">
            <h1 className="mb-0 text-black fs-4">{title}</h1>
            <p className="mb-0 text-black fs-6">{address} </p>
            <p className="mb-0 text-black fs-6">
              {city} - {state}
            </p>
            <p className="mb-0 text-black fs-6">{cep}</p>

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
