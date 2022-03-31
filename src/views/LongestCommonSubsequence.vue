<template>
  <div class="denominationContainer">
    <el-row class="stepBar" v-if="isAddFinished">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          @click="subsequenceAutoPlay"
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
          @click="subsequencePause"
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
          @click="subsequenceNextStep"
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
          @click="subsequencePrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row class="subsequence-container">
      <el-col>
        <el-row class="subsequence-item-container" v-show="!isAddFinished">
          <el-form
            ref="subsequenceFormRef"
            label-width="120px"
            class="subsequence-form"
            :model="subsequenceForm"
            :rules="subsequenceRules"
            status-icon
          >
            <el-form-item label="字符串1" prop="str1">
              <el-input v-model="subsequenceForm.str1" clearable />
            </el-form-item>
            <el-form-item label="字符串2" prop="str2">
              <el-input v-model="subsequenceForm.str2" clearable />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                plain
                @click="addFinish(subsequenceFormRef)"
                v-if="!isAddFinished"
                >完成</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>

        <el-row class="subsequence-item-container">
          <el-row>
            <el-table
              border
              fit
            >
              <el-table-column label="" :width="70"></el-table-column>
              <el-table-column label="" :width="70"></el-table-column>
              <el-table-column v-for="col in strColumnList" :key="col.label" :label="col.label"></el-table-column>
            </el-table>
          </el-row>

          <el-row>
            <el-table
              :data="subsequenceDP"
              class="subsequenceDPTable"
              border
              fit
            >
              <el-table-column type="index" label="" :index="str1IndexMethod" :width="70"></el-table-column>
              <el-table-column type="index" label="s1\s2" :index="indexMethod" :width="70"></el-table-column>
              <el-table-column v-for="col in subsequenceColumnList" :key="col.prop" :prop="col.prop" :label="col.label"></el-table-column>
            </el-table>
          </el-row>
        </el-row>

        <el-row class="subsequence-item-container">
          <el-button
            @click="resetSubsequence"
            v-if="isAddFinished"
            >重置字符串</el-button
          >
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const isAddFinished = ref(false)
const subsequenceAutoPlaySetting = ref(0)
const subsequenceFormRef = ref(null)

const subsequenceColumnList = ref([])
const strColumnList = ref([])
const subsequenceDP = ref([])
const subsequenceForm = reactive({
  str1: 'bdcaba',
  str2: 'abcbdab'
})
const indexMethod = (index) => {
  return index
}
const str1IndexMethod = (index) => {
  if (index === 0) {
    return ''
  } else {
    return subsequenceForm.str1[index - 1]
  }
}
const validateStr1 = (rule, value, callback) => {
  const strReg = /^[a-z]+$/g
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (!strReg.test(value)) {
    callback(new Error('只能输入小写字母'))
  } else {
    callback()
  }
}
const validateStr2 = (rule, value, callback) => {
  const strReg = /^[a-z]+$/g
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (!strReg.test(value)) {
    callback(new Error('只能输入小写字母'))
  } else {
    callback()
  }
}
const subsequenceRules = reactive({
  str1: [{ validator: validateStr1, trigger: 'blur' }],
  str2: [{ validator: validateStr2, trigger: 'blur' }]
})
const addFinish = (subsequenceFormRef) => {
  if (!subsequenceFormRef) return
  subsequenceFormRef.validate((valid) => {
    if (valid) {
      const length1 = subsequenceForm.str1.length
      const length2 = subsequenceForm.str2.length
      for (let i = 0; i <= length1; i++) {
        const arr = Array.from({ length: length2 + 1 }, () => 0)
        subsequenceDP.value.push({ ...arr })
      }
      for (let i = 0; i <= length2; i++) {
        subsequenceColumnList.value.push({ prop: `${i}`, label: `${i}` })
        if (i === 0) {
          strColumnList.value.push({ label: ' ' })
        } else {
          strColumnList.value.push({ label: subsequenceForm.str2[i - 1] })
        }
      }
      console.log(subsequenceDP.value)
      isAddFinished.value = true
    }
  })
}

const resetSubsequence = () => {
  subsequenceDP.value = []
  subsequenceColumnList.value = []
  isAddFinished.value = false
}

// 步骤函数
const subsequenceNextStep = () => {

}

const subsequencePrevStep = () => {

}

const subsequenceAutoPlay = () => {
  if (subsequenceAutoPlaySetting.value !== 0) {
    return ElMessage.warning({
      message: '正在自动演示'
    })
  }
  subsequenceAutoPlaySetting.value = setInterval(subsequenceNextStep, 1000)
}

const subsequencePause = () => {
  if (subsequenceAutoPlaySetting.value !== 0) {
    clearInterval(subsequenceAutoPlaySetting.value)
    subsequenceAutoPlaySetting.value = 0
  }
}

</script>

<style lang="less" scoped>
.flex-line-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.subsequence-item-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.top-bottom-margin {
  margin: 20px auto;
}

.subsequenceDPTable {
  margin-bottom: 30px;
}

/deep/ .el-table__empty-block {
  display: none;
}

</style>
