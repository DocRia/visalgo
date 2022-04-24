import { createStore } from 'vuex'

export default createStore({
  state: {
    boardSize: 4,
    boardData: []
  },
  mutations: {
    boardInit (state, n) {
      state.boardSize = n
      state.boardData = []
      for (let i = 0; i < n; i++) {
        state.boardData.push(Array.from({ length: n }, () => 0))
      }
    },
    boardDestroy (state) {
      state.boardData = []
    },
    boardDataChange (state, changeConfig) {
      state.boardData[changeConfig.row][changeConfig.col] = changeConfig.value
    }
  },
  actions: {
  },
  modules: {
  }
})
