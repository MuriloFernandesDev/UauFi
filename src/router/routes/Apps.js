// ** React Imports
import { lazy } from "react"
import { Navigate } from "react-router-dom"

const Cliente = lazy(() => import("../../views/adm/cliente"))
const ClienteEdit = lazy(() => import("../../views/adm/cliente/edit"))
const Evento = lazy(() => import("../../views/evento"))
const EventoEdit = lazy(() => import("../../views/evento/edit"))
const Filtro = lazy(() => import("../../views/filtro"))
const FiltroEdit = lazy(() => import("../../views/filtro/edit"))
const Gerenciar = lazy(() => import("../../views/users/gerenciar"))
const GerenciarEdit = lazy(() => import("../../views/users/gerenciar/edit"))
const Plano = lazy(() => import("../../views/users/plano"))
const PlanoEdit = lazy(() => import("../../views/users/plano/edit"))

const AppRoutes = [
  {
    element: <Cliente />,
    path: "/adm/cliente",
  },
  {
    element: <ClienteEdit />,
    path: "/adm/cliente/:id",
  },
  {
    element: <Filtro />,
    path: "/filtro",
  },
  {
    element: <FiltroEdit />,
    path: "/filtro/:id",
  },
  {
    element: <Evento />,
    path: "/evento",
  },
  {
    element: <EventoEdit />,
    path: "/evento/:id",
  },
  {
    element: <Gerenciar />,
    path: "/usuario/gerenciar",
  },
  {
    element: <GerenciarEdit />,
    path: "/usuario/gerenciar/:id",
  },
  {
    element: <Plano />,
    path: "/usuario/plano",
  },
  {
    element: <PlanoEdit />,
    path: "/usuario/plano/:id",
  },
]

export default AppRoutes
