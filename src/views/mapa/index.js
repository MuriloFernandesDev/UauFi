import { useState, useEffect, useCallback } from 'react'

// ** API
import api from '@src/services/api'

import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  ButtonGroup,
  Button,
} from 'reactstrap'
import GoogleMapsComponent from './components/GoogleMap'
import { HeatmapLayer, MarkerClusterer } from '@react-google-maps/api'
import MarkerComponent from './components/Marker'
import AutoComplete from './components/AutoComplete'

const Mapa = () => {
  //state para definir o mapa de calor
  //state enviado ao autoComplete para definir o centro do mapa
  const [vLatLng, setVLatLng] = useState({ lat: -21.2115, lng: -50.421 })
  //define o centro do mapa
  const center = vLatLng
  //define o layout do gráfico
  const containerStyle = {
    width: '100%',
    height: '70vh',
    borderRadius: '10px',
  }
  //state para definir os dados do mapa
  const [mapData, setMapData] = useState([])
  //state para definir os dados dos marcadores
  const [markerData, setMarkerData] = useState([])
  //state para definir os dados do mapa
  const [mapDataOnlines, setMapDataOnlines] = useState([])
  //state para definir os dados dos marcadores
  const [markerDataOnlines, setMarkerDataOnlines] = useState([])
  //state para definir os dados do mapa de calor
  const [heatMapOnlines, setHeatMapOnlines] = useState([])
  //state para definir carregamento dos dados
  const [vProcessando, setProcessando] = useState(true)
  //state para definir o tipo de mapa que irá aparecer
  const [mapType, setMapType] = useState('Marcadores')
  //state para definir os dados do mapa de calor
  const [heatMap, setHeatMap] = useState([])
  //state para definir o zoom no mapa
  const [zoom, setZoom] = useState(13)

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
      if (window.google && markerDataOnlines.length > 0) {
        const heatmapData = []
        markerDataOnlines.map((res) => {
          // for (let i = 0; i < res.total_visitas; i++) {
          heatmapData.push({
            location: new window.google.maps.LatLng(res.lat, res.lng),
            weight: 1,
            radius: res.total_usuarios_online,
          })
          // }
        })
        setHeatMapOnlines(heatmapData)
      }
    },
    [mapData, mapDataOnlines]
  )

  //função para buscar os dados do mapa
  const getDados = (params) => {
    const local = localStorage.getItem('@Uau-fi/mapa')
    const localOnlines = localStorage.getItem('@Uau-fi/mapa-onlines')
    if (!local && !localOnlines) {
      return api
        .get(`/conexao/${params}`)
        .then((res) => {
          const { data } = res

          if (params === 'mapa_google_usuario_online') {
            localStorage.setItem('@Uau-fi/mapa-onlines', JSON.stringify(data))
            setMarkerDataOnlines(data)
            setMapDataOnlines(data)
          } else {
            localStorage.setItem('@Uau-fi/mapa', JSON.stringify(data))
            setMarkerData(data)
            setMapData(data)
            setProcessando(false)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      if (params === 'mapa_google_usuario_online') {
        setMarkerDataOnlines(JSON.parse(localOnlines))
        setMapDataOnlines(JSON.parse(localOnlines))
      } else {
        setMarkerData(JSON.parse(local))
        setMapData(JSON.parse(local))
        setProcessando(false)
      }
    }
  }

  //função para buscar localização atual e definir o centro do mapa
  const getLocalizaoAtual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setVLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        function (error) {
          // callback de erro
          console.log('Erro ao obter localização.', error)
        }
      )
    } else {
      console.log('Navegador não suporta Geolocalização!')
    }
  }

  //array de cores para definir a cor do mapa de calor
  const gradientArray = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)',
  ]

  //options para definir opções dos clusters dos markers
  const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }

  useEffect(() => {
    getLocalizaoAtual()
    getDados('mapa_google')
    getDados('mapa_google_usuario_online')
  }, [])

  /*
    https://react-google-maps-api-docs.netlify.app/
    Documentação do react-google-maps-api
  */

  /*
        LEMBRETE
        Tentar usar o mesmo componente mas desmontar o state quando unMount for chamado
        exemplo https://stackoverflow.com/questions/72219002/heatmap-layer-not-displaying-in-google-maps-api-react-google-maps-api
  */

  return (
    <Card>
      <CardHeader className="pt-1 pe-1 pb-0">
        <h5>Uau-Fi Mapas</h5>
        <ButtonGroup>
          {vProcessando ? (
            <div className="d-flex justify-content-center text-center align-items-center h-100">
              <Spinner type="grow" size="md" color="primary" />
            </div>
          ) : (
            <>
              <Button
                color="primary"
                onClick={() => setMapType('Marcadores')}
                active={mapType === 'Marcadores'}
                outline
              >
                Marcadores
              </Button>
              <Button
                color="primary"
                onClick={() => setMapType('Calor')}
                active={mapType === 'Calor'}
                outline
              >
                Calor
              </Button>
              <Button
                color="primary"
                onClick={() => setMapType('Usuários online')}
                active={mapType === 'Usuários online'}
                outline
              >
                Usuários online
              </Button>
            </>
          )}
        </ButtonGroup>
      </CardHeader>
      <CardBody className="mt-2">
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
            {mapType === 'Marcadores' ? (
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
            ) : mapType === 'Usuários online' ? (
              <>
                <MarkerClusterer options={options}>
                  {(clusterer) =>
                    markerDataOnlines.map((location, index) => {
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
                  data={heatMapOnlines}
                  options={{
                    maxIntensity: 1,
                    gradient: gradientArray,
                  }}
                />
              </>
            ) : (
              <HeatmapLayer
                data={heatMap}
                options={{
                  maxIntensity: 1,
                  gradient: gradientArray,
                }}
              />
            )}

            {/* componente para pesquisa de lugares */}
            <AutoComplete setVLatLng={setVLatLng} setZoom={setZoom} />
          </GoogleMapsComponent>
        )}
      </CardBody>
    </Card>
  )
}

export default Mapa
