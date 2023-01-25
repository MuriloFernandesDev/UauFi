import { Autocomplete } from '@react-google-maps/api'
import React, { useState } from 'react'
import { Search, Tablet } from 'react-feather'
import { Button, Input } from 'reactstrap'
// ** Custom Components
import Avatar from '@components/avatar'

const AutoComplete = ({ setVLatLng }) => {
  const [autoComplete, setAutoComplete] = useState()
  const [isSearch, setIsSearch] = useState(false)

  function onLoader(autocomplete) {
    setAutoComplete(autocomplete)
  }

  function onPlaceChanged() {
    if (autoComplete.getPlace().geometry) {
      setVLatLng({
        lat: autoComplete.getPlace().geometry.viewport.Wa.hi,
        lng: autoComplete.getPlace().geometry.viewport.Ja.hi,
      })
    } else {
      console.log('Not found.')
    }
  }

  return (
    <Autocomplete onLoad={onLoader} onPlaceChanged={onPlaceChanged}>
      <div
        style={{
          width: `100%`,
          position: 'absolute',
          top: 13,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <Input
          type="text"
          placeholder="Pesquisar por lugar..."
          style={{
            transition: 'visibility 0s, width 0.6s linear',
            width: isSearch ? '190px' : '0',
            visibility: isSearch ? 'visible' : 'hidden',
            marginLeft: isSearch ? '0' : -50,
          }}
        />
        <Avatar
          onClick={() => setIsSearch(!isSearch)}
          color="text-primary"
          icon={<Search size={20} />}
        />
      </div>
    </Autocomplete>
  )
}
export default AutoComplete
