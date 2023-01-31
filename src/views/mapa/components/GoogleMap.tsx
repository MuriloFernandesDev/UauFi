import { GoogleMap, LoadScript, GoogleMapProps } from '@react-google-maps/api'
import { ReactElement } from 'react'

interface MapsProps extends GoogleMapProps {
  children: ReactElement
}

const GoogleMapsComponent = ({ children, ...rest }: MapsProps) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS ?? ''
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places', 'visualization']}
    >
      <GoogleMap {...rest}>{children}</GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapsComponent
