<template>
  <div class="denominationContainer">
    <el-row class="stepBar">
      <el-tooltip content="自动演示" placement="top">
        <el-button
          size="large"
          type="primary"
          plain
          class="stepButton"
          :disabled="!isAddFinished"
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
          :disabled="!isAddFinished"
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
          :disabled="!isAddFinished"
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
          :disabled="!isAddFinished"
          @click="subsequencePrevStep"
        >
          <el-icon><d-arrow-left /></el-icon>
        </el-button>
      </el-tooltip>
    </el-row>

    <el-row class="subsequence-container">
      <el-col>
        <el-row class="subsequence-item-container" v-if="!isAddFinished">
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

        <el-row class="subsequence-item-container subsequence-table-container" v-else>
          <div class="full-width-container">
            <el-row>
              <el-table
                class="subsequence-title-table"
                border
                fit
              >
                <el-table-column label="" :width="70"></el-table-column>
                <el-table-column label="" :width="70"></el-table-column>
                <el-table-column v-for="col in strColumnList" :key="col.label" :label="col.label"></el-table-column>
              </el-table>
            </el-row>
          </div>

          <div class="full-width-container">
            <el-row>
              <el-table
                :data="subsequenceDP"
                :cell-style="cellStyle"
                class="subsequence-dp-table"
                border
                fit
              >
                <el-table-column type="index" label="" :index="str1IndexMethod" :width="70"></el-table-column>
                <el-table-column type="index" label="s1\s2" :index="indexMethod" :width="70"></el-table-column>
                <el-table-column v-for="col in subsequenceColumnList" :key="col.prop" :prop="col.prop" :label="col.label"></el-table-column>
              </el-table>
            </el-row>
          </div>
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

const resultChar = ref('')
const resultPositionList = ref([])
const strColumnList = ref([])
const subsequenceColumnList = ref([])
const subsequenceDP = ref([])
const subsequenceForm = reactive({
  str1: 'bdcab',
  str2: 'bcb'
})

let strIndex1 = 1
let strIndex2 = 1
let length1 = 0
let length2 = 0
let isCalFinished = false

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
const cellStyle = ({ rowIndex, columnIndex }) => {
  for (const [r, c] of resultPositionList.value) {
    if (r === rowIndex && c === columnIndex) {
      return {
        background: '#f0f9eb'
      }
    }
  }
  if (rowIndex >= 0 && columnIndex >= 2) {
    return {
      background: 'oldlace'
    }
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

// 功能函数
const addFinish = (subsequenceFormRef) => {
  if (!subsequenceFormRef) return
  subsequenceFormRef.validate((valid) => {
    if (valid) {
      length1 = subsequenceForm.str1.length
      length2 = subsequenceForm.str2.length
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
      isAddFinished.value = true
    }
  })
}

const resetSubsequence = () => {
  if (subsequenceAutoPlaySetting.value !== 0) {
    return ElMessage.error({
      message: '请暂停自动演示或等待演示完成'
    })
  }
  resultPositionList.value = []
  strColumnList.value = []
  subsequenceDP.value = []
  subsequenceColumnList.value = []
  resultChar.value = ''
  length1 = 0
  length2 = 0
  strIndex1 = 1
  strIndex2 = 1
  isCalFinished = false
  isAddFinished.value = false
}

// 步骤函数
const subsequenceNextStep = () => {
  if (isCalFinished) {
    subsequencePause()
    return ElMessage.success({
      message: `计算完成，最长公共子序列为： ${resultChar.value}`
    })
  }

  if (strIndex2 > length2) {
    strIndex1++
    if (strIndex1 > length1) {
      strIndex1--
      let i1 = strIndex1
      let i2 = strIndex2 - 1
      while (i1 > 0 && i2 > 0) {
        const currNode = subsequenceDP.value[i1][i2]
        const upNode = subsequenceDP.value[i1 - 1][i2]
        const leftNode = subsequenceDP.value[i1][i2 - 1]
        if ((currNode === upNode && currNode === leftNode) || (upNode > leftNode)) {
          i1--
        } else if (upNode < leftNode) {
          i2--
        } else {
          resultPositionList.value.push([i1, i2 + 2])
          resultChar.value += subsequenceForm.str1[i1 - 1]
          i1--
          i2--
        }
      }
      resultChar.value = resultChar.value.split('').reverse().join('')
      isCalFinished = true
      subsequencePause()
      return ElMessage.success({
        message: `计算完成，最长公共子序列为： ${resultChar.value}`
      })
    }
    strIndex2 = 1
  }
  const char1 = subsequenceForm.str1[strIndex1 - 1]
  const char2 = subsequenceForm.str2[strIndex2 - 1]
  if (char1 === char2) {
    subsequenceDP.value[strIndex1][strIndex2] = subsequenceDP.value[strIndex1 - 1][strIndex2 - 1] + 1
  } else {
    subsequenceDP.value[strIndex1][strIndex2] = Math.max(subsequenceDP.value[strIndex1 - 1][strIndex2], subsequenceDP.value[strIndex1][strIndex2 - 1])
  }
  strIndex2++
}

const subsequencePrevStep = () => {
  if (isCalFinished) {
    resultChar.value = ''
    resultPositionList.value = []
    isCalFinished = false
  }
  if (strIndex2 === 1) {
    if (strIndex1 === 1) {
      return ElMessage.error({
        message: '已经是第一步了'
      })
    } else {
      strIndex2 = length2
      strIndex1--
    }
  } else {
    strIndex2--
  }
  subsequenceDP.value[strIndex1][strIndex2] = 0
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
  .full-width-container{
    width: 100%;
    display: flex;
    justify-content: center;
    .subsequence-dp-table {
      /deep/ .el-table__empty-block {
        display: none;
      }
    }
    .subsequence-title-table{
      /deep/ .el-table__empty-block {
        display: none;
      }
    }
  }
}

.top-bottom-margin {
  margin: 20px auto;
}
</style>
