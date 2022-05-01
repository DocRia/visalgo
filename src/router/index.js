import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index.js'

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
    path: '/horse-racing',
    name: 'HorseRacing',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "greedy" */ '../views/HorseRacing.vue')
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
    redirect: '/nqueens'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'NQueens') {
    store.commit('headerTitleChange', 'N皇后问题')
  } else if (to.name === 'Denomination') {
    store.commit('headerTitleChange', '面额问题')
  } else if (to.name === 'KnapsackProblem') {
    store.commit('headerTitleChange', '01背包问题')
  } else if (to.name === 'MatrixChainMultiplication') {
    store.commit('headerTitleChange', '矩阵链乘法')
  } else if (to.name === 'LongestCommonSubsequence') {
    store.commit('headerTitleChange', '最长公共子序列')
  } else if (to.name === 'ActivitySelection') {
    store.commit('headerTitleChange', '活动安排问题')
  } else if (to.name === 'HorseRacing') {
    store.commit('headerTitleChange', '田忌赛马')
  } else if (to.name === 'ChessBoardCover') {
    store.commit('headerTitleChange', '棋盘覆盖问题')
  }
  next()
})

export default router
