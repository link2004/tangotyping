import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user){
      state.user = user;
    },
  },
  actions: {

  },
  modules: {

  }
})

export default store