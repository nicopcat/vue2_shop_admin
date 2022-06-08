import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('./components/LoginPage') },
  {
    path: '/home',
    meta: { name: '首页' },
    component: () => import('./components/HomePage'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        meta: { name: '欢迎' },
        component: () => import('./components/HomeWelcome')
      },
      {
        path: '/users',
        meta: { name: '用户列表' },
        component: () => import('./components/users/UserList')
      },
      {
        path: '/roles',
        meta: { name: '权限角色' },
        component: () => import('./components/admin/AdminRoles')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _, next) => {
  if (to.path === '/login') return next()

  if (!sessionStorage.getItem('token')) {
    next('/login')
  } else { next() }
})

Vue.use(VueRouter)
export default router