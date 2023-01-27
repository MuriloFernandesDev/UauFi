import { GoogleMap, LoadScript, GoogleMapProps } from '@react-google-maps/api'
import { CSSProperties, ReactElement } from 'react'

interface MapsProps extends GoogleMapProps{
  children: ReactElement
}

const GoogleMapsComponent = ({ children, ...rest }: MapsProps) => {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBHbJPrYK7gGDUm1CY9vV88eXDY3P7LV3Q"
      libraries={['places', 'visualization']}
    >
      <GoogleMap {...rest}>
        {children}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapsComponent
