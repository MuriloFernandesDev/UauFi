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
const PesquisaCaptive = lazy(() => import("../../views/pesquisa_captive"))
const PesquisaCaptiveEdit = lazy(() =>
  import("../../views/pesquisa_captive/edit")
)
const Publicidade = lazy(() => import("../../views/publicidade"))
const PublicidadeEdit = lazy(() => import("../../views/publicidade/edit"))
const Filtro = lazy(() => import("../../views/filtro"))
const FiltroEdit = lazy(() => import("../../views/filtro/edit"))
const Encurtador = lazy(() => import("../../views/encurtador"))
const EncurtadorEdit = lazy(() => import("../../views/encurtador/edit"))
const BloqueioQuarto = lazy(() => import("../../views/bloqueio_quarto"))
const BloqueioQuartoEdit = lazy(() =>
  import("../../views/bloqueio_quarto/edit")
)
const PermissaoMAC = lazy(() => import("../../views/adm/permissao_mac"))
const PermissaoMacEdit = lazy(() =>
  import("../../views/adm/permissao_mac/edit")
)
const CampanhaAgendada = lazy(() => import("../../views/campanha_agendada"))
const CampanhaAgendadaEdit = lazy(() =>
  import("../../views/campanha_agendada/edit")
)
const CampanhaRecorrente = lazy(() => import("../../views/campanha_recorrente"))
const CampanhaRecorrenteEdit = lazy(() =>
  import("../../views/campanha_recorrente/edit")
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
    element: <Encurtador />,
    path: "/encurtador",
  },
  {
    element: <EncurtadorEdit />,
    path: "/encurtador/:id",
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
    element: <PesquisaCaptive />,
    path: "/pesquisa_captive",
  },
  {
    element: <PesquisaCaptiveEdit />,
    path: "/pesquisa_captive/:id",
  },
  {
    element: <Publicidade />,
    path: "/publicidade",
  },
  {
    element: <PublicidadeEdit />,
    path: "/publicidade/:id",
  },
  {
    element: <PermissaoMAC />,
    path: "/adm/permissao_mac",
  },
  {
    element: <PermissaoMacEdit />,
    path: "/adm/permissao_mac/:id",
  },
  {
    element: <CampanhaAgendada />,
    path: "/campanha_agendada",
  },
  {
    element: <CampanhaAgendadaEdit />,
    path: "/campanha_agendada/:id",
  },
  {
    element: <CampanhaRecorrente />,
    path: "/campanha_recorrente",
  },
  {
    element: <CampanhaRecorrenteEdit />,
    path: "/campanha_recorrente/:id",
  },
  {
    element: <BloqueioQuarto />,
    path: "/bloqueio_quarto",
  },
  {
    element: <BloqueioQuartoEdit />,
    path: "/bloqueio_quarto/:id",
  },
]

export default AppRoutes
