import Vue from 'vue'
import axios from 'axios'
import { getInitState } from '@/stores/login'

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
      let loginInfo = this.$store.state.login.info;
      if (loginInfo.token) {
        //token 過期了
        if (Math.floor(Date.now() / 1000) >= loginInfo.exp) {
          return new Promise( (resolve, reject) => {
            reNewToken(this.$store)
              .then((token)=>{
                //retry
                if(!methodOptions.headers) {
                  methodOptions.headers = {};
                }
                for(let prop in headers) {
                  methodOptions.headers[prop] = headers[prop];
                }              
                methodOptions.headers.Authorization = token;
                axios
                  .request(methodOptions)
                  .then(res => resolve(res))
                  .catch(err => reject(err))
              }).catch((err)=>{
                 reject(err);
              })
          });
        }
        headers.Authorization = this.$store.state.login.info.token;
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
            if (err.response.status === 403) {
              if ((err.response.data.code === 'token_not_found' 
                || err.response.data.code === 'invalid_token')
                && loginInfo.name
                && loginInfo.password) {

                reNewToken(this.$store)
                  .then((token)=>{
                    //retry
                    methodOptions.headers.Authorization = token;
                    axios
                      .request(methodOptions)
                      .then(res => resolve(res))
                      .catch(err => reject(err))
                  }).catch((err)=>{
                     reject(err);
                  })
                return;
              }
            }
            reject(err);
          });
      });      
    }
  }
}

let reNewToken = function($store) {
  let loginInfo = $store.state.login.info;
  return new Promise((resolve, reject) => {
    axios
      .request({
        method: 'post',
        url: ' http://52.197.192.141:3443',
        data: {
          name: loginInfo.name,
          pwd: atob(loginInfo.password),
        }
      }).then((response) => {        
        $store.commit('login', {
          ...response.data.token,
          password: atob(loginInfo.password)
        });
        resolve(response.data.token.token);
      }).catch((err) => {
        $store.commit('login', getInitState());
        reject(err);
      })
  });
}
Vue.use(Fetch)

export default Fetch