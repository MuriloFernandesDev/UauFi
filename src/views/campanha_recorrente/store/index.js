// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getCampanhaRecorrente = createAsyncThunk(
  "campanha_recorrente/getCampanhaRecorrente",
  async (parametros) => {
    const response = await api.get("/campanha_recorrente/lista/", {
      params: parametros,
    })
    // console.log(response)
    let vRegInicial = (parametros.page - 1) * parametros.perPage
    let vRegFinal = parametros.page * parametros.perPage
    //Verificar se o registro inicial existe
    if (vRegInicial > response.data.length - 1) {
      //Se o registro que quer mostrar está fora do range, limitar exibição
      vRegInicial = 0
      parametros.page = 1
      vRegFinal = parametros.perPage
    }

    //verificar se a página selecionada ainda existe
    if (vRegFinal > response.data.length) {
      //Se o registro que quer mostrar está fora do range, limitar exibição
      vRegFinal = response.data.length
    }
    return {
      params: parametros,
      data: response.data.slice(vRegInicial, vRegFinal),
      allData: response.data,
      totalPages: response.data.length,
    }
  }
)

export const deleteCampanhaRecorrente = async (id) => {
  const response = await api.delete(`/campanha_recorrente/${id}`)
  return response
}

export const getTipos = async () => {
  const response = (await api.get(`/listas/tipo_campanha_recorrente`)).data
  return response
}

export const getClientes = async () => {
  const response = (await api.get(`/cliente/lista_simples`)).data
  return response
}

export const CampanhaRecorrenteSlice = createSlice({
  name: "campanha_recorrente",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCampanhaRecorrente.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default CampanhaRecorrenteSlice.reducer
