import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

api.interceptors.request.use(
  config => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbUB1YXVmaS5jb20iLCJuYmYiOjE2NTg1MDkzNTQsImV4cCI6MTY1ODUxMjk1NCwiaWF0IjoxNjU4NTA5MzU0fQ.fMMjnJGsgAwQW29I-Jo8z9OJ2XXPx8k5DePWN24wUvI' 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  },
  error => {
    Promise.reject(error)
  }
)
/*
api.interceptors.response.use(
  response => {
    return response
  },
  function (error) {
    const originalRequest = error.config

    if (
      error.response.status === 401 &&
      originalRequest.url === 'http://127.0.0.1:3000/v1/auth/token'
    ) {
      router.push('/login')
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorageService.getRefreshToken()
      return axios
        .post('/auth/token', {
          refresh_token: refreshToken
        })
        .then(res => {
          if (res.status === 201) {
            localStorageService.setToken(res.data)
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + localStorageService.getAccessToken()
            return axios(originalRequest)
          }
        })
    }
    return Promise.reject(error)
  }
)
*/
export default api