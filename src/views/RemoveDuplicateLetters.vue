<template>
  <div class="denominationContainer">
    <el-row class="step-bar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="step-button"
          @click="letterAutoPlay"
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
          @click="letterPause"
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
          @click="letterNextStep"
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
          @click="letterPrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row :gutter="30" class="removeDuplicateLetters">
      <el-col :span="6">
        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
          >Using attributes</span
        >
        <el-input v-model="str" clearable />
        <el-row class="flex-line-center">
          <el-button v-if="!isAddFinished" @click="addDeno">添加面额</el-button>
          <el-button
            type="primary"
            plain
            v-if="!isAddFinished"
            @click="showDialog"
            >完成</el-button
          >
          <el-button
            class="topBottomMargin"
            v-if="isAddFinished"
            @click="resetDeno"
            >重设面额</el-button
          >
        </el-row>
      </el-col>

      <!-- <el-col :span="5" v-show="isAddFinished">
        <el-table :data="denoData" :row-class-name="funcClassName" border fit>
          <el-table-column prop="func" label="状态转移方程F(x)=min:" />
          <el-table-column prop="funcResult" label="对应函数" />
        </el-table>
      </el-col> -->
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const str = ref('bcabc')
</script>

<style scoped>
.removeDuplicateLetters {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
