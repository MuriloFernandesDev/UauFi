// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// ** Axios Imports
import api from "@src/services/api"

export const getCampanhaAgendada = createAsyncThunk(
  "campanha_agendada/getCampanhaAgendada",
  async (parametros) => {
    const response = await api.get("/campanha_agendada/lista/", {
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

export const deleteCampanhaAgendada = createAsyncThunk(
  "campanha_agendada/deleteCampanhaAgendada",
  async (id) => {
    await api.delete(`/campanha_agendada/${id}`)
    return id
  }
)

export const getFiltros = async () => {
  const response = (await api.get(`/filtro/lista_simples`)).data
  return response
}

export const testarCampanha = async (dados) => {
  const response = await api.post("/campanha_agendada/teste_sms", dados)
  return response
}

export const getClientes = async () => {
  const response = (await api.get(`/cliente/lista_simples`)).data
  return response
}

export const CampanhaAgendadaSlice = createSlice({
  name: "campanha_agendada",
  initialState: {
    data: [],
    total: -1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCampanhaAgendada.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  },
})

export default CampanhaAgendadaSlice.reducer
