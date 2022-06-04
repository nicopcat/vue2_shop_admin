import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('./components/Login') },
  { path: '/home', component: () => import('./components/Home') }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _, next) => {
  if (to.path == '/login') return next();

  if (!sessionStorage.getItem('token')) {
    next('/login')
  } else { next() }
})

export default router
