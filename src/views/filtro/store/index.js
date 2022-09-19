// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getData = createAsyncThunk(
  "admCliente/getData",
  async (parametros) => {
    //console.log(parametros)
    const response = await api.get("/cliente/0/", { params: parametros })
    //console.log(response)
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

export const addData = createAsyncThunk(
  "admCliente/addData",
  async (dados, { dispatch, getState }) => {
    const response = await api.post("/cliente", { dados })
    await dispatch(getData(getState().cliente.params))
    return response.data
  }
)

export const updateData = createAsyncThunk(
  "admCliente/updateData",
  async (dados, { dispatch, getState }) => {
    const response = await api.put("/cliente", { dados })
    await dispatch(getData(getState().cliente.params))
    return response.data
  }
)

export const deleteCliente = createAsyncThunk(
  "admCliente/deleteCliente",
  async (id, { dispatch, getState }) => {
    await api.delete(`/cliente/${id}`)
    await dispatch(getData(getState().cliente.params))
    return id
  }
)

export const cloneCliente = createAsyncThunk(
  "admCliente/cloneCliente",
  async (cloneParams, { dispatch, getState }) => {
    await api.post(`/cliente/duplicar/${cloneParams[0]}/${cloneParams[1]}`)
    await dispatch(getData(getState().cliente.params))
    return cloneParams[0]
  }
)

export const admClienteSlice = createSlice({
  name: "admCliente",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default admClienteSlice.reducer
