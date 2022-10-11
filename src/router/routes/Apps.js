// ** React Imports
import { lazy } from "react"
import { Navigate } from "react-router-dom"

const Cliente = lazy(() => import("../../views/adm/cliente"))
const ClienteEdit = lazy(() => import("../../views/adm/cliente/edit"))
const Hotspot = lazy(() => import("../../views/adm/hotspot"))
const HotspotEdit = lazy(() => import("../../views/adm/hotspot/edit"))
const ClienteLogin = lazy(() => import("../../views/adm/login"))
const ClienteLoginEdit = lazy(() => import("../../views/adm/login/edit"))
const PlanoConexao = lazy(() => import("../../views/adm/plano_conexao"))
const PlanoConexaoEdit = lazy(() =>
  import("../../views/adm/plano_conexao/edit")
)
const UsuarioLista = lazy(() => import("../../views/usuario/lista"))
const UsuarioDados = lazy(() => import("../../views/usuario/dados"))
const Evento = lazy(() => import("../../views/evento"))
const EventoEdit = lazy(() => import("../../views/evento/edit"))
const Filtro = lazy(() => import("../../views/filtro"))
const FiltroEdit = lazy(() => import("../../views/filtro/edit"))
const PermissaoMAC = lazy(() => import("../../views/adm/permissao_mac"))
const PermissaoMacEdit = lazy(() =>
  import("../../views/adm/permissao_mac/edit")
)

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
    element: <Hotspot />,
    path: "/adm/hotspot",
  },
  {
    element: <HotspotEdit />,
    path: "/adm/hotspot/:id",
  },
  {
    element: <ClienteLogin />,
    path: "/adm/login",
  },
  {
    element: <ClienteLoginEdit />,
    path: "/adm/login/:id",
  },
  {
    element: <PlanoConexao />,
    path: "/adm/plano_conexao",
  },
  {
    element: <PlanoConexaoEdit />,
    path: "/adm/plano_conexao/:id",
  },
  {
    element: <UsuarioLista />,
    path: "/usuario/lista",
  },
  {
    element: <UsuarioDados />,
    path: "/usuario/dados/:id",
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
    element: <PermissaoMAC />,
    path: "/adm/permissao_mac",
  },
  {
    element: <PermissaoMacEdit />,
    path: "/adm/permissao_mac/:id",
  },
]

export default AppRoutes
