<template>
  <div class="activity-container-box">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          :disabled="!isAddFinished"
          @click="activityAutoPlay"
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
          @click="activityPause"
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
          @click="activityNextStep"
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
          @click="activityPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row :gutter="30" class="activity-data">
      <el-col :span="7">
        <el-row>
          <el-table :data="activityData" border fit>
            <el-table-column label="待选活动列表">
              <el-table-column prop="activityStart" label="开始" />
              <el-table-column prop="activityEnd" label="结束" />
              <el-table-column label="操作" v-if="!isAddFinished">
                <template #default="scope">
                  <el-button
                    type="text"
                    size="small"
                    v-show="!isAddFinished"
                    @click.prevent="deleteActivity(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>

      <el-col :span="7">
        <el-row v-if="!isAddFinished">
          <div class="activity-slider">
            <el-slider v-model="activityValue" range :max="30" />
          </div>
          <div class="activity-button-container top-bottom-margin">
            <el-button
              class="activity-button"
              type="info"
              plain
              @click="addActivity"
              >添加活动</el-button
            >
            <el-button
              class="activity-button"
              type="primary"
              plain
              @click="addFinish"
              >完成</el-button
            >
          </div>
        </el-row>
        <el-row v-else>
          <el-table :data="sortedActivityData" :row-class-name="funcClassName" border fit>
            <el-table-column prop="activityStart" label="开始" />
            <el-table-column prop="activityEnd" label="结束" />
          </el-table>
          <el-button
            class="top-bottom-margin"
            type="info"
            plain
            v-if="isAddFinished"
            @click="resetActivity"
            >重设活动</el-button
          >
        </el-row>
      </el-col>

      <el-col :span="7">
        <el-row class="activity-info" v-if="!isAddFinished">
          <span>{{ `活动起止：${activityValue[0]} - ${activityValue[1]}` }}</span>
        </el-row>
        <el-row v-else>
          <el-table :data="selectedActivityData" border fit>
            <el-table-column label="活动列表">
              <el-table-column prop="activityStart" label="开始" />
              <el-table-column prop="activityEnd" label="结束" />
            </el-table-column>
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
const isNextStep = ref(false)
const isPrevStep = ref(false)
const activityAutoPlaySetting = ref(0)
const activityValue = ref([4, 8])
const activityData = ref([
  { activityStart: 5, activityEnd: 7 },
  { activityStart: 3, activityEnd: 5 },
  { activityStart: 3, activityEnd: 8 },
  { activityStart: 5, activityEnd: 9 },
  { activityStart: 8, activityEnd: 11 },
  { activityStart: 8, activityEnd: 12 },
  { activityStart: 1, activityEnd: 4 },
  { activityStart: 0, activityEnd: 6 },
  { activityStart: 2, activityEnd: 13 },
  { activityStart: 6, activityEnd: 10 }
])
const sortedActivityData = ref([])
const selectedActivityData = ref([])
const step = ref(-1)

// UI函数
const funcClassName = ({ rowIndex }) => {
  if (rowIndex === step.value) {
    return 'warning-row'
  } else {
    return ''
  }
}

const addFinish = () => {
  ElMessage.info('根据活动时间进行排序')
  sortedActivityData.value = [...activityData.value].sort((a, b) => {
    return a.activityEnd - b.activityEnd
  })
  isAddFinished.value = true
}

const deleteActivity = (index) => {
  activityData.value.splice(index, 1)
}

const addActivity = () => {
  const isInputDuplicate = activityData.value.some(item => {
    return item.activityStart === activityValue.value[0] && item.activityEnd === activityValue.value[1]
  })
  if (isInputDuplicate) {
    return ElMessage.error('请不要添加重复的活动')
  } else {
    activityData.value.push({
      activityStart: activityValue.value[0],
      activityEnd: activityValue.value[1]
    })
  }
}

const resetActivity = () => {
  if (activityAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  sortedActivityData.value = []
  selectedActivityData.value = []
  isCalFinished.value = false
  isNextStep.value = false
  isPrevStep.value = false
  step.value = -1
  isAddFinished.value = false
}

// 步骤函数
const activityNextStep = () => {
  if (isCalFinished.value) {
    activityPause()
    return ElMessage.success('活动选择完成')
  }
  if (!isPrevStep.value) {
    step.value++
  }
  isPrevStep.value = false
  isNextStep.value = true
  if (step.value >= sortedActivityData.value.length) {
    isCalFinished.value = true
    step.value--
    activityPause()
    return ElMessage.success('活动选择完成')
  }
  if (step.value === 0) {
    selectedActivityData.value.push(sortedActivityData.value[0])
  } else {
    const lastEndTime = selectedActivityData.value[selectedActivityData.value.length - 1].activityEnd
    const nextStartTime = sortedActivityData.value[step.value].activityStart
    if (nextStartTime >= lastEndTime) {
      selectedActivityData.value.push(sortedActivityData.value[step.value])
    }
  }
}

const activityPrevStep = () => {
  if (step.value === 0) {
    return ElMessage.error('已经是第一步了')
  }
  if (isCalFinished.value) {
    isCalFinished.value = false
  }
  // isPrevStep.value = true
  // step.value--
  if (!isNextStep.value) {
    step.value--
  }
  isNextStep.value = false
  isPrevStep.value = true
  const isActivitySelected = selectedActivityData.value.some(item => {
    return item.activityStart === sortedActivityData.value[step.value].activityStart && item.activityEnd === sortedActivityData.value[step.value].activityEnd
  })
  if (isActivitySelected) {
    selectedActivityData.value.splice(selectedActivityData.value.length - 1, 1)
  }
}

const activityPause = () => {
  if (activityAutoPlaySetting.value !== 0) {
    clearInterval(activityAutoPlaySetting.value)
    activityAutoPlaySetting.value = 0
  }
}

const activityAutoPlay = () => {
  if (activityAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  activityAutoPlaySetting.value = setInterval(activityNextStep, 1000)
}
</script>

<style lang="less" scoped>
.activity-data{
  display: flex;
  justify-content: center;
  .flex-line-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top-bottom-margin {
    margin: 20px auto;
  }
  .activity-slider {
    width: 100%;
  }
  .activity-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .activity-button {
      margin-right: 20px;
    }
  }
  .activity-info {
    height: 30px;
    display: flex;
    justify-self: start;
    align-items: center;
  }
}
</style>
