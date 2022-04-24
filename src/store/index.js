import { createStore } from 'vuex'

export default createStore({
  state: {
    isFinished: false,
    isBackTracking: false,
    autoPlaySetting: 0,
    backTrackingPosition: 0,
    boardMaxCount: 0,
    boardCurrCount: 0,
    boardSize: 4,
    boardData: [],
    boardState: []
  },
  mutations: {
    boardInit (state, n) {
      state.isFinished = false
      state.isBackTracking = false
      state.autoPlaySetting = 0
      state.backTrackingPosition = 0
      state.boardSize = n
      state.boardMaxCount = 0
      state.boardCurrCount = 0
      state.boardData = []
      state.boardState = [Array.from({ length: n }, () => -1)]
      for (let i = 0; i < n; i++) {
        state.boardData.push(Array.from({ length: n }, () => 0))
      }
    },
    boardDestroy (state) {
      state.isFinished = false
      state.isBackTracking = false
      state.autoPlaySetting = 0
      state.backTrackingPosition = 0
      state.boardMaxCount = 0
      state.boardCurrCount = 0
      state.boardData = []
      state.boardState = []
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
