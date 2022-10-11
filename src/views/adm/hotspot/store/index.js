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
  async (id, { dispatch, getState }) => {
    await api.delete(`/hotspot/${id}`)
    await dispatch(getHotspot(getState().hotspot.params))
    return id
  }
)

export const cloneHotspot = createAsyncThunk(
  "admHotspot/cloneHotspot",
  async (cloneParams, { dispatch, getState }) => {
    await api.post(`/hotspot/duplicar/${cloneParams[0]}/${cloneParams[1]}`)
    await dispatch(getHotspot(getState().hotspot.params))
    return cloneParams[0]
  }
)

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
