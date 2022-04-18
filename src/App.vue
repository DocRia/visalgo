<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>Visalgo</span>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          router
        >
          <!-- 一级菜单 -->
          <el-sub-menu index="dynamic-programming">
            <template #title>
              <el-icon><collection /></el-icon>
              <span>动态规划</span>
            </template>
            <el-menu-item index="denomination">
              <template #title>
                <el-icon><files /></el-icon>
                <span>面额问题</span>
              </template>
            </el-menu-item>
            <el-menu-item index="knapsack-problem">
              <template #title>
                <el-icon><files /></el-icon>
                <span>01背包问题</span>
              </template>
            </el-menu-item>
            <el-menu-item index="matrix-chain-multiplication">
              <template #title>
                <el-icon><files /></el-icon>
                <span>矩阵链乘法</span>
              </template>
            </el-menu-item>
            <el-menu-item index="longest-common-subsequence">
              <template #title>
                <el-icon><files /></el-icon>
                <span>最长公共子序列</span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="back-tracking">
            <template #title>
              <el-icon><collection /></el-icon>
              <span>回溯法</span>
            </template>
            <el-menu-item index="nqueens">
              <template #title>
                <el-icon><files /></el-icon>
                <span>N皇后问题</span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="greedy">
            <template #title>
              <el-icon><collection /></el-icon>
              <span>贪心法</span>
            </template>
            <el-menu-item index="activity-selection">
              <template #title>
                <el-icon><files /></el-icon>
                <span>活动安排问题</span>
              </template>
            </el-menu-item>
            <el-menu-item index="remove-duplicate-letters">
              <template #title>
                <el-icon><files /></el-icon>
                <span>字符串去重</span>
              </template>
            </el-menu-item>
          </el-sub-menu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>

</script>

<style lang="less" scoped>
img {
  max-width: 100%;
  height: auto;
}

.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
