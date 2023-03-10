// ** Reducers Imports
import auth from "./authentication"
import layout from "./layout"
import navbar from "./navbar"
import cliente from "@src/views/adm/cliente/store"
import cliente_login from "@src/views/adm/login/store"
import hotspot from "@src/views/adm/hotspot/store"
import dataTables from "@src/views/tables/data-tables/store"
import evento from "@src/views/evento/store"
import filtro from "@src/views/filtro/store"
import url_encurtada from "@src/views/encurtador/store"
import usuario from "@src/views/usuario/store"
import plano_conexao from "@src/views/adm/plano_conexao/store"
import campanha_agendada from "@src/views/campanha_agendada/store"
import campanha_recorrente from "@src/views/campanha_recorrente/store"
import permissao_mac from "@src/views/adm/permissao_mac/store"
import bloqueio_quarto from "@src/views/bloqueio_quarto/store"
import cardapio_categoria from "@src/views/cardapio_categoria/store"
import cardapio_produto from "@src/views/cardapio_produto/store"
import pesquisa_captive from "@src/views/pesquisa_captive/store"
import publicidade from "@src/views/publicidade/store"

const rootReducer = {
  auth,
  layout,
  navbar,
  cliente,
  cliente_login,
  hotspot,
  dataTables,
  evento,
  filtro,
  usuario,
  plano_conexao,
  campanha_agendada,
  campanha_recorrente,
  permissao_mac,
  cardapio_categoria,
  cardapio_produto,
  bloqueio_quarto,
  url_encurtada,
  pesquisa_captive,
  publicidade,
}

export default rootReducer
