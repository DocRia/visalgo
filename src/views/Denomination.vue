<template>
  <div class="denomination-container-box">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!isAddFinished"
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
          class="step-button"
          :disabled="!isAddFinished"
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
          class="step-button"
          :disabled="!isAddFinished"
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
          class="step-button"
          :disabled="!isAddFinished"
          @click="denoPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row :gutter="30" class="deno-data">
      <el-col :span="6">
        <el-row>
          <div class="top-bottom-margin">
            总金额：
            <el-input-number
              v-model="denoAmount"
              :min="1"
              :disabled="isAddFinished"
            />
          </div>
        </el-row>
        <el-row>
          <el-table :data="denoData" border fit>
            <el-table-column prop="deno" label="面额" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  v-show="!isAddFinished"
                  @click.prevent="deleteDeno(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-input-number
            class="top-bottom-margin"
            v-if="!isAddFinished"
            v-model="denoNum"
            :min="1"
          />
        </el-row>
        <el-row class="flex-line-center">
          <el-button type="info" plain v-if="!isAddFinished" @click="addDeno">添加面额</el-button>
          <el-button
            type="primary"
            plain
            v-if="!isAddFinished"
            @click="addFinish"
            >完成</el-button
          >
          <el-button
            class="top-bottom-margin"
            type="info"
            plain
            v-if="isAddFinished"
            @click="resetDeno"
            >重设面额</el-button
          >
        </el-row>
      </el-col>

      <el-col :span="5">
        <el-table :data="denoData" :row-class-name="funcClassName"  v-show="isAddFinished" border fit>
          <el-table-column prop="func" label="状态转移方程F(x)=min:" />
          <el-table-column prop="funcResult" label="对应函数" />
        </el-table>
      </el-col>

      <el-col :span="8">
        <el-scrollbar max-height="550px" v-show="isAddFinished">
          <el-table
            :row-class-name="dpClassName"
            :data="dpData"
            height="550"
            border
            fit
          >
            <el-table-column prop="arg" label="F(x)" />
            <el-table-column prop="cost" label="选择面额" />
          </el-table>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const isAddFinished = ref(false)
const denoAutoPlaySetting = ref(0)
const calFinished = ref(false)
const denoNum = ref(1)
const denoAmount = ref(25)
const denoData = ref([
  {
    deno: 1,
    func: 'F(n-1)',
    funcResult: ''
  },
  {
    deno: 5,
    func: 'F(n-5)',
    funcResult: ''
  },
  {
    deno: 11,
    func: 'F(n-11)',
    funcResult: ''
  },
  {
    deno: 23,
    func: 'F(n-23)',
    funcResult: ''
  }
])

const dpData = ref([
  { arg: 0, cost: [] }
])
const dpDataBuffer = ref([])

// UI函数
const addFinish = () => {
  if (denoData.value.length < 3) {
    return ElMessage.error({
      message: '请至少添加三种面额'
    })
  } else if (denoData.value[0].deno !== 1) {
    return ElMessage.error({
      message: '必须设置一元面额'
    })
  } else {
    denoAmount.value = Number.parseInt(denoAmount.value)
    isAddFinished.value = true
  }
}

const deleteDeno = (index) => {
  denoData.value.splice(index, 1)
}

const addDeno = () => {
  denoNum.value = Number.parseInt(denoNum.value)
  for (const i of denoData.value) {
    if (denoNum.value === i.deno) {
      return ElMessage.error({
        message: '面额不能有重复'
      })
    }
  }
  denoData.value.push({
    deno: denoNum.value,
    func: `F(n-${denoNum.value})`,
    funcResult: ''
  })
  denoData.value.sort((a, b) => a.deno - b.deno)
}

const resetDeno = () => {
  if (denoAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  dpData.value = [
    { arg: 0, cost: [] }
  ]
  dpDataBuffer.value = []
  isAddFinished.value = false
  calFinished.value = false
}

const setFuncResult = () => {
  const step = dpData.value.length - 1
  for (const i of denoData.value) {
    if (step - i.deno >= 0) {
      i.funcResult = `F(${step - i.deno})`
    } else {
      i.funcResult = ''
    }
  }
}

// 标记函数
const dpClassName = ({ row, rowIndex }) => {
  const dpLength = dpData.value.length - 1
  for (const i of denoData.value) {
    if (rowIndex === dpLength - i.deno) {
      return 'warning-row'
    }
  }
  return ''
}
// denoSelected = dpData.value[dpData.value.length - 1].cost[dpData.value[dpData.value.length - 1].cost.length - 1]
const funcClassName = ({ row, rowIndex }) => {
  const dpLength = dpData.value.length - 1
  const currCost = dpData.value[dpLength].cost
  const denoSelected = currCost[currCost.length - 1]
  if (denoData.value[rowIndex].deno === denoSelected) {
    return 'warning-row'
  } else {
    return ''
  }
}

// 步骤函数
const denoNextStep = () => {
  if (calFinished.value) {
    denoPause()
    return ElMessage.success({
      message: `已计算完毕，选择的面额分别为：${dpData.value[dpData.value.length - 1].cost.join(',')}`
    })
  }
  const step = dpData.value.length
  if (dpDataBuffer.value.length > 0) {
    dpData.value.push(dpDataBuffer.value.pop())
  } else {
    let cost = Infinity
    let costArr = []
    for (let i = 0; i < denoData.value.length; i++) {
      if (step - denoData.value[i].deno >= 0) {
        const tempCost = dpData.value[step - denoData.value[i].deno].cost
        if (cost > tempCost.length + 1) {
          cost = tempCost.length + 1
          costArr = [...tempCost]
          costArr.push(denoData.value[i].deno)
        }
      }
    }
    dpData.value.push({
      arg: step,
      cost: costArr
    })
  }

  if (step === denoAmount.value) {
    calFinished.value = true
  }
  setFuncResult()
}

const denoPrevStep = () => {
  if (dpData.value.length === 1) {
    return ElMessage.error({
      message: '已经是第一步了'
    })
  }
  dpDataBuffer.value.push(dpData.value.pop())
  calFinished.value = false
  setFuncResult()
}

const denoPause = () => {
  if (denoAutoPlaySetting.value !== 0) {
    clearInterval(denoAutoPlaySetting.value)
    denoAutoPlaySetting.value = 0
  }
}

const denoAutoPlay = () => {
  if (denoAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  denoAutoPlaySetting.value = setInterval(denoNextStep, 1000)
}
</script>

<style scoped>
.flex-line-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.deno-data {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.top-bottom-margin {
  margin: 20px auto;
}
</style>
