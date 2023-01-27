import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const GoogleMapsComponent = ({ children, style, ...rest }) => {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBHbJPrYK7gGDUm1CY9vV88eXDY3P7LV3Q"
      libraries={['places', 'visualization']}
    >
      <GoogleMap mapContainerStyle={style} {...rest}>
        {children}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapsComponent
