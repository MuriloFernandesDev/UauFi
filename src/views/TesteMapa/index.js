import React from 'react'
import GoogleMapsComponent from './GoogleMap'
import MarkerComponent from './Marker'

const TesteMapa = () => {
  const center = {
    lat: -21.2115,
    lng: -50.4261,
  }

  const containerStyle = {
    width: '100%',
    height: '100vh',
  }

  /*
    https://react-google-maps-api-docs.netlify.app/#loadscript
    Documentação do react-google-maps-api
  */

  return (
    <GoogleMapsComponent style={containerStyle} center={center} zoom={13}>
      <MarkerComponent lat={-21.203076625122936} lng={-50.443338372005165} />
      <MarkerComponent lat={-21.201718406167547} lng={-50.43889929723379} />
    </GoogleMapsComponent>
  )
}

export default TesteMapa
