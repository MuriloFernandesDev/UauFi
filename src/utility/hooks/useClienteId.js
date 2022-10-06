//** React Imports
import { useEffect } from "react"

// ** Store & Actions
import { handleClienteId } from "@store/layout"
import { useDispatch } from "react-redux"

export const useClienteId = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const clienteId = JSON.parse(localStorage.getItem("clienteId"))

  // ** Return a wrapped version of useState's setter function
  const setClienteId = (value) => {
    dispatch(handleClienteId(value))
  }

  useEffect(() => {
    // ** Renderizar todos os componentes
  }, [clienteId])

  return [clienteId, setClienteId]
}
