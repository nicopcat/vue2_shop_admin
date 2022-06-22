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
        path: '/rights',
        meta: { name: '权限列表' },
        component: () => import('./components/auth/AuthRights')
      },
      {
        path: '/roles',
        meta: { name: '权限角色' },
        component: () => import('./components/auth/AuthRoles')
      },
      {
        path: '/categories',
        meta: { name: '商品分类' },
        component: () => import('./components/goods/GoodsCate')
      },
      {
        path: '/params',
        meta: { name: '商品参数' },
        component: () => import('./components/goods/GoodsParams')
      },
      {
        path: '/goods',
        meta: { name: '商品列表' },
        component: () => import('./components/goods/GoodsList'),
        children: [
          {
            path: '/goods/add',
            meta: { name: '添加商品' },
            component: () => import('./components/goods/AddGoods')
          }
        ]
      },
      {
        path: '/orders',
        meta: { name: '订单管理' },
        component: () => import('./components/order/OrderList')
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
