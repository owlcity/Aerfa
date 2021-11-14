<template>
  <div
    class="logo"
    :class="{
      'collapsed-login': isCollapsed,
    }"
  >
    <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !isCollapsed }" />
    <h2 v-show="!isCollapsed" class="mt-0 title">NaiveAdmin</h2>
  </div>
</template>

<script lang="ts" setup>
  import { inject, computed } from 'vue';
  import { useThemeVars } from 'naive-ui';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';

  const { getDarkTheme } = useDesignSetting();

  const isCollapsed = inject('collapsed');

  const themeVars = useThemeVars();

  const getBgColor = computed(() => {
    return getDarkTheme.value ? themeVars.value.cardColor : themeVars.value.invertedColor;
  });
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
    background: v-bind(getBgColor);
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
