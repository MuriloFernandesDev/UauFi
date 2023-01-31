import { useState, useEffect, useCallback, useContext } from 'react'
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
// ** Context
import { AbilityContext as PermissaoContext } from '@src/utility/context/Can'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import { useTranslation } from 'react-i18next'

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
  const [mapData, setMapData] = useState<any>([])
  //state para definir os dados dos marcadores
  const [markerData, setMarkerData] = useState<any>([])
  //state para definir os dados do mapa
  const [mapDataOnlines, setMapDataOnlines] = useState<any>([])
  //state para definir os dados dos marcadores
  const [markerDataOnlines, setMarkerDataOnlines] = useState<any>([])
  //state para definir os dados do mapa de calor
  const [heatMapOnlines, setHeatMapOnlines] = useState<any>([])
  //state para definir carregamento dos dados
  const [vProcessando, setProcessando] = useState<any>(true)
  //state para definir o tipo de mapa que irá aparecer
  const [mapType, setMapType] = useState<any>('Marcadores')
  //state para definir os dados do mapa de calor
  const [heatMap, setHeatMap] = useState<any>([])
  //state para definir o zoom no mapa
  const [zoom, setZoom] = useState<any>(4)

  console.log(markerData)

  // ** Context
  const permissao = useContext(PermissaoContext)
  // ** Hooks
  const { skin } = useSkin()
  const { t } = useTranslation()

  //função para buscar mapa de calor quando o mapData estiver carregado
  const onLoad = useCallback(
    function callback() {
      if (window.google && markerData.length > 0) {
        const heatmapData: any = []
        markerData.map((res: any) => {
          heatmapData.push({
            location: new window.google.maps.LatLng(res.lat, res.lng),
            weight: 1,
            radius: res.total_visitas,
          })
        })
        setHeatMap(heatmapData)
      }
      if (window.google && markerDataOnlines.length > 0) {
        const heatmapData: any = []
        markerDataOnlines.map((res: any) => {
          heatmapData.push({
            location: new window.google.maps.LatLng(res.lat, res.lng),
            weight: 1,
            radius: res.total_usuarios_online,
          })
        })
        setHeatMapOnlines(heatmapData)
      }
    },
    [mapData, mapDataOnlines]
  )

  //função para buscar os dados do mapa
  const getDados = (params: string) => {
    return api
      .get(`/conexao/${params}`)
      .then((res) => {
        const { data } = res

        if (params === 'mapa_google_usuario_online') {
          setMarkerDataOnlines(data)
          setMapDataOnlines(data)
        } else {
          //define a media de lat e lng e centraliza o mapa nela
          for (const u in data) {
            const vLat = data[u].lat
            const vLng = data[u].lng
            setVLatLng({ lat: vLat, lng: vLng })
          }
          setMarkerData(data)
          setMapData(data)
          setProcessando(false)
        }
      })
      .catch((error) => {
        setProcessando(false)
        console.log(error)
      })
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

  //useeffect para buscar os dados do mapa na api
  useEffect(() => {
    if (permissao.can('read', 'mapa_google')) {
      getLocalizaoAtual()
      getDados('mapa_google')
      getDados('mapa_google_usuario_online')
    }
  }, [])

  /*
    https://react-google-maps-api-docs.netlify.app/
    Documentação do react-google-maps-api
  */

  return (
    <Card>
      {/* verificar se o usuário tem permissão de acesso ao mapa, se não possuir
      mostra o conteudo abaixo */}
      {!permissao.can('read', 'mapa_google') ? (
        <div className="misc-inner p-2 p-sm-3">
          <div className="w-100 text-center">
            <h2 className="mb-1">
              {`${t('Esse conteúdo não está disponível para sua conta ')} 🔐`}
            </h2>
            <p className="mb-2">
              {t(
                'Entre em contato com o nosso suporte para habilitar essa opção!'
              )}
            </p>
            <img
              className="img-fluid"
              src={
                require(`@src/assets/images/pages/${
                  skin === 'dark'
                    ? 'not-authorized-dark.svg'
                    : 'not-authorized.svg'
                }`).default
              }
              alt="Not authorized page"
            />
          </div>
        </div>
      ) : (
        <>
          <CardHeader className="pt-1 pe-1 pb-0">
            <h5>{t('Mapas')}</h5>
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
                    {t('Marcadores')}
                  </Button>
                  {permissao.can('read', 'mapa_calor') && (
                    <Button
                      color="primary"
                      onClick={() => setMapType('Calor')}
                      active={mapType === 'Calor'}
                      outline
                    >
                      {t('Calor')}
                    </Button>
                  )}

                  {markerDataOnlines && markerDataOnlines.length > 0 && (
                    <Button
                      color="primary"
                      onClick={() => setMapType('Usuários online')}
                      active={mapType === 'Usuários online'}
                      outline
                    >
                      {t('Usuários online')}
                    </Button>
                  )}
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
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                options={{
                  gestureHandling: 'greedy',
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  mapTypeId: 'roadmap',
                  //opções acimas desativam os controles de mapa que são cobrados a parte pelo google
                }}
              >
                <>
                  {/* componente para agrupar os marcadores e não sobrecarregar o app */}
                  {mapType === 'Marcadores' ? (
                    <MarkerClusterer options={options}>
                      {(clusterer) =>
                        markerData.map((location: any, index: any) => {
                          return (
                            <MarkerComponent
                              position={{
                                lat: location.lat,
                                lng: location.lng,
                              }}
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
                          markerDataOnlines.map((location: any, index: any) => {
                            return (
                              <MarkerComponent
                                position={{
                                  lat: location.lat,
                                  lng: location.lng,
                                }}
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
                </>
              </GoogleMapsComponent>
            )}
          </CardBody>
        </>
      )}
    </Card>
  )
}

export default Mapa
