<template>
  <div class="denominationContainer">
    <el-row class="stepBar" v-if="isAddFinished">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="denoAutoPlay"
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
          @click="denoPause"
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
          @click="denoNextStep"
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
          @click="denoPrevStep"
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
            v-model="dimensionNum"
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

      <el-col :span="15" v-if="isAddFinished">
        <el-table
          :data="matrixDP"
          border
          fit
        >
          <el-table-column v-for="col in matrixDP" :key="col.title" :label="col.title">
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
const dimensionNum = ref(1)
const matrixData = ref([
  { dimension: 10 },
  { dimension: 100 },
  { dimension: 5 },
  { dimension: 50 }
])
const matrixDataFull = ref([])
const matrixDP = ref([])

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
    const firstCol = { title: '行\\列' }
    for (let i = 1; i < matrixData.value.length; i++) {
      Reflect.defineProperty(firstCol, `row${String.fromCharCode(64 + i)}`, {
        value: i
      })
    }
    matrixDP.value.push(firstCol)
    for (let i = 1; i < matrixData.value.length; i++) {
      const col = { title: `${i}` }
      for (let j = 1; j < matrixData.value.length; j++) {
        Reflect.defineProperty(col, `row${String.fromCharCode(64 + j)}`, {
          value: 0
        })
      }
      matrixDP.value.push(col)
    }
    console.log(matrixDP.value)
    isAddFinished.value = true
  }
}

const resetMatrix = () => {
  matrixDataFull.value = []
  isAddFinished.value = false
}

const addMatrix = () => {
  dimensionNum.value = Number.parseInt(dimensionNum.value)
  matrixData.value.push({ dimension: dimensionNum.value })
}

const deleteMatrix = (index) => {
  matrixData.value.splice(index, 1)
}

</script>

<style scoped>
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
</style>
