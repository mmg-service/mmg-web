import { createStore } from 'vuex'
import auth from './modules/auth'
import map from './modules/map'
import restaurant from './modules/restaurant'
import search from './modules/search'
import order from './modules/order'

export default createStore({
  modules: {
    auth,
    map,
    restaurant,
    search,
    order
  }
})