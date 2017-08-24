import axios from 'axios'

let headers = {
  'content-type' : 'application/json; charset=utf-8'
};    


export default {
  fetch (options) {
    return new Promise( (resolve, reject) => {
      if(!options.headers) {
        options.headers = {};
      }

      for(let prop in headers) {
        options.headers[prop] = headers[prop];
      }
      axios
        .request(options)
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