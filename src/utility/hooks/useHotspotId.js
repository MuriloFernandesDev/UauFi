//** React Imports
import { useEffect } from "react"

// ** Store & Actions
import { handleHotspot } from "@store/layout"
import { useDispatch } from "react-redux"

export const useHotspotId = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const hotspotId = JSON.parse(localStorage.getItem("hotspotId"))

  // ** Return a wrapped version of useState's setter function
  const setHotspotId = (value) => {
    dispatch(handleHotspot(value))
  }

  useEffect(() => {
    // ** Renderizar todos os componentes
  }, [hotspotId])

  return [hotspotId, setHotspotId]
}
