import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/denomination'
  },
  {
    path: '/nqueens',
    name: 'NQueens',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "backTracking" */ '../views/NQueens.vue')
  },
  {
    path: '/denomination',
    name: 'Denomination',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dynamicProgramming" */ '../views/Denomination.vue')
  },
  {
    path: '/matrix-chain-multiplication',
    name: 'MatrixChainMultiplication',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dynamicProgramming" */ '../views/MatrixChainMultiplication.vue')
  },
  {
    path: '/remove-duplicate-letters',
    name: 'RemoveDuplicateLetters',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "greedy" */ '../views/RemoveDuplicateLetters.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
