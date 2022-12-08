import { DefaultRoute } from "../router/routes"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => {
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num
}

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "")

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat("pt-BR", formatting).format(new Date(value))
}

export const formatDateTime = (
  value,
  formatting = {
    dateStyle: "short",
    timeStyle: "short",
  }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat("pt-BR", formatting).format(new Date(value))
}

export const formatInt = (value, formatting = {}) => {
  if (!value) return value
  return new Intl.NumberFormat("pt-BR", formatting).format(value ?? 0)
}

export const formatMoeda = (
  value,
  formatting = {
    style: "currency",
    currency: "BRL",
  }
) => {
  if (!value) return value
  if (isNaN(value)) {
    value = Number(value.replace(".", "").replace(",", "."))
  }
  return new Intl.NumberFormat("pt-BR", formatting).format(value ?? 0)
}

export const campoInvalido = (dados, erros, campo, tipo) => {
  return (
    (erros === null || erros[campo]) &&
    (!dados[campo] ||
      (tipo === "int" && ((dados[campo] ?? 0) === 0 || isNaN(dados[campo]))) ||
      (!tipo && dados[campo]?.length === 0))
  )
}

// ** Modal de apresentação de erros

const MySwal = withReactContent(Swal)

export const mostrarMensagem = (titulo, mensagem, icone) => {
  return MySwal.fire({
    title: titulo,
    text: mensagem,
    icon: icone,
    customClass: {
      confirmButton: "btn btn-primary",
      popup: "animate__animated animate__fadeIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
    buttonsStyling: false,
  })
}

export const removerAcentos = (strAccents) => {
  strAccents = strAccents.split("")
  let strAccentsOut = new Array()
  const strAccentsLen = strAccents.length
  const accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçðÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž"
  const accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeCcdDIIIIiiiiUUUUuuuuNnSsYyyZz"

  for (let y = 0; y < strAccentsLen; y++) {
    if (accents.indexOf(strAccents[y]) !== -1) {
      strAccentsOut[y] = accentsOut.substring(
        accents.indexOf(strAccents[y]),
        accents.indexOf(strAccents[y]) + 1
      )
    } else strAccentsOut[y] = strAccents[y]
  }
  strAccentsOut = strAccentsOut.join("")

  return strAccentsOut
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: "short", day: "numeric" }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" }
  }

  return new Intl.DateTimeFormat("pt-BR", formatting).format(new Date(value))
}

//Retornar data e hora atual no formato para input
export const dateTimeNow = () => {
  const d = new Date()
  let month = `${d.getMonth() + 1}`,
    day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [year, month, day].join("-")
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData")
export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin" && DefaultRoute) {
    return DefaultRoute
  }
  if (userRole === "client") return "/access-control"
  return "/login"
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
})
