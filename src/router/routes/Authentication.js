// ** React Imports
import { lazy } from "react"

const Login = lazy(() => import("../../views/pages/authentication/Login"))
const LoginBasic = lazy(() =>
  import("../../views/pages/authentication/LoginBasic")
)
const LoginCover = lazy(() =>
  import("../../views/pages/authentication/LoginCover")
)

const Register = lazy(() => import("../../views/pages/authentication/Register"))
const RegisterBasic = lazy(() =>
  import("../../views/pages/authentication/RegisterBasic")
)
const RegisterCover = lazy(() =>
  import("../../views/pages/authentication/RegisterCover")
)
const RegisterMultiSteps = lazy(() =>
  import("../../views/pages/authentication/register-multi-steps")
)

const ForgotPassword = lazy(() =>
  import("../../views/pages/authentication/ForgotPassword")
)
const ForgotPasswordBasic = lazy(() =>
  import("../../views/pages/authentication/ForgotPasswordBasic")
)
const ForgotPasswordCover = lazy(() =>
  import("../../views/pages/authentication/ForgotPasswordCover")
)

const ResetPasswordBasic = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordBasic")
)
const ResetPasswordCover = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordCover")
)

const VerifyEmailBasic = lazy(() =>
  import("../../views/pages/authentication/VerifyEmailBasic")
)
const VerifyEmailCover = lazy(() =>
  import("../../views/pages/authentication/VerifyEmailCover")
)

const TwoStepsBasic = lazy(() =>
  import("../../views/pages/authentication/TwoStepsBasic")
)
const TwoStepsCover = lazy(() =>
  import("../../views/pages/authentication/TwoStepsCover")
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
