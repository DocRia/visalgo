<template>
  <div class="board">
    <el-row v-for="(row, index) in $store.state.boardSize" :key="index">
      <el-tag
        v-for="(col, index) in $store.state.boardSize"
        :key="index"
        :type="$store.state.boardData[row - 1][col - 1] === 2 ? 'warning' : ''"
        class="qblock"
        effect="dark"
        size="large"
      >
      {{ $store.state.boardData[row - 1][col - 1] === 1 ? 'X' : '' }}
      </el-tag>
    </el-row>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onUnmounted(() => {
  store.commit('boardDestroy')
})
</script>

<style lang="less" scoped>
.qblock {
  width: 40px;
  height: 40px;
  margin: 2px;
}
</style>
