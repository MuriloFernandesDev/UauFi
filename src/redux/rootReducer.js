// ** Reducers Imports
import auth from "./authentication"
import layout from "./layout"
import navbar from "./navbar"
import cliente from "@src/views/adm/cliente/store"
import dataTables from "@src/views/tables/data-tables/store"
import evento from "@src/views/evento/store"
import filtro from "@src/views/filtro/store"
import gerenciar from "@src/views/users/gerenciar/store"
import plano from "@src/views/users/plano/store"

const rootReducer = {
  auth,
  layout,
  navbar,
  cliente,
  dataTables,
  evento,
  filtro,
  gerenciar,
  plano,
}

export default rootReducer
