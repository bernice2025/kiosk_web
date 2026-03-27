import Depenses from '@/views/Depenses.vue'
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user: null,
      pertes: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      depenses: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      stocks: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      payments: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      ventes: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      injections: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      produits: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      clients: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
    }
  },
  getters() {

  },
  actions() {

  },
  mutations() {

  }
})
export default store