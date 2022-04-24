import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
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
    path: '/longest-common-subsequence',
    name: 'LongestCommonSubsequence',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dynamicProgramming" */ '../views/LongestCommonSubsequence.vue')
  },
  {
    path: '/knapsack-problem',
    name: 'KnapsackProblem',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "dynamicProgramming" */ '../views/KnapsackProblem.vue')
  },
  {
    path: '/activity-selection',
    name: 'ActivitySelection',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "greedy" */ '../views/ActivitySelection.vue')
  },
  {
    path: '/chess-board-cover',
    name: 'ChessBoardCover',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "divideAndConquer" */ '../views/ChessBoardCover.vue')
  },
  {
    path: '/',
    redirect: '/chess-board-cover'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
