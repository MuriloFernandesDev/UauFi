import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api'

const GoogleMapsComponent = ({ children, style, ...rest }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBHbJPrYK7gGDUm1CY9vV88eXDY3P7LV3Q">
      <GoogleMap mapContainerStyle={style} {...rest}>
        {/* Child components, such as markers, info windows, etc. */}
        {children}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapsComponent
