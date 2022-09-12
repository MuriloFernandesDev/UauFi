// ** Icons Import
import { Link, MessageSquare, Wifi, UserCheck, Archive, Circle, Mic, Home, DollarSign, List, FileText, Calendar } from 'react-feather'

export default [  
  {
    id: 'menuDashboard',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: '/dashboard'
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
        navLink: '/adm/cliente'
      },
      {
        id: 'menuAdmHotspot',
        title: 'Hotspot',
        icon: <Circle size={12} />,
        navLink: '/adm/hotspot'
      },
      {
        id: 'menuAdmLogin',
        title: 'Login',
        icon: <Circle size={12} />,
        navLink: '/adm/login'
      }
    ]
  },
  {
    id: 'menuPesquisa',
    title: 'Pesquisa',
    icon: <UserCheck size={20} />,    
    navLink: '/pesquisa'   
  },
  {
    id: 'menuPublicidade',
    title: 'Publicidade',
    icon: <Mic size={20} />,    
    navLink: '/publicidade'   
  },
  {
    id: 'menuStatus',
    title: 'Status',
    icon: <Wifi size={20} />,
    children: [
      {
        id: 'menuStatusHotspot',
        title: 'Hotspots online',
        icon: <Circle size={12} />,
        navLink: '/status/hotspot'
      },
      {
        id: 'menuStatusUsuario',
        title: 'Usuários online',
        icon: <Circle size={12} />,
        navLink: '/status/usuario'
      }
    ]
  },
  {
    id: 'menuCarteira',
    title: 'Minha carteira',
    icon: <DollarSign size={20} />,    
    navLink: '/carteira'   
  },
  {
    id: 'menuFiltro',
    title: 'Filtros',
    icon: <List size={20} />,    
    navLink: '/filtro'   
  },
  {
    id: 'menuCampanha',
    title: 'Campanhas',
    icon: <MessageSquare size={20} />,
    children: [
      {
        id: 'menuCampanhaPush',
        title: 'Push (App)',
        icon: <Circle size={12} />,
        navLink: '/campanha/push'
      },
      {
        id: 'menuCampanhaSms',
        title: 'SMS',
        icon: <Circle size={12} />,
        navLink: '/campanha/sms'
      },
      {
        id: 'menuCampanhaRecorrente',
        title: 'Recorrentes',
        icon: <Calendar size={20} />,
        children: [
          {
            id: 'menuCampanhaRecorrentePush',
            title: 'Push (App)',
            icon: <Circle size={12} />,
            navLink: '/campanha/recorrente/push'
          },
          {
            id: 'menuCampanhaRecorrenteSms',
            title: 'SMS',
            icon: <Circle size={12} />,
            navLink: '/campanha/recorrente/sms'
          }
        ]
      }
    ]
  },
  {
    id: 'menuEncurtador',
    title: 'Encurtador de URL',
    icon: <Link size={20} />,    
    navLink: '/encurtador'   
  },
  {
    id: 'menuRelatorio',
    title: 'Relatórios',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'menuRelatorioCampanha',
        title: 'Campanhas',
        icon: <Circle size={12} />,
        navLink: '/relatorio/campanha'
      },
      {
        id: 'menuRelatorioCadastro',
        title: 'Cadastros/Conexões',
        icon: <Circle size={12} />,
        navLink: '/relatorio/cadastro'
      },
      {
        id: 'menuRelatorioEmail',
        title: 'Exportar e-mails',
        icon: <Circle size={12} />,
        navLink: '/relatorio/email'
      },
      {
        id: 'menuRelatorioRegistro',
        title: 'Exportar registros',
        icon: <Circle size={12} />,
        navLink: '/relatorio/registro'
      }
    ]
  }
]
