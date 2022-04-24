<template>
  <div class="n-chesss-container-box">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!showBoard"
          @click="boardAutoPlay"
        >
          <el-icon><video-play /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="暂停演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!showBoard"
          @click="boardPause"
        >
          <el-icon><video-pause /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="前进" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!showBoard"
          @click="boardNextStep"
        >
          <el-icon><d-arrow-right /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="后退" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!showBoard"
          @click="boardPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <div class="chess-board-setting-container">
      <el-row class="chess-board-setting">
        <el-row>
          <span class="demonstration">请选择棋盘大小： </span>
        </el-row>
        <el-row>
          <el-select v-model="chessNum" placeholder="请选择棋盘大小">
            <el-option
              v-for="item in chessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" plain class="set-chess-board-button" @click="setBoard" v-if="!showBoard">确认</el-button>
          <el-button type="info" plain class="set-chess-board-button" @click="resetBoard" v-else>重置</el-button>
        </el-row>
      </el-row>
    </div>

    <div class="chess-board">
      <board v-if="showBoard"></board>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import board from '../components/Board.vue'

const isCalFinished = ref(false)
const isFullCal = ref(false)
const chessAutoPlaySetting = ref(0)
const chessNum = ref('8')
const chessBoardSize = ref(0)
const showBoard = ref(false)
const boardTree = ref([])
const currBlock = ref({})
const currLevel = ref(0)
const currIndex = ref(0)
const chessOptions = [
  {
    value: '4',
    label: '4 * 4'
  },
  {
    value: '8',
    label: '8 * 8'
  },
  {
    value: '16',
    label: '16 * 16'
  }
]
const coverPieces = ref([])
const coverPiecesBuffer = ref([])
const store = useStore()

const setBoard = () => {
  chessBoardSize.value = Number.parseInt(chessNum.value)
  store.commit('boardInit', chessBoardSize.value)
  const specialRow = Math.floor(Math.random() * chessBoardSize.value)
  const specialCol = Math.floor(Math.random() * chessBoardSize.value)
  store.commit('boardDataChange', {
    row: specialRow,
    col: specialCol,
    value: 2
  })
  boardTree.value.push([{
    id: 0,
    size: chessBoardSize.value,
    start: [0, 0],
    end: [chessBoardSize.value - 1, chessBoardSize.value - 1]
  }])
  let currSize = chessBoardSize.value / 2
  let currTreeLevel = 0
  while (currSize >= 2) {
    const temp = []
    for (const i of boardTree.value[currTreeLevel]) {
      temp.push({
        id: 0,
        size: currSize,
        start: [i.start[0], i.start[1]],
        end: [i.start[0] + i.end[0] >> 1, i.start[1] + i.end[1] >> 1]
      })
      temp.push({
        id: 1,
        size: currSize,
        start: [(i.start[0] + i.end[0] >> 1) + 1, i.start[1]],
        end: [i.end[0], i.start[1] + i.end[1] >> 1]
      })
      temp.push({
        id: 2,
        size: currSize,
        start: [i.start[0], (i.start[1] + i.end[1] >> 1) + 1],
        end: [i.start[0] + i.end[0] >> 1, i.end[1]]
      })
      temp.push({
        id: 3,
        size: currSize,
        start: [(i.start[0] + i.end[0] >> 1) + 1, (i.start[1] + i.end[1] >> 1) + 1],
        end: [i.end[0], i.end[1]]
      })
    }
    boardTree.value.push(temp)
    currSize = currSize / 2
    currTreeLevel++
  }
  currBlock.value = boardTree.value[0][0]
  currLevel.value = 0
  currIndex.value = 0
  showBoard.value = true
}

const resetBoard = () => {
  boardTree.value = []
  coverPieces.value = []
  coverPiecesBuffer.value = []
  isFullCal.value = false
  isCalFinished.value = false
  showBoard.value = false
}

const boardPrevStep = () => {
  if (coverPieces.value.length === 0) {
    return ElMessage.error('已经是第一步了')
  }
  isCalFinished.value = false
  const pointSet = coverPieces.value.pop()
  coverPiecesBuffer.value.push(pointSet)
  for (const point of pointSet) {
    store.commit('boardDataChange', {
      row: point[0],
      col: point[1],
      value: 0
    })
  }
}

const boardNextStep = () => {
  if (isCalFinished.value) {
    boardPause()
    return ElMessage.success({
      message: '覆盖完成'
    })
  }
  if (coverPiecesBuffer.value.length > 0) {
    const pointSet = coverPiecesBuffer.value.pop()
    coverPieces.value.push(pointSet)
    for (const point of pointSet) {
      store.commit('boardDataChange', {
        row: point[0],
        col: point[1],
        value: 2
      })
    }
    if (isFullCal.value && coverPiecesBuffer.value.length === 0) {
      isCalFinished.value = true
      boardPause()
      return ElMessage.success({
        message: '覆盖完成'
      })
    }
  } else if (currBlock.value.size === 2) {
    const temp = []
    for (let i = currBlock.value.start[0]; i <= currBlock.value.end[0]; i++) {
      for (let j = currBlock.value.start[1]; j <= currBlock.value.end[1]; j++) {
        if (store.state.boardData[i][j] !== 2) {
          store.commit('boardDataChange', {
            row: i,
            col: j,
            value: 2
          })
          temp.push([i, j])
        }
      }
    }
    coverPieces.value.push(temp)
    if (currBlock.value.id < 3) {
      currIndex.value++
      currBlock.value = boardTree.value[currLevel.value][currIndex.value]
    } else {
      currLevel.value--
      currIndex.value = currIndex.value >> 2
      while (boardTree.value[currLevel.value][currIndex.value].size !== chessBoardSize.value && boardTree.value[currLevel.value][currIndex.value].id === 3) {
        currLevel.value--
        currIndex.value = currIndex.value >> 2
      }
      if (boardTree.value[currLevel.value][currIndex.value].size === chessBoardSize.value) {
        isFullCal.value = true
        isCalFinished.value = true
        boardPause()
        return ElMessage.success({
          message: '覆盖完成'
        })
      } else {
        currIndex.value++
        currBlock.value = boardTree.value[currLevel.value][currIndex.value]
      }
    }
  } else {
    let currID = 0
    for (let i = currBlock.value.start[0]; i <= currBlock.value.end[0]; i++) {
      for (let j = currBlock.value.start[1]; j <= currBlock.value.end[1]; j++) {
        if (store.state.boardData[i][j] === 2) {
          if (i > currBlock.value.start[0] + currBlock.value.end[0] >> 1) {
            currID += 1
          }
          if (j > currBlock.value.start[1] + currBlock.value.end[1] >> 1) {
            currID += 2
          }
          if (currID === 0) {
            const point = boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].end
            store.commit('boardDataChange', {
              row: point[0] + 1,
              col: point[1],
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0],
              col: point[1] + 1,
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0] + 1,
              col: point[1] + 1,
              value: 2
            })
            coverPieces.value.push([[point[0] + 1, point[1]], [point[0], point[1] + 1], [point[0] + 1, point[1] + 1]])
          } else if (currID === 1) {
            const point = [boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].start[0], boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].end[1]]
            store.commit('boardDataChange', {
              row: point[0] - 1,
              col: point[1],
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0],
              col: point[1] + 1,
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0] - 1,
              col: point[1] + 1,
              value: 2
            })
            coverPieces.value.push([[point[0] - 1, point[1]], [point[0], point[1] + 1], [point[0] - 1, point[1] + 1]])
          } else if (currID === 2) {
            const point = [boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].end[0], boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].start[1]]
            store.commit('boardDataChange', {
              row: point[0] + 1,
              col: point[1],
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0],
              col: point[1] - 1,
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0] + 1,
              col: point[1] - 1,
              value: 2
            })
            coverPieces.value.push([[point[0] + 1, point[1]], [point[0], point[1] - 1], [point[0] + 1, point[1] - 1]])
          } else if (currID === 3) {
            const point = boardTree.value[currLevel.value + 1][currIndex.value * 4 + currID].start
            store.commit('boardDataChange', {
              row: point[0] - 1,
              col: point[1],
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0],
              col: point[1] - 1,
              value: 2
            })
            store.commit('boardDataChange', {
              row: point[0] - 1,
              col: point[1] - 1,
              value: 2
            })
            coverPieces.value.push([[point[0] - 1, point[1]], [point[0], point[1] - 1], [point[0] - 1, point[1] - 1]])
          }
          currLevel.value++
          currIndex.value = currIndex.value * 4
          currBlock.value = boardTree.value[currLevel.value][currIndex.value]
          return
        }
      }
    }
  }
}

const boardPause = () => {
  if (chessAutoPlaySetting.value !== 0) {
    clearInterval(chessAutoPlaySetting.value)
    chessAutoPlaySetting.value = 0
  }
}

const boardAutoPlay = () => {
  if (chessAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  chessAutoPlaySetting.value = setInterval(boardNextStep, 1000)
}

</script>

<style lang="less" scoped>
.demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 32px;
  flex: 1;
}

.chess-board-setting-container {
  display: flex;
  justify-content: center;
}
.chess-board-setting {
  display: flex;
  align-items: center;
  align-content: center;
  margin: 30px auto;
}
.set-chess-board-button {
  margin-left: 20px;
}

.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  margin: 30px auto;
}
</style>
