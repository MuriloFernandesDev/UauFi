import { Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const MarkerComponent = ({ lat: latProp, lng: lngProp }) => {
  const [showInfoWindow, setShowInfoWindo] = useState(false)

  function handleShowInfoWindow() {
    setShowInfoWindo(!showInfoWindow)
  }

  return (
    <Marker
      position={{ lat: latProp, lng: lngProp }}
      onClick={handleShowInfoWindow}
      title="teste"
    >
      {showInfoWindow && (
        <InfoWindow
          onCloseClick={handleShowInfoWindow}
          position={{ lat: latProp, lng: lngProp }}
        >
          <div className="d-flex flex-column">
            <h1 className="mb-0 text-black fs-4">Ame Araçatuba</h1>
            <p className="mb-0 text-black fs-6">
              R. Jose Bonifácio, 1331 - vila mendonça
            </p>
            <p className="mb-0 text-black fs-6">Araçatuba - SP</p>
            <p className="mb-0 text-black fs-6">16015-050</p>

            <a
              href="https://www.google.com/maps/place/AME+Ara%C3%A7atuba/@-21.209204,-50.440647,15z/data=!4m5!3m4!1s0x0:0xf30e9d72d08130c3!8m2!3d-21.2090938!4d-50.4278249?hl=pt-BR"
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
