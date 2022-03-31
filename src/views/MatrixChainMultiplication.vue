<template>
  <div class="denominationContainer">
    <el-row class="stepBar" v-if="isAddFinished">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="matrixChainAutoPlay"
        >
          <el-icon><video-play /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="暂停演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="matrixChainPause"
        >
          <el-icon><video-pause /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="前进" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="matrixChainNextStep"
        >
          <el-icon><d-arrow-right /></el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="后退" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="matrixChainPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row :gutter="30" class="matrix-container">
      <el-col :span="5">
        <el-table :data="matrixData" v-if="!isAddFinished" border fit>
          <el-table-column prop="dimension" label="维度" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click.prevent="deleteMatrix(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="matrixDataFull" v-else border fit>
          <el-table-column prop="mindex" label="矩阵" />
          <el-table-column prop="minfo" label="大小" />
        </el-table>

        <el-row>
          <el-input-number
            class="top-bottom-margin"
            v-if="!isAddFinished"
            v-model="dimensionInput"
            :min="1"
          />
        </el-row>
        <el-row class="flex-line-center">
          <el-button v-if="!isAddFinished" @click="addMatrix">添加维度</el-button>
          <el-button
            type="primary"
            plain
            v-if="!isAddFinished"
            @click="addFinish"
            >完成</el-button
          >
          <el-button
            class="top-bottom-margin"
            v-if="isAddFinished"
            @click="resetMatrix"
            >重设矩阵</el-button
          >
        </el-row>
      </el-col>

      <el-col :span="tableSpan" v-if="isAddFinished">
        <el-table
          :data="matrixDP"
          class="matrixDPTable"
          stripe
          border
          fit
        >
          <el-table-column label="矩阵链相乘次数">
            <el-table-column type="index" label="始\终" :width="60">
            </el-table-column>
            <el-table-column v-for="col in matrixColumnList" :key="col.prop" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table-column>
        </el-table>

        <el-table
          :data="matrixBreakDP"
          class="matrixBreakDPTable"
          stripe
          border
          fit
        >
          <el-table-column label="矩阵链分割点">
            <el-table-column type="index" label="始\终" :width="60">
            </el-table-column>
            <el-table-column v-for="col in matrixColumnList" :key="col.prop" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const isAddFinished = ref(false)
const matrixChainAutoPlaySetting = ref(0)
const dimensionInput = ref(1)
const tableSpan = ref(16)
const matrixData = ref([
  { dimension: 10 },
  { dimension: 100 },
  { dimension: 5 },
  { dimension: 50 },
  { dimension: 15 }
])
const matrixDataFull = ref([])
const matrixDP = ref([])
const matrixBreakDP = ref([])
const matrixColumnList = ref([])
let chainSpan = 1
let row = 0
let col = 0
let template = 0
let printMessage = ''
let calFinished = false

const addFinish = () => {
  if (matrixData.value.length < 4) {
    return ElMessage.error({
      message: '请至少添加三个矩阵'
    })
  } else {
    for (let i = 1; i < matrixData.value.length; i++) {
      matrixDataFull.value.push({
        mindex: `A[${i}]`,
        minfo: `[${matrixData.value[i - 1].dimension}, ${matrixData.value[i].dimension}]`
      })
    }

    for (let i = 1; i < matrixData.value.length; i++) {
      const col = {}
      matrixColumnList.value.push({ prop: `${i - 1}`, label: `${i}` })
      for (let j = 1; j < matrixData.value.length; j++) {
        col[j - 1] = 0
      }
      matrixDP.value.push({ ...col })
      matrixBreakDP.value.push({ ...col })
    }
    isAddFinished.value = true
  }
}

const resetMatrix = () => {
  if (matrixChainAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  matrixDataFull.value = []
  matrixColumnList.value = []
  matrixDP.value = []
  matrixBreakDP.value = []
  isAddFinished.value = false
  calFinished = false
  chainSpan = 1
  row = 0
  col = 0
}

const addMatrix = () => {
  dimensionInput.value = Number.parseInt(dimensionInput.value)
  matrixData.value.push({ dimension: dimensionInput.value })
}

const deleteMatrix = (index) => {
  matrixData.value.splice(index, 1)
}

const printOrder = (i, j) => {
  if (i === j) {
    printMessage += ` A[${i}] `
  } else {
    printMessage += ' ( '
    printOrder(i, matrixBreakDP.value[i - 1][j - 1])
    printOrder(matrixBreakDP.value[i - 1][j - 1] + 1, j)
    printMessage += ' ) '
  }
}

// const cellStyle = ({ rowIndex, columnIndex }) => {
//   if (rowIndex < 3) {
//     return {
//       background: 'oldlace'
//     }
//   }
// }

// 步骤函数
const matrixChainNextStep = () => {
  if (calFinished) {
    matrixChainPause()
    return ElMessage.success({
      message: '计算完成：' + printMessage
    })
  }
  if (row === matrixData.value.length - chainSpan - 1) {
    chainSpan++
    row = 0
  }
  if (chainSpan === matrixData.value.length - 1) {
    calFinished = true
    matrixChainPause()
    printMessage = ''
    printOrder(1, chainSpan)
    printMessage = printMessage.slice(2, -3)
    return ElMessage.success({
      message: '计算完成：' + printMessage
    })
  }
  col = row + chainSpan
  matrixDP.value[row][col] = Number.MAX_SAFE_INTEGER
  for (let k = row; k <= col - 1; k++) {
    template = matrixDP.value[row][k] + matrixDP.value[k + 1][col] + matrixData.value[row].dimension * matrixData.value[k + 1].dimension * matrixData.value[col + 1].dimension
    if (template < matrixDP.value[row][col]) {
      matrixDP.value[row][col] = template
      matrixBreakDP.value[row][col] = k + 1
    }
  }
  let currMessage = ' ( '
  for (let m = row; m <= col; m++) {
    currMessage += ` A[${m + 1}] `
    if (m === matrixBreakDP.value[row][col] - 1) {
      currMessage += ' )( '
    }
  }
  currMessage += ' ) '
  ElMessage.success({
    message: currMessage
  })
  row++
}

const matrixChainPrevStep = () => {
  if (matrixChainAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  if (calFinished) {
    calFinished = false
  }
  if (row === 0) {
    if (chainSpan === 1) {
      return ElMessage.error({
        message: '已经是第一步了'
      })
    }
    row = matrixData.value.length - chainSpan - 1
    chainSpan--
  } else {
    row--
  }
  col = row + chainSpan
  matrixDP.value[row][col] = 0
  matrixBreakDP.value[row][col] = 0
}

const matrixChainAutoPlay = () => {
  if (matrixChainAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  matrixChainAutoPlaySetting.value = setInterval(matrixChainNextStep, 1000)
}

const matrixChainPause = () => {
  if (matrixChainAutoPlaySetting.value !== 0) {
    clearInterval(matrixChainAutoPlaySetting.value)
    matrixChainAutoPlaySetting.value = 0
  }
}

</script>

<style lang="less" scoped>
.flex-line-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.matrix-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.top-bottom-margin {
  margin: 20px auto;
}

.matrixDPTable {
  margin-bottom: 30px;
}

</style>
