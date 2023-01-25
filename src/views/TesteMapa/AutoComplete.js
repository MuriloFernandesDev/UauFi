import { Autocomplete } from '@react-google-maps/api'
import React, { useState } from 'react'
import { Search, Tablet } from 'react-feather'
import { Input } from 'reactstrap'
// ** Custom Components
import Avatar from '@components/avatar'

const AutoComplete = ({ setVLatLng }) => {
  const [autoComplete, setAutoComplete] = useState()
  const [isSearch, setIsSearch] = useState(false)

  function onLoader(autocomplete) {
    setAutoComplete(autocomplete)
  }

  function onPlaceChanged() {
    const place = autoComplete.getPlace()

    if (place.geometry) {
      setVLatLng({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
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
        <Avatar
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
