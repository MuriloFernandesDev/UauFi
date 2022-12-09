// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getPublicidade = createAsyncThunk(
  "publicidade/getPublicidade",
  async (parametros) => {
    const response = await api.get("/publicidade/lista/", {
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

export const getHotspot = async () => {
  const response = (await api.get(`/hotspot/lista_simples`)).data
  return response
}

export const getFiltros = async () => {
  const response = (await api.get(`/filtro/lista_simples`)).data
  return response
}

export const publicidadeSlice = createSlice({
  name: "publicidade",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPublicidade.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default publicidadeSlice.reducer
