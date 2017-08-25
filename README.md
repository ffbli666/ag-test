# ag-test

> ag test project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

##補充說明

更新 token 機制，是用 vue plugin 實作一個 $fetch 涵數，該 $fetch 涵數包裝了自家商業邏輯(第三方的另用 axios 即可)，登入用的 Authorization 和 renew token 機制均在此。

renew token 會在 token 過期或是存取 API Server 回覆 token_not_found or invalid_token 時 renew
