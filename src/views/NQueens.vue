<template>
  <div class="nqContainer">
    <el-row class="stepBar" v-if="showBoard">

      <el-tooltip content="自动演示" placement="top">
        <el-button size="large" type="primary" plain class="stepButton" @click="boardAutoPlay">
          <el-icon><video-play /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="暂停演示" placement="top">
        <el-button size="large" type="primary" plain class="stepButton" @click="boardPause">
          <el-icon><video-pause /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="前进" placement="top">
        <el-button size="large" type="primary" plain class="stepButton" @click="boardNextStep">
          <el-icon><d-arrow-right /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="后退" placement="top">
        <el-button size="large" type="primary" plain class="stepButton" @click="boardPrevStep">
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <div class="boardSettingContainer">
      <el-row class="boardSetting">
        <el-row>
          <span class="demonstration">请选择棋盘大小（4-10）</span>
        </el-row>
        <el-row>
          <div class="slider">
            <el-slider v-model="queenNum" show-input :max="10"> </el-slider>
          </div>
          <el-button type="primary" plain class="setBoardButton" @click="setBoard" v-if="!showBoard">确认</el-button>
          <el-button type="info" plain class="setBoardButton" @click="resetBoard" v-else>重置</el-button>
        </el-row>
      </el-row>
    </div>

    <div class="board">
      <board v-if="showBoard"></board>
      <el-tag type="warning" size="large" v-if="$store.state.isBackTracking">
        <el-icon><info-filled /></el-icon>
        开始回溯
      </el-tag>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import board from '../components/Board.vue'

const queenNum = ref(4)
const showBoard = ref(false)
const store = useStore()

const setBoard = () => {
  if (queenNum.value < 4) {
    ElMessage.error({
      message: '棋盘大小不能小于4'
    })
  } else {
    store.commit('boardInit', queenNum.value)
    showBoard.value = true
  }
}

const resetBoard = () => {
  showBoard.value = false
}

const redrawBoard = () => {
  const currBoardState = store.state.boardState[store.state.boardCurrCount]
  for (let i = 0; i < queenNum.value; i++) {
    for (let j = 0; j < queenNum.value; j++) {
      store.state.boardData[i][j] = 0
    }
  }
  for (let i = 0; i < queenNum.value; i++) {
    if (currBoardState[i] !== -1) {
      let row = currBoardState[i]
      let col = i
      // 行列
      for (let k = 0; k < queenNum.value; k++) {
        store.state.boardData[row][k] = 1
      }
      for (let k = 0; k < queenNum.value; k++) {
        store.state.boardData[k][col] = 1
      }
      // 左上
      while (true) {
        row--
        col--
        if (row >= 0 && col >= 0) {
          store.state.boardData[row][col] = 1
        } else {
          break
        }
      }
      // 右上
      row = currBoardState[i]
      col = i
      while (true) {
        row--
        col++
        if (row >= 0 && col < queenNum.value) {
          store.state.boardData[row][col] = 1
        } else {
          break
        }
      }
      // 左下
      row = currBoardState[i]
      col = i
      while (true) {
        row++
        col--
        if (row < queenNum.value && col >= 0) {
          store.state.boardData[row][col] = 1
        } else {
          break
        }
      }
      // 右下
      row = currBoardState[i]
      col = i
      while (true) {
        row++
        col++
        if (row < queenNum.value && col < queenNum.value) {
          store.state.boardData[row][col] = 1
        } else {
          break
        }
      }
      store.state.boardData[currBoardState[i]][i] = 2
    } else {
      break
    }
  }
}

const boardPrevStep = () => {
  if (store.state.boardCurrCount > 0) {
    store.state.boardCurrCount--
    redrawBoard()
  } else {
    ElMessage.warning({
      message: '已经是第一步了'
    })
  }
}

const boardNextStep = () => {
  // 判断是否有返回上一步的操作
  if (store.state.boardCurrCount < store.state.boardMaxCount) {
    store.state.boardCurrCount++
  } else {
    if (store.state.isFinished) {
      boardPause()
      return ElMessage.success({
        message: '已经是最后一步了'
      })
    }
    // 获取当前棋盘状态
    const currBoardState = [...store.state.boardState[store.state.boardCurrCount]]
    // 判断是否处于回溯状态
    if (store.state.isBackTracking) {
      for (let i = 0; i < queenNum.value; i++) {
        if (currBoardState[i] === -1) {
          // 从上一个位置开始遍历
          let j = store.state.backTrackingPosition + 1
          while (j < queenNum.value) {
            // 如果回溯列有空位，则退出回溯状态
            if (store.state.boardData[j][i] === 0) {
              currBoardState[i] = j
              store.state.isBackTracking = false
              break
            }
            j++
          }
          // 如果回溯列没有空位，则继续退回一列
          if (j === queenNum.value) {
            let count = queenNum.value - 1
            while (currBoardState[count] === -1) {
              count--
            }
            store.state.backTrackingPosition = currBoardState[count]
            currBoardState[count] = -1
          }
          break
        }
      }
      store.state.boardMaxCount++
      store.state.boardCurrCount = store.state.boardMaxCount
      store.state.boardState.push(currBoardState)
    } else {
      for (let i = 0; i < queenNum.value; i++) {
        if (currBoardState[i] === -1) {
          let j = 0
          while (j < queenNum.value) {
            if (store.state.boardData[j][i] === 0) {
              currBoardState[i] = j
              break
            }
            j++
          }
          // 如果下一列没有可以放置的位置，则进入回溯状态
          if (j === queenNum.value) {
            store.state.isBackTracking = true
          }
          break
        }
      }
      // 如果进入回溯状态，则退回一列，获取该列的行号 backTrackingPosition
      if (store.state.isBackTracking) {
        let count = queenNum.value - 1
        while (currBoardState[count] === -1) {
          count--
        }
        store.state.backTrackingPosition = currBoardState[count]
        currBoardState[count] = -1
      }
      store.state.boardMaxCount++
      store.state.boardCurrCount = store.state.boardMaxCount
      store.state.boardState.push(currBoardState)
    }
    if (currBoardState[currBoardState.length - 1] !== -1) {
      store.state.isFinished = true
    }
  }
  redrawBoard()
}

const boardPause = () => {
  if (store.state.autoPlaySetting !== 0) {
    clearInterval(store.state.autoPlaySetting)
    store.state.autoPlaySetting = 0
  }
}

const boardAutoPlay = () => {
  if (store.state.autoPlaySetting !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  store.state.autoPlaySetting = setInterval(boardNextStep, 1000)
}

</script>

<style lang="less" scoped>
.slider {
  display: flex;
  align-items: center;
}
.slider .el-slider {
  margin-top: 0;
  margin-left: 12px;
  width: 40vw;
}
.demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.boardSettingContainer {
  display: flex;
  justify-content: center;
}
.boardSetting {
  display: flex;
  align-items: center;
  align-content: center;
  margin: 30px auto;
}
.setBoardButton {
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
