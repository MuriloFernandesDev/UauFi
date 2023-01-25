import { HeatmapLayer, Marker, MarkerClusterer } from '@react-google-maps/api'
import { useCallback, useState } from 'react'
import AutoComplete from './AutoComplete'
import GoogleMapsComponent from './GoogleMap'
import MarkerComponent from './Marker'
import { markerData } from './markerData'

const TesteMapa = () => {
  //state para definir o mapa de calor
  const [heatMap, setHeatMap] = useState()
  //state enviado ao autoComplete para definir o centro do mapa
  const [vLatLng, setVLatLng] = useState({ lat: -21.2115, lng: -50.421 })

  //define o centro do mapak
  const center = vLatLng

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
      ]
      setHeatMap(heatmapData)
    }
  }, [])

  //agrupador dos marcadores para nao ficar lento
  const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }

  //cria a chave para o marker
  function createKey(location) {
    return location.lat + location.lng
  }

  /*
    https://react-google-maps-api-docs.netlify.app/
    Documentação do react-google-maps-api
  */

  return (
    <GoogleMapsComponent
      onLoad={onLoad}
      style={containerStyle}
      center={center}
      zoom={13}
      options={{
        streetViewControl: false,
      }}
    >
      <MarkerClusterer options={options}>
        {(clusterer) =>
          markerData.map((location) => (
            <MarkerComponent
              key={createKey(location)}
              data={location}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClusterer>

      {heatMap && <HeatmapLayer data={heatMap} />}

      <AutoComplete setVLatLng={setVLatLng} />
    </GoogleMapsComponent>
  )
}

export default TesteMapa
