// ** React Imports
import { lazy } from "react"

const Login = lazy(() => import("../../views/pages/authentication/Login"))

const ForgotPassword = lazy(() =>
  import("../../views/pages/authentication/ForgotPassword")
)

const AuthenticationRoutes = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/login/:slug",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/esqueci-senha",
    element: <ForgotPassword />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
]

export default AuthenticationRoutes
