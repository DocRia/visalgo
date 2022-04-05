<template>
  <div class="knapsack-container-box">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!isAddFinished"
          @click="knapsackAutoPlay"
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
          @click="knapsackPause"
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
          @click="knapsackNextStep"
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
          @click="knapsackPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row class="knapsack-container">
      <el-col :span="knapsackSpan">
        <el-row>
          <div class="top-bottom-margin">
            背包承重：
            <el-input-number
              v-model="knapsackCapacity"
              :min="1"
              :disabled="isAddFinished"
            />
          </div>
        </el-row>

        <el-table :data="knapsackItemsData" border fit>
          <el-table-column type="index" label="物品" :width="70"/>
          <el-table-column prop="weight" label="重量" />
          <el-table-column prop="value" label="价值" />
          <el-table-column label="操作" v-if="!isAddFinished">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click.prevent="deleteKnapsackItem(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <div class="top-bottom-margin">
            重量：
            <el-input-number
              v-model="knapsackWeight"
              :min="1"
            />
          </div>
        </el-row>
        <el-row>
          <div class="bottom-margin">
            价值：
            <el-input-number
              v-model="knapsackValue"
              :min="1"
            />
          </div>
        </el-row>
        <el-row class="flex-line-center">
          <el-button v-if="!isAddFinished" @click="addKnapsackItem">添加物品</el-button>
          <el-button
            type="primary"
            plain
            v-if="!isAddFinished"
            @click="addFinish"
            >完成</el-button
          >
          <el-button
            v-if="isAddFinished"
            @click="resetKnapsack"
            >重设背包</el-button
          >
        </el-row>
      </el-col>

      <el-col :span="22 - knapsackSpan">
        <el-row class="knapsack-table-container">
          <el-table
            :data="knapsackDP"
            class="knapsack-dp-table"
            border
            fit
          >
            <el-table-column type="index" label="物品\承重" :width="90"></el-table-column>
            <el-table-column v-for="col in knapsackColumnList" :key="col.prop" :prop="col.prop" :label="col.label"></el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const isAddFinished = ref(false)
const knapsackAutoPlaySetting = ref(0)

const knapsackCapacity = ref(4)
const knapsackWeight = ref(1)
const knapsackValue = ref(1)

const knapsackItemsData = ref([
  {
    weight: 1,
    value: 15
  },
  {
    weight: 3,
    value: 20
  },
  {
    weight: 4,
    value: 30
  }
])
const knapsackSpan = computed(() => isAddFinished.value ? 6 : 7)
const knapsackColumnList = ref([])
const knapsackDP = ref([])

const deleteKnapsackItem = (index) => {
  knapsackItemsData.value.splice(index, 1)
}

// 功能函数
const addKnapsackItem = () => {
  knapsackWeight.value = Number.parseInt(knapsackWeight.value)
  knapsackValue.value = Number.parseInt(knapsackValue.value)
  knapsackItemsData.value.push({
    weight: knapsackWeight.value,
    value: knapsackValue.value
  })
}
const addFinish = () => {
  if (knapsackItemsData.value.length < 3) {
    return ElMessage.error({
      message: '请至少添加三个物品'
    })
  } else {
    knapsackCapacity.value = Number.parseInt(knapsackCapacity.value)
    for (let i = 0; i < knapsackItemsData.value.length; i++) {
      const arr = Array.from({ length: knapsackCapacity.value + 1 }, () => 0)
      knapsackDP.value.push({ ...arr })
    }
    for (let i = 0; i <= knapsackCapacity.value; i++) {
      knapsackColumnList.value.push({ prop: `${i}`, label: `${i}` })
    }
    isAddFinished.value = true
  }
}

const resetKnapsack = () => {
  if (knapsackAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  knapsackColumnList.value = []
  knapsackDP.value = []
  isAddFinished.value = false
}

// 步骤函数
const knapsackNextStep = () => {
//   if (isCalFinished) {
//     knapsackPause()
//     return ElMessage.success({
//       message: `计算完成，最长公共子序列为： ${resultChar.value}`
//     })
//   }

//   if (strIndex2 > length2) {
//     strIndex1++
//     if (strIndex1 > length1) {
//       strIndex1--
//       let i1 = strIndex1
//       let i2 = strIndex2 - 1
//       while (i1 > 0 && i2 > 0) {
//         const currNode = knapsackDP.value[i1][i2]
//         const upNode = knapsackDP.value[i1 - 1][i2]
//         const leftNode = knapsackDP.value[i1][i2 - 1]
//         if ((currNode === upNode && currNode === leftNode) || (upNode > leftNode)) {
//           i1--
//         } else if (upNode < leftNode) {
//           i2--
//         } else {
//           resultPositionList.value.push([i1, i2 + 2])
//           resultChar.value += knapsackForm.str1[i1 - 1]
//           i1--
//           i2--
//         }
//       }
//       resultChar.value = resultChar.value.split('').reverse().join('')
//       isCalFinished = true
//       knapsackPause()
//       return ElMessage.success({
//         message: `计算完成，最长公共子序列为： ${resultChar.value}`
//       })
//     }
//     strIndex2 = 1
//   }
//   const char1 = knapsackForm.str1[strIndex1 - 1]
//   const char2 = knapsackForm.str2[strIndex2 - 1]
//   if (char1 === char2) {
//     knapsackDP.value[strIndex1][strIndex2] = knapsackDP.value[strIndex1 - 1][strIndex2 - 1] + 1
//   } else {
//     knapsackDP.value[strIndex1][strIndex2] = Math.max(knapsackDP.value[strIndex1 - 1][strIndex2], knapsackDP.value[strIndex1][strIndex2 - 1])
//   }
//   strIndex2++
}

const knapsackPrevStep = () => {

}

const knapsackAutoPlay = () => {
  if (knapsackAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  knapsackAutoPlaySetting.value = setInterval(knapsackNextStep, 1000)
}

const knapsackPause = () => {
  if (knapsackAutoPlaySetting.value !== 0) {
    clearInterval(knapsackAutoPlaySetting.value)
    knapsackAutoPlaySetting.value = 0
  }
}

</script>

<style lang="less" scoped>
.flex-line-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.knapsack-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .knapsack-table-container{
    margin-left: 25px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    .knapsack-dp-table {
      :deep(.el-table__empty-block) {
        display: none;
      }
    }
  }
}

.top-bottom-margin {
  margin: 20px auto;
}
.bottom-margin {
  margin-bottom: 20px;
  margin-right: auto;
  margin-left: auto;
}
</style>
