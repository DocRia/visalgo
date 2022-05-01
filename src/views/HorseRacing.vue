<template>
  <div class="horse-container-box">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!isAddFinished"
          @click="horseAutoPlay"
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
          @click="horsePause"
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
          @click="horseNextStep"
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
          @click="horsePrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row :gutter="30" class="horse-data">
      <el-col :span="10">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-row>
              <el-table :data="horseDataA" border fit>
                <el-table-column label="A队">
                  <el-table-column prop="speed" label="速度" />
                  <el-table-column label="操作" v-if="!isAddFinished">
                    <template #default="scope">
                      <el-button
                        type="text"
                        size="small"
                        v-show="!isAddFinished"
                        @click.prevent="deleteHorseA(scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row class="horse-input" v-if="!isAddFinished">
              <el-input-number v-model="speedA" :min="1" :max="100"/>
            </el-row>
            <el-row class="horse-input-button" v-if="!isAddFinished">
              <el-button
                class="horse-button"
                type="info"
                plain
                @click="addHorseA"
                >添加马匹</el-button
              >
            </el-row>
          </el-col>

          <el-col :span="12">
            <el-row>
              <el-table :data="horseDataB" border fit>
                <el-table-column label="B队">
                  <el-table-column prop="speed" label="速度" />
                  <el-table-column label="操作" v-if="!isAddFinished">
                    <template #default="scope">
                      <el-button
                        type="text"
                        size="small"
                        v-show="!isAddFinished"
                        @click.prevent="deleteHorseB(scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row class="horse-input" v-if="!isAddFinished">
              <el-input-number v-model="speedB" :min="1" :max="100"/>
            </el-row>
            <el-row class="horse-input-button" v-if="!isAddFinished">
              <el-button
                class="horse-button"
                type="info"
                plain
                @click="addHorseB"
                >添加马匹</el-button
              >
            </el-row>
          </el-col>
        </el-row>
        <el-row class="finish-button-container">
          <el-col class="finish-button">
            <el-button type="primary" plain style="width:100px;" @click="addFinish" v-if="!isAddFinished">确认</el-button>
            <el-button type="info" plain style="width:100px;" @click="resetHorses" v-else>重置</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-row>
          <el-table :data="selectedHorseData" border fit v-if="isAddFinished">
            <el-table-column prop="speedA" label="速度A" />
            <el-table-column prop="speedB" label="速度B" />
            <el-table-column prop="result" label="胜负" />
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const isAddFinished = ref(false)
const isCalFinished = ref(false)
const resultText = ref('')
const horseAutoPlaySetting = ref(0)
const horseDataA = ref([
  { speed: 15 },
  { speed: 10 },
  { speed: 5 }
])
const horseDataB = ref([
  { speed: 16 },
  { speed: 11 },
  { speed: 6 }
])
const speedA = ref(5)
const speedB = ref(6)
const selectedHorseData = ref([])

// UI函数

const addFinish = () => {
  if (horseDataA.value.length !== horseDataB.value.length) {
    return ElMessage.error('马匹数量不一致')
  }
  isAddFinished.value = true
}
const resetHorses = () => {
  if (horseAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  while (selectedHorseData.value.length > 0) {
    const lastRes = selectedHorseData.value.pop()
    horseDataA.value.push({ speed: lastRes.speedA })
    horseDataB.value.push({ speed: lastRes.speedB })
  }
  horseDataA.value = [...horseDataA.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
  horseDataB.value = [...horseDataB.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
  isCalFinished.value = false
  isAddFinished.value = false
}

const deleteHorseA = (index) => {
  horseDataA.value.splice(index, 1)
}
const deleteHorseB = (index) => {
  horseDataB.value.splice(index, 1)
}

const addHorseA = () => {
  horseDataA.value.push({ speed: speedA.value })
  horseDataA.value = [...horseDataA.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
}
const addHorseB = () => {
  horseDataB.value.push({ speed: speedB.value })
  horseDataB.value = [...horseDataB.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
}

// 步骤函数
const horseNextStep = () => {
  if (isCalFinished.value) {
    horsePause()
    return ElMessage.success(resultText.value)
  }
  if (horseDataA.value.length === 0) {
    let winCount = 0
    let loseCount = 0
    for (const res of selectedHorseData.value) {
      if (res.result === '胜') {
        winCount++
      } else {
        loseCount++
      }
    }
    if (winCount === loseCount) {
      resultText.value = '比试完成，平局'
    } else {
      resultText.value = `比试完成，${winCount > loseCount ? 'A' : 'B'} 胜`
    }
    isCalFinished.value = true
    horsePause()
    return ElMessage.success(resultText.value)
  }
  if (horseDataA.value[0].speed > horseDataB.value[0].speed) {
    const firstA = horseDataA.value.shift()
    const firstB = horseDataB.value.shift()
    selectedHorseData.value.push({
      speedA: firstA.speed,
      speedB: firstB.speed,
      result: '胜'
    })
  } else if (horseDataA.value[0].speed < horseDataB.value[0].speed) {
    const lastA = horseDataA.value.pop()
    const firstB = horseDataB.value.shift()
    selectedHorseData.value.push({
      speedA: lastA.speed,
      speedB: firstB.speed,
      result: '负'
    })
  } else {
    const lastA = horseDataA.value.pop()
    if (lastA.speed > horseDataB.value[horseDataB.value.length - 1].speed) {
      const lastB = horseDataB.value.pop()
      selectedHorseData.value.push({
        speedA: lastA.speed,
        speedB: lastB.speed,
        result: '胜'
      })
    } else {
      const lastB = horseDataB.value.shift()
      selectedHorseData.value.push({
        speedA: lastA.speed,
        speedB: lastB.speed,
        result: '负'
      })
    }
  }
}

const horsePrevStep = () => {
  if (selectedHorseData.value.length === 0) {
    return ElMessage.error('已经是第一步了')
  }
  isCalFinished.value = false
  const lastRes = selectedHorseData.value.pop()
  horseDataA.value.push({ speed: lastRes.speedA })
  horseDataB.value.push({ speed: lastRes.speedB })
  horseDataA.value = [...horseDataA.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
  horseDataB.value = [...horseDataB.value].sort((prev, next) => {
    return next.speed - prev.speed
  })
}

const horsePause = () => {
  if (horseAutoPlaySetting.value !== 0) {
    clearInterval(horseAutoPlaySetting.value)
    horseAutoPlaySetting.value = 0
  }
}

const horseAutoPlay = () => {
  if (horseAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  horseAutoPlaySetting.value = setInterval(horseNextStep, 1000)
}
</script>

<style lang="less" scoped>
.horse-data{
  display: flex;
  justify-content: center;
  .horse-input,
  .horse-input-button {
    display: flex;
    justify-content: center;
    margin: 15px;
  }
  .finish-button-container {
    display: flex;
    justify-content: center;
    .finish-button {
      display: flex;
      justify-content: center;
      margin: 15px;
    }
  }
}
</style>
