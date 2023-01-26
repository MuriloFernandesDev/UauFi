// ** Icons Import
import {
  Link,
  MessageSquare,
  UserCheck,
  Archive,
  Circle,
  Mic,
  Home,
  DollarSign,
  List,
  Coffee,
  FileText,
  Smartphone,
  WifiOff,
  BookOpen,
  Activity,
  MapPin,
} from 'react-feather'

export default [
  {
    id: 'menuDashboard',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: '/dashboard',
  },
  {
    id: 'menuMapa',
    title: 'Mapas',
    icon: <MapPin size={20} />,
    navLink: '/mapa',
    action: 'read',
    resource: 'mapa_google',
  },
  {
    id: 'menuAdm',
    title: 'Administrativo',
    icon: <Archive size={20} />,
    children: [
      {
        id: 'menuAdmCliente',
        title: 'Cliente',
        icon: <Circle size={12} />,
        navLink: '/adm/cliente',
        action: 'read',
        resource: 'adm_clientes',
      },
      {
        id: 'menuAdmHotspot',
        title: 'Hotspot',
        icon: <Circle size={12} />,
        navLink: '/adm/hotspot',
        action: 'read',
        resource: 'adm_hotspot',
      },
      {
        id: 'menuAdmLogin',
        title: 'Login',
        icon: <Circle size={12} />,
        navLink: '/adm/login',
        action: 'read',
        resource: 'adm_login',
      },
      {
        id: 'menuAdmPlanoConexao',
        title: 'Plano de conexão',
        icon: <Circle size={12} />,
        navLink: '/adm/plano_conexao',
        action: 'read',
        resource: 'plano_conexao',
      },
      {
        id: 'menuAdmBlock',
        title: 'Libera/Bloqueia mac',
        icon: <Circle size={12} />,
        navLink: '/adm/permissao_mac',
        action: 'read',
        resource: 'permissao_mac',
      },
    ],
  },
  {
    id: 'menuUsuarios',
    title: 'Usuários online',
    icon: <Smartphone size={20} />,
    navLink: '/usuario/online',
    action: 'read',
    resource: 'status_usuario',
  },
  {
    id: 'menuStatusHS',
    title: 'Status hotspot',
    icon: <Activity size={20} />,
    navLink: '/hotspot/status',
    action: 'read',
    resource: 'status_hotspot',
  },
  {
    id: 'menuEvento',
    title: 'Voucher',
    icon: <Coffee size={20} />,
    navLink: '/evento',
    action: 'read',
    resource: 'evento',
  },
  {
    id: 'menuBloqueioQuarto',
    title: 'Bloqueio de quarto',
    icon: <WifiOff size={20} />,
    navLink: '/bloqueio_quarto',
    action: 'read',
    resource: 'bloqueio_quarto',
  },
  {
    id: 'menuFiltro',
    title: 'Filtros',
    icon: <List size={20} />,
    navLink: '/filtro',
    action: 'read',
    resource: 'filtro_campanha',
  },

  {
    id: 'menuPesquisa',
    title: 'Pesquisa',
    icon: <UserCheck size={20} />,
    navLink: '/pesquisa_captive',
    action: 'read',
    resource: 'adm_pesquisa',
  },
  {
    id: 'menuPublicidade',
    title: 'Publicidade',
    icon: <Mic size={20} />,
    navLink: '/publicidade',
    action: 'read',
    resource: 'adm_publicidade',
  },
  {
    id: 'menuCardapio',
    title: 'Cardápio digital',
    icon: <BookOpen size={20} />,
    children: [
      {
        id: 'menuCardapioCategoria',
        title: 'Categoria',
        icon: <Circle size={12} />,
        navLink: '/cardapio_categoria',
        action: 'read',
        resource: 'cardapio_digital',
      },
      {
        id: 'menuCardapioProduto',
        title: 'Produto',
        icon: <Circle size={12} />,
        navLink: '/cardapio_produto',
        action: 'read',
        resource: 'cardapio_digital',
      },
      {
        id: 'menuCardapioVisualizar',
        title: 'Visualização',
        icon: <Circle size={12} />,
        navLink: '/cardapio_digital',
        action: 'read',
        resource: 'cardapio_digital',
      },
    ],
  },
  {
    id: 'menuCarteira',
    title: 'Minha carteira',
    icon: <DollarSign size={20} />,
    navLink: '/carteira',
    action: 'read',
    resource: 'minha_carteira',
    badge: true,
  },
  {
    id: 'menuCampanha',
    title: 'Campanhas',
    icon: <MessageSquare size={20} />,
    children: [
      {
        id: 'menuCampanhaAgendada',
        title: 'Agendada',
        icon: <Circle size={12} />,
        navLink: '/campanha_agendada',
        action: 'read',
        resource: 'campanha_agendada',
      },
      {
        id: 'menuCampanhaRecorrente',
        title: 'Recorrente',
        icon: <Circle size={12} />,
        navLink: '/campanha_recorrente',
        action: 'read',
        resource: 'campanha_recorrente',
      },
    ],
  },
  {
    id: 'menuEncurtador',
    title: 'Encurtador de URL',
    icon: <Link size={20} />,
    navLink: '/encurtador',
    action: 'read',
    resource: 'encurtador_url',
  },
  {
    id: 'menuRelatorio',
    title: 'Relatórios',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'menuRelatorioCampanha',
        title: 'Campanha enviada',
        icon: <Circle size={12} />,
        navLink: '/relatorio/campanha',
        action: 'read',
        resource: 'rel_campanha',
      },
      {
        id: 'menuRelatorioPesquisa',
        title: 'Pesquisa respondida',
        icon: <Circle size={12} />,
        navLink: '/relatorio/pesquisa',
        action: 'read',
        resource: 'rel_pesquisa',
      },
      {
        id: 'menuRelatorioCadastro',
        title: 'Cadastros/Conexões',
        icon: <Circle size={12} />,
        navLink: '/relatorio/cadastro',
        action: 'read',
        resource: 'rel_cad_conexoes',
      },
      {
        id: 'menuRelatorioEmail',
        title: 'Exportar e-mails',
        icon: <Circle size={12} />,
        navLink: '/relatorio/email',
        action: 'read',
        resource: 'rel_exportar_email',
      },
      {
        id: 'menuRelatorioUsuario',
        title: 'Dados de usuários',
        icon: <Circle size={12} />,
        navLink: '/usuario/lista',
        action: 'read',
        resource: 'rel_exportar_registros',
      },
    ],
  },
]
