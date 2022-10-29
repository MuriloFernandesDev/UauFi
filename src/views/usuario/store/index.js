// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getUsuarios = createAsyncThunk(
  "usuario/getUsuarios",
  async (parametros) => {
    //console.log(parametros)
    const response = await api.get("/usuario/lista", { params: parametros })
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
      data: response.data.dados.slice(vRegInicial, vRegFinal),
      allData: response.data.dados,
      totalPages: response.data.dados.length,
      total_online: response.data.total_online,
      total_cadastro: response.data.total_cadastro,
      total_usuario: response.data.total_usuario,
    }
  }
)

export const getPagina = createAsyncThunk(
  "usuario/getPagina",
  async (parametros) => {
    let vRegInicial = (parametros.page - 1) * parametros.perPage
    let vRegFinal = parametros.page * parametros.perPage
    if (vRegInicial > parametros.allData.length - 1) {
      vRegInicial = 0
      vRegFinal = perPage
    }

    if (vRegFinal > parametros.allData.length) {
      vRegFinal = parametros.allData.length
    }
    return {
      page: parametros.page,
      perPage: parametros.perPage,
      data: parametros.allData.slice(vRegInicial, vRegFinal),
    }
  }
)

export const getUsuario = async (id) => {
  const response = (await api.get(`/usuario/dados/${id}`)).data
  return response
}

export const getAcessos = async (id) => {
  const response = (await api.get(`/usuario/linha_tempo/${id}`)).data
  return response
}

export const getInfoUsuario = async (id) => {
  const response = (await api.get(`/usuario/informacoes/${id}`)).data
  return response
}

export const getTotais = async (id) => {
  const response = (await api.get(`/usuario/totais/${id}`)).data
  return response
}

export const getListaHotspot = async (id) => {
  const response = (await api.get(`/usuario/hotspot_visitado/${id}`)).data
  return response
}

export const deleteUsuario = createAsyncThunk(
  "usuario/deleteUsuario",
  async (id) => {
    await api.delete(`/usuario/${id}`)
    return id
  }
)

export const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    data: [],
    total: -1,
    total_cadastro: 0,
    total_online: 0,
    total_usuario: 0,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsuarios.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.allData = action.payload.allData
        state.total = action.payload.totalPages
        state.params = action.payload.params
        state.total_cadastro = action.payload.total_cadastro
        state.total_online = action.payload.total_online
        state.total_usuario = action.payload.total_usuario
      })
      .addCase(getPagina.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params.page = action.payload.page
        state.params.perPage = action.payload.perPage
      })
  },
})

export default usuarioSlice.reducer
