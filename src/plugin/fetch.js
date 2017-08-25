import Vue from 'vue'
import axios from 'axios'

let headers = {
  'content-type' : 'application/json; charset=utf-8'
};    


let Fetch = {
  install: function (Vue, options) {
    Vue.prototype.$fetch = function (methodOptions) {
      if (!this.$store.state.login) {
        console.error('need login store');
        return;
      }
      if (this.$store.state.login.token.token) {
        headers.Authorization = this.$store.state.login.token.token;
      }
      return new Promise( (resolve, reject) => {
        if(!methodOptions.headers) {
          methodOptions.headers = {};
        }

        for(let prop in headers) {
          methodOptions.headers[prop] = headers[prop];
        }
        axios
          .request(methodOptions)
          .then(res => resolve(res))
          .catch(err => {
            let response = err.response;
            if (!response) {
              console.error(err);
              return;
            }
            reject(err);
          });
      });      
    }
  }
}


Vue.use(Fetch)

export default Fetch