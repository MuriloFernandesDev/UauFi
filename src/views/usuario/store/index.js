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
      data: response.data.slice(vRegInicial, vRegFinal),
      allData: response.data,
      totalPages: response.data.length,
    }
  }
)

export const getUsuariosNovos = createAsyncThunk(
  "usuario/getUsuariosNovos",
  async (parametros) => {
    const response = await api.get("/usuario/lista_totais", {
      params: parametros,
    })
    return {
      novos: response.data.valor,
    }
  }
)

export const getUsuario = async (id) => {
  const response = (await api.get(`/usuario/dados/${id}`)).data
  return response
}

export const getUsuariosOnline = createAsyncThunk(
  "usuario/getUsuariosOnline",
  async (parametros) => {
    const response = await api.get("/usuario/lista_totais", {
      params: parametros,
    })
    return {
      online: response.data.valor,
    }
  }
)

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
    novos: -1,
    online: -1,
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
      })
      .addCase(getUsuariosNovos.fulfilled, (state, action) => {
        state.novos = action.payload.novos
      })
      .addCase(getUsuariosOnline.fulfilled, (state, action) => {
        state.online = action.payload.online
      })
  },
})

export default usuarioSlice.reducer
