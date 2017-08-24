export default {
  state: {
    token: { 
      name: '',
      token: '', 
    }
  },
  mutations: {
    login (state, data) {
      state.token = data;
    }
  }
}