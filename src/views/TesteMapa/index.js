import {
  Autocomplete,
  HeatmapLayer,
  StandaloneSearchBox,
} from '@react-google-maps/api'
import { useCallback, useState } from 'react'
import MyMapWithAutocomplete from './AutoComplet'
import GoogleMapsComponent from './GoogleMap'
import MarkerComponent from './Marker'
import { markerData } from './markerData'

const TesteMapa = () => {
  //state para definir o mapa de calor
  const [heatMap, setHeatMap] = useState()

  //define o centro do mapa
  const center = {
    lat: -21.2115,
    lng: -50.4261,
  }

  //define o layout do gráfico
  const containerStyle = {
    width: '100%',
    height: '50vh',
  }

  //Função para chamar o mapa de calor quando a tela carregar
  const onLoad = useCallback(function callback() {
    if (window.google) {
      const heatmapData = [
        new window.google.maps.LatLng(-21.205252391739045, -50.42947820139808),
        new window.google.maps.LatLng(-21.209053252281798, -50.42964986276941),
        new window.google.maps.LatLng(-21.207732964446254, -50.42982152414074),
        new window.google.maps.LatLng(-21.20645267405869, -50.426731619456696),
        new window.google.maps.LatLng(-21.206412664805228, -50.43067983099743),
      ]
      setHeatMap(heatmapData)
    }
  }, [])

  /*
    https://react-google-maps-api-docs.netlify.app/
    Documentação do react-google-maps-api
  */

  return (
    <GoogleMapsComponent
      onLoad={onLoad}
      style={containerStyle}
      center={center}
      zoom={20}
      options={{
        streetViewControl: false,
      }}
    >
      {markerData.map((data) => {
        return <MarkerComponent data={data} />
      })}

      {heatMap && <HeatmapLayer data={heatMap} />}

      <MyMapWithAutocomplete />
    </GoogleMapsComponent>
  )
}

export default TesteMapa
