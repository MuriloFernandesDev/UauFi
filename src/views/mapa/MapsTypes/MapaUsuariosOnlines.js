import { HeatmapLayer, MarkerClusterer } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'
import AutoComplete from '../components/AutoComplete'
import GoogleMapsComponent from '../components/GoogleMap'
// ** API
import api from '@src/services/api'
import { Spinner } from 'reactstrap'
import MarkerComponent from '../components/Marker'

const MapaUsuariosOnlines = ({
  containerStyle,
  center,
  zoom,
  options,
  gradientArray,
  setVLatLng,
  setZoom,
}) => {
  //state para definir os dados do mapa
  const [mapData, setMapData] = useState([])
  //state para definir os dados dos marcadores
  const [markerData, setMarkerData] = useState([])
  //state para definir os dados do mapa de calor
  const [heatMap, setHeatMap] = useState([])

  //state para definir carregamento dos dados
  const [vProcessando, setProcessando] = useState(true)

  console.log(mapData)
  //função para buscar mapa de calor quando o mapData estiver carregado
  const onLoad = useCallback(
    function callback() {
      if (window.google && markerData.length > 0) {
        const heatmapData = []
        markerData.map((res) => {
          // for (let i = 0; i < res.total_visitas; i++) {
          heatmapData.push({
            location: new window.google.maps.LatLng(res.lat, res.lng),
            weight: 1,
            radius: res.total_visitas,
          })
          // }
        })
        setHeatMap(heatmapData)
      }
    },
    [mapData]
  )

  //função para buscar os dados do mapa
  const getDados = () => {
    // setProcessando(true)
    return api
      .get(`/conexao/mapa_google_usuario_online`)
      .then((res) => {
        const { data } = res

        setMarkerData(data)
        setMapData(data)
        setProcessando(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getDados()
  }, [])

  return (
    <>
      {vProcessando ? (
        <div className="d-flex justify-content-center text-center align-items-center h-100">
          <Spinner type="grow" size="md" color="primary" />
        </div>
      ) : (
        <GoogleMapsComponent
          onLoad={onLoad}
          style={containerStyle}
          center={center}
          zoom={zoom}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: 'roadmap',
            //opções acimas desativam os controles de mapa que são cobrados a parte pelo google
          }}
        >
          {/* componente para agrupar os marcadores e não sobrecarregar o app */}

          <MarkerClusterer options={options}>
            {(clusterer) =>
              markerData.map((location, index) => {
                return (
                  <MarkerComponent
                    key={index}
                    data={location}
                    clusterer={clusterer}
                  />
                )
              })
            }
          </MarkerClusterer>

          <HeatmapLayer
            data={heatMap}
            options={{
              maxIntensity: 1,
              gradient: gradientArray,
            }}
          />

          {/* componente para pesquisa de lugares */}
          <AutoComplete setVLatLng={setVLatLng} setZoom={setZoom} />
        </GoogleMapsComponent>
      )}
    </>
  )
}

export default MapaUsuariosOnlines
