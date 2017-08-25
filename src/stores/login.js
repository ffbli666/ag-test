const getInitState = function() {
  return {
    name: '',
    token: '',
    password: '',
  }
}

export default {
  state: {
    info: getInitState()
  },
  mutations: {
    login (state, data) {      
      data.password = btoa(data.password);
      state.info = data;
    }
  }
}

export {
  getInitState
}