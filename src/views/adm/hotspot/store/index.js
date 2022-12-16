// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getHotspot = createAsyncThunk(
  "admHotspot/getHotspot",
  async (parametros) => {
    //console.log(parametros)
    const response = await api.get("/hotspot/lista/", { params: parametros })
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

export const deleteHotspot = createAsyncThunk(
  "admHotspot/deleteHotspot",
  async (id) => {
    await api.delete(`/hotspot/${id}`)
    return id
  }
)

export const getConectados = async (id) => {
  const response = (await api.get(`/hotspot/teste_comunicacao/${id}`)).data
  return response
}

export const getHotspotStatus = async () => {
  const response = (await api.get("/hotspot/status")).data
  return response
}

export const cloneHotspot = createAsyncThunk(
  "admHotspot/cloneHotspot",
  async (cloneParams) => {
    await api.post(`/hotspot/duplicar/${cloneParams[0]}/${cloneParams[1]}`)
    return cloneParams[0]
  }
)

export const getClientes = async () => {
  const response = (await api.get(`/cliente/lista_simples`)).data
  return response
}

export const getMarcas = async () => {
  const response = (await api.get(`/listas/marca_equipamento`)).data
  return response
}

export const admHotspotSlice = createSlice({
  name: "admHotspot",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHotspot.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default admHotspotSlice.reducer
