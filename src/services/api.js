import axios from "axios"

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
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      originalRequest.url === "http://127.0.0.1:3000/v1/auth/token"
    ) {
      router.push("/login")
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorageService.getRefreshToken()
      return axios
        .post("/auth/token", {
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
    }
    return Promise.reject(error)
  }
)

export default api
