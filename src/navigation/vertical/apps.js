// ** Icons Import
import {
  Link,
  MessageSquare,
  Wifi,
  UserCheck,
  Archive,
  Circle,
  Mic,
  Home,
  DollarSign,
  List,
  Coffee,
  FileText,
  Calendar,
  Smartphone,
} from "react-feather"

export default [
  {
    id: "menuDashboard",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "menuAdm",
    title: "Administrativo",
    icon: <Archive size={20} />,
    children: [
      {
        id: "menuAdmCliente",
        title: "Cliente",
        icon: <Circle size={12} />,
        navLink: "/adm/cliente",
        action: "read",
        resource: "adm_clientes",
      },
      {
        id: "menuAdmHotspot",
        title: "Hotspot",
        icon: <Circle size={12} />,
        navLink: "/adm/hotspot",
        action: "read",
        resource: "adm_hotspot",
      },
      {
        id: "menuAdmLogin",
        title: "Login",
        icon: <Circle size={12} />,
        navLink: "/adm/login",
        action: "read",
        resource: "adm_login",
      },
      {
        id: "menuAdmPlanoConexao",
        title: "Plano de conexão",
        icon: <Circle size={12} />,
        navLink: "/adm/plano_conexao",
        action: "read",
        resource: "plano_conexao",
      },
      {
        id: "menuAdmBlock",
        title: "Libera/Bloqueia mac",
        icon: <Circle size={12} />,
        navLink: "/adm/permissao_mac",
        action: "read",
        resource: "permissao_mac",
      },
    ],
  },
  {
    id: "menuUsuarios",
    title: "Usuários",
    icon: <Smartphone size={20} />,
    navLink: "/usuario/lista",
    action: "read",
    resource: "status_usuario",
  },
  {
    id: "menuEvento",
    title: "Evento",
    icon: <Coffee size={20} />,
    navLink: "/evento",
    action: "read",
    resource: "evento",
  },
  {
    id: "menuPesquisa",
    title: "Pesquisa",
    icon: <UserCheck size={20} />,
    navLink: "/pesquisa",
    action: "read",
    resource: "adm_pesquisa",
  },
  {
    id: "menuPublicidade",
    title: "Publicidade",
    icon: <Mic size={20} />,
    navLink: "/publicidade",
    action: "read",
    resource: "adm_publicidade",
  },
  {
    id: "menuCarteira",
    title: "Minha carteira",
    icon: <DollarSign size={20} />,
    navLink: "/carteira",
    action: "read",
    resource: "minha_carteira",
  },
  {
    id: "menuFiltro",
    title: "Filtros",
    icon: <List size={20} />,
    navLink: "/filtro",
    action: "read",
    resource: "filtro_campanha",
  },
  {
    id: "menuCampanha",
    title: "Campanhas",
    icon: <MessageSquare size={20} />,
    children: [
      {
        id: "menuCampanhaPush",
        title: "Push (App)",
        icon: <Circle size={12} />,
        navLink: "/campanha/push",
        action: "read",
        resource: "campanha_push",
      },
      {
        id: "menuCampanhaSms",
        title: "SMS",
        icon: <Circle size={12} />,
        navLink: "/campanha/sms",
        action: "read",
        resource: "campanha_sms",
      },
      {
        id: "menuCampanhaRecorrente",
        title: "Recorrentes",
        icon: <Calendar size={20} />,
        children: [
          {
            id: "menuCampanhaRecorrentePush",
            title: "Push (App)",
            icon: <Circle size={12} />,
            navLink: "/campanha/recorrente/push",
            action: "read",
            resource: "campanha_rec_push",
          },
          {
            id: "menuCampanhaRecorrenteSms",
            title: "SMS",
            icon: <Circle size={12} />,
            navLink: "/campanha/recorrente/sms",
            action: "read",
            resource: "campanha_rec_sms",
          },
        ],
      },
    ],
  },
  {
    id: "menuEncurtador",
    title: "Encurtador de URL",
    icon: <Link size={20} />,
    navLink: "/encurtador",
    action: "read",
    resource: "encurtador_url",
  },
  {
    id: "menuRelatorio",
    title: "Relatórios",
    icon: <FileText size={20} />,
    children: [
      {
        id: "menuRelatorioCampanha",
        title: "Campanhas",
        icon: <Circle size={12} />,
        navLink: "/relatorio/campanha",
        action: "read",
        resource: "rel_campanha",
      },
      {
        id: "menuRelatorioCadastro",
        title: "Cadastros/Conexões",
        icon: <Circle size={12} />,
        navLink: "/relatorio/cadastro",
        action: "read",
        resource: "rel_cad_conexoes",
      },
      {
        id: "menuRelatorioEmail",
        title: "Exportar e-mails",
        icon: <Circle size={12} />,
        navLink: "/relatorio/email",
        action: "read",
        resource: "rel_exportar_email",
      },
      {
        id: "menuRelatorioRegistro",
        title: "Exportar registros",
        icon: <Circle size={12} />,
        navLink: "/relatorio/registro",
        action: "read",
        resource: "rel_exportar_registros",
      },
    ],
  },
]
