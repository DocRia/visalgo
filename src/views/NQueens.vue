<template>
  <div class="n-queens-container-box">
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

    <div class="board-setting-container">
      <el-row class="board-setting">
        <el-row>
          <span class="demonstration">请选择棋盘大小（4-10）</span>
        </el-row>
        <el-row>
          <div class="slider">
            <el-slider v-model="queenNum" show-input :max="10"> </el-slider>
          </div>
          <el-button type="primary" plain class="set-board-button" @click="setBoard" v-if="!showBoard">确认</el-button>
          <el-button type="info" plain class="set-board-button" @click="resetBoard" v-else>重置</el-button>
        </el-row>
      </el-row>
    </div>

    <div class="board">
      <board v-if="showBoard"></board>
      <el-tag type="warning" size="large" v-if="isBackTracking">
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

const isCalFinished = ref(false)
const isBackTracking = ref(false)
const boardMaxCount = ref(0)
const boardCurrCount = ref(0)
const backTrackingPosition = ref(0)
const nqAutoPlaySetting = ref(0)
const queenNum = ref(4)
const showBoard = ref(false)
const boardState = ref([])
const store = useStore()

const setBoard = () => {
  if (queenNum.value < 4) {
    ElMessage.error({
      message: '棋盘大小不能小于4'
    })
  } else {
    store.commit('boardInit', queenNum.value)
    boardState.value = [Array.from({ length: queenNum.value }, () => -1)]
    showBoard.value = true
  }
}

const resetBoard = () => {
  if (nqAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  isBackTracking.value = false
  isCalFinished.value = false
  boardMaxCount.value = 0
  boardCurrCount.value = 0
  backTrackingPosition.value = 0
  boardState.value = []
  showBoard.value = false
}

const redrawBoard = () => {
  const currBoardState = boardState.value[boardCurrCount.value]
  for (let i = 0; i < queenNum.value; i++) {
    for (let j = 0; j < queenNum.value; j++) {
      store.commit('boardDataChange', {
        row: i,
        col: j,
        value: 0
      })
    }
  }
  for (let i = 0; i < queenNum.value; i++) {
    if (currBoardState[i] !== -1) {
      let row = currBoardState[i]
      let col = i
      // 行列
      for (let k = 0; k < queenNum.value; k++) {
        store.commit('boardDataChange', {
          row: row,
          col: k,
          value: 1
        })
      }
      for (let k = 0; k < queenNum.value; k++) {
        store.commit('boardDataChange', {
          row: k,
          col: col,
          value: 1
        })
      }
      // 左上
      while (true) {
        row--
        col--
        if (row >= 0 && col >= 0) {
          store.commit('boardDataChange', {
            row: row,
            col: col,
            value: 1
          })
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
          store.commit('boardDataChange', {
            row: row,
            col: col,
            value: 1
          })
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
          store.commit('boardDataChange', {
            row: row,
            col: col,
            value: 1
          })
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
          store.commit('boardDataChange', {
            row: row,
            col: col,
            value: 1
          })
        } else {
          break
        }
      }
      store.commit('boardDataChange', {
        row: currBoardState[i],
        col: i,
        value: 2
      })
    } else {
      break
    }
  }
}

const boardPrevStep = () => {
  if (boardCurrCount.value > 0) {
    boardCurrCount.value--
    redrawBoard()
  } else {
    ElMessage.warning({
      message: '已经是第一步了'
    })
  }
}

const boardNextStep = () => {
  // 判断是否有返回上一步的操作
  if (boardCurrCount.value < boardMaxCount.value) {
    boardCurrCount.value++
  } else {
    if (isCalFinished.value) {
      boardPause()
      return ElMessage.success({
        message: '已经是最后一步了'
      })
    }
    // 获取当前棋盘状态
    const currBoardState = [...boardState.value[boardCurrCount.value]]
    // 判断是否处于回溯状态
    if (isBackTracking.value) {
      for (let i = 0; i < queenNum.value; i++) {
        if (currBoardState[i] === -1) {
          // 从上一个位置开始遍历
          let j = backTrackingPosition.value + 1
          while (j < queenNum.value) {
            // 如果回溯列有空位，则退出回溯状态
            if (store.state.boardData[j][i] === 0) {
              currBoardState[i] = j
              isBackTracking.value = false
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
            backTrackingPosition.value = currBoardState[count]
            currBoardState[count] = -1
          }
          break
        }
      }
      boardMaxCount.value++
      boardCurrCount.value = boardMaxCount.value
      boardState.value.push(currBoardState)
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
            isBackTracking.value = true
          }
          break
        }
      }
      // 如果进入回溯状态，则退回一列，获取该列的行号 backTrackingPosition
      if (isBackTracking.value) {
        let count = queenNum.value - 1
        while (currBoardState[count] === -1) {
          count--
        }
        backTrackingPosition.value = currBoardState[count]
        currBoardState[count] = -1
      }
      boardMaxCount.value++
      boardCurrCount.value = boardMaxCount.value
      boardState.value.push(currBoardState)
    }
    if (currBoardState[currBoardState.length - 1] !== -1) {
      isCalFinished.value = true
    }
  }
  redrawBoard()
}

const boardPause = () => {
  if (nqAutoPlaySetting.value !== 0) {
    clearInterval(nqAutoPlaySetting.value)
    nqAutoPlaySetting.value = 0
  }
}

const boardAutoPlay = () => {
  if (nqAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  nqAutoPlaySetting.value = setInterval(boardNextStep, 1000)
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

.board-setting-container {
  display: flex;
  justify-content: center;
}
.board-setting {
  display: flex;
  align-items: center;
  align-content: center;
  margin: 30px auto;
}
.set-board-button {
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
