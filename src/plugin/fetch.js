import Vue from 'vue'
import axios from 'axios'
import { getInitState } from '@/stores/login'
import { LoginUrl } from '@/utils/api';

let headers = {
  'content-type' : 'application/json; charset=utf-8'
};    

let fetchToken = undefined;

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
            let fetchTokening; 
            if(fetchToken) {
              fetchTokening = fetchToken;
            } else {
              fetchTokening = reNewToken(this.$store);
              fetchToken = fetchTokening;
            }
            fetchTokening
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
                fetchToken = undefined;
              }).catch((err)=>{
                reject(err);
                fetchToken = undefined;
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
                || err.response.data.code === 'invalid_token')) {
                let fetchTokening; 
                if(fetchToken) {
                  fetchTokening = fetchToken;
                } else {
                  fetchTokening = reNewToken(this.$store);
                  fetchToken = fetchTokening;
                }
                fetchTokening
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
    if(!loginInfo.name || !loginInfo.password) {
      reject('no info');
      return;
    }
    axios
      .request({
        method: 'post',
        url: LoginUrl,
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