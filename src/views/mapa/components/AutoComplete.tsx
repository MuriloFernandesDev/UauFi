import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { Search } from 'react-feather'
import { Input } from 'reactstrap'
// ** Custom Components
import AvatarComponent from './avatar'

interface AutoCompleteProps {
  setVLatLng: any,
  setZoom: (prop: number) => void
}

const AutoComplete = ({ setVLatLng, setZoom }: AutoCompleteProps) => {
  const [autoComplete, setAutoComplete] = useState<any>()
  const [isSearch, setIsSearch] = useState<boolean>(false)

  function onLoader(autocomplete: any) {
    setAutoComplete(autocomplete)
  }

  function onPlaceChanged() {
    const place = autoComplete.getPlace()

    if (place.geometry) {
      setVLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
      setZoom(13)
    } else {
      console.log('Not found.')
    }
  }

  return (
    <Autocomplete onLoad={onLoader} onPlaceChanged={onPlaceChanged}>
      <div
        style={{
          position: 'absolute',
          top: 13,
          display: 'flex',
          left: 13,
          alignItems: 'center',
          gap: 5,
        }}
      >
        <AvatarComponent
         onClick={() => setIsSearch(!isSearch)} 
         className="text-primary"
          icon={<Search className="text-white" size={20} />}
        />
        <Input
          type="text"
          placeholder="Pesquisar por lugar..."
          style={{
            transition: 'visibility 0.5s, width 0.6s linear',
            width: isSearch ? '190px' : '0',
            visibility: isSearch ? 'visible' : 'hidden',
          }}
        />
      </div>
    </Autocomplete>
  )
}
export default AutoComplete
