<template>
  <div
    class="logo"
    :class="{
      'collapsed-login': isCollapsed,
    }"
  >
    <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !isCollapsed }" />
    <h2 v-show="!isCollapsed" class="title mt-0">NaiveAdmin</h2>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  const isCollapsed = inject('collapsed');
</script>

<style lang="less" scoped>
  .logo {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;
    background: rgb(0, 20, 40);
    color: #fff;
    transition: all 0.2s ease-in-out;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin-bottom: 0;
    }
  }

  .collapsed-login {
    width: 64px;
  }
</style>
