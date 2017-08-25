import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Member from '@/components/Member/Member'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/member',
      name: 'Member',
      component: Member
    },
    {
      path: "*", 
      component: PageNotFound 
    }
  ]
})
