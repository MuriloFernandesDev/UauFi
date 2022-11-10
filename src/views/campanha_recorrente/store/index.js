// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getBloqueioQuarto = createAsyncThunk(
  "bloqueio_quarto/getBloqueioQuarto",
  async (parametros) => {
    const response = await api.get("/bloqueio_quarto/lista/", {
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

export const deleteBloqueioQuarto = createAsyncThunk(
  "bloqueio_quarto/deleteBloqueioQuarto",
  async (id) => {
    await api.delete(`/bloqueio_quarto/${id}`)
    return id
  }
)

export const getHotspot = async () => {
  const response = (await api.get(`/hotspot/lista_simples`)).data
  return response
}

export const BloqueioQuartoSlice = createSlice({
  name: "bloqueio_quarto",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBloqueioQuarto.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default BloqueioQuartoSlice.reducer
