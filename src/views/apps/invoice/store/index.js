// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import api from '../../../../services/api'

export const getData = createAsyncThunk('appInvoice/getData', async parametros => {
  const response = await api.get('/cliente/0/', { params: parametros })
  return {
    params: parametros,
    data: response.data.slice(0, parametros.perPage),
    totalPages: response.data.length
  }
})

export const addData = createAsyncThunk('appInvoice/addData', 
  async (dados, { dispatch, getState }) => {
    const response = await axios.post('/cliente', { dados })
    await dispatch(getData(getState().invoice.params))
    return response.data
})

export const updateData = createAsyncThunk('appInvoice/updateData', 
  async (dados, { dispatch, getState }) => {
    const response = await axios.put('/cliente', { dados })
    await dispatch(getData(getState().invoice.params))
    return response.data
})

export const deleteInvoice = createAsyncThunk('appInvoice/deleteInvoice', 
  async (id, { dispatch, getState }) => {
    await axios.delete('/apps/invoice/delete', { id })
    await dispatch(getData(getState().invoice.params))
    return id
})

export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    data: [],
    total: 1,
    params: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.totalPages
      state.params = action.payload.params
    })
  }
})

export default appInvoiceSlice.reducer
