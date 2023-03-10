import axios from "axios"

// ** Utils
//import { getUserData } from "@utils"

// ** import das configurações do JWT
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(
      jwtDefaultConfig.storageTokenKeyName
    )

    const clienteId = JSON.parse(localStorage.getItem("clienteId"))
    //Enviar Cliente selecionado
    if (clienteId) {
      config.headers["cliente_id"] = clienteId.value
      config.headers["hotspot_id"] = clienteId.hs_id
    }

    const vLang = localStorage.getItem("i18nextLng")
    //Enviar lingua selecionada
    if (vLang) {
      config.headers["lang"] = vLang
    }

    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `${jwtDefaultConfig.tokenType} ${accessToken}`
    }
    config.headers["Access-Control-Allow-Origin"] = "*"
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  function (error) {
    /*
    const originalRequest = error.config

    const user = getUserData()

    if (
      error.response.status === 401 &&
      originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
    ) {
      router.push("/login")
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = user.refreshToken
      return axios
      .post("/cliente_login/auth", {
          refresh_token: refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
            localStorageService.setToken(res.data)
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${localStorageService.getAccessToken()}`
            return axios(originalRequest)
          }
        })
    }*/
    return Promise.reject(error)
  }
)

export default api
