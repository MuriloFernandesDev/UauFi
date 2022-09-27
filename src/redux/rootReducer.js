// ** Reducers Imports
import auth from "./authentication"
import layout from "./layout"
import navbar from "./navbar"
import calendar from "@src/views/apps/calendar/store"
import chat from "@src/views/apps/chat/store"
import cliente from "@src/views/adm/cliente/store"
import dataTables from "@src/views/tables/data-tables/store"
import email from "@src/views/apps/email/store"
import ecommerce from "@src/views/apps/ecommerce/store"
import filtro from "@src/views/filtro/store"
import invoice from "@src/views/apps/invoice/store"
import kanban from "@src/views/apps/kanban/store"
import permissions from "@src/views/apps/roles-permissions/store"
import plano from "@src/views/users/plano/store"
import todo from "@src/views/apps/todo/store"
import users from "@src/views/apps/user/store"

const rootReducer = {
  auth,
  layout,
  navbar,
  calendar,
  chat,
  cliente,
  dataTables,
  ecommerce,
  email,
  filtro,
  invoice,
  kanban,
  permissions,
  plano,
  todo,
  users,
}

export default rootReducer
