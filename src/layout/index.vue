<template>
  <n-layout embedded class="layout" :position="fixeBody" has-sider>
    <n-layout-sider
      v-if="isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')"
      show-trigger="bar"
      @collapse="collapsed = true"
      :position="fixeLeftSider"
      @expand="collapsed = false"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      class="layout-sider"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>

    <n-layout embedded :inverted="inverted">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
        <PageHeader v-model:collapsed="collapsed" :inverted="inverted" />
        <TabsView v-if="isMultiTabs" v-model:collapsed="collapsed" />
      </n-layout-header>

      <n-layout
        embedded
        :inverted="inverted"
        :native-scrollbar="false"
        class="layout-content"
        :class="{
          'layout-content-fix': fixedHeader === 'absolute',
          'layout-content-inverted': getDarkTheme,
          noMultiTabs: !isMultiTabs,
        }"
      >
        <div class="layout-content-main">
          <div class="main-view">
            <MainView />
          </div>
        </div>
        <!--1.15废弃，没啥用，占用操作空间-->
        <!--        <NLayoutFooter v-if="getShowFooter">-->
        <!--          <PageFooter />-->
        <!--        </NLayoutFooter>-->
      </n-layout>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, onMounted, watch } from 'vue';
  import { Logo } from './components/Logo';
  import { TabsView } from './components/TagsView';
  import { MainView } from './components/Main';
  import { AsideMenu } from './components/Menu';
  import { PageHeader } from './components/Header';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';
  import { useLoadingBar } from 'naive-ui';
  import { useRoute } from 'vue-router';
  import { useEventListener } from '@vueuse/core';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';

  const { getDarkTheme } = useDesignSetting();
  const {
    getNavMode,
    getNavTheme,
    getHeaderSetting,
    getBodySetting,
    getMenuSetting,
    getMultiTabsSetting,
  } = useProjectSetting();

  const settingStore = useProjectSettingStore();

  const navMode = getNavMode;

  const collapsed = ref<boolean>(false);

  watch(
    () => collapsed.value,
    (to) => {
      settingStore.setMenuSetting({ collapsed: to });
    },
    { immediate: true }
  );

  //固定顶部
  const fixedHeader = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'absolute' : 'static';
  });

  //固定主体区域
  const fixeBody = computed(() => {
    const { fixed } = unref(getBodySetting);
    return fixed ? 'absolute' : 'static';
  });

  //固定侧边栏
  const fixeLeftSider = computed(() => {
    const { fixed } = unref(getMenuSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMixMenuNoneSub = computed(() => {
    const mixMenu = settingStore.menuSetting.mixMenu;
    const currentRoute = useRoute();
    if (unref(navMode) != 'horizontal-mix') return true;
    if (unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot) {
      return false;
    }
    return true;
  });

  const fixedMenu = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMultiTabs = computed(() => {
    return unref(getMultiTabsSetting).show;
  });

  const fixedMulti = computed(() => {
    return unref(getMultiTabsSetting).fixed;
  });

  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme));
  });

  const getHeaderInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted);
  });

  const leftMenuWidth = computed(() => {
    const { minMenuWidth, menuWidth } = unref(getMenuSetting);
    return collapsed.value ? minMenuWidth : menuWidth;
  });

  const getChangeStyle = computed(() => {
    const { minMenuWidth, menuWidth } = unref(getMenuSetting);
    return {
      'padding-left': collapsed.value ? `${minMenuWidth}px` : `${menuWidth}px`,
    };
  });

  const getMenuLocation = computed(() => {
    return 'left';
  });

  const watchWidth = () => {
    const isFullScreen =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenElement;
    if (isFullScreen) return;
    const Width = document.body.clientWidth;
    if (Width < 750) {
      collapsed.value = true;
    }
  };

  onMounted(() => {
    window.addEventListener('resize', watchWidth);
  });
</script>

<style lang="less" scoped>
  .layout {
    .layout-sider {
      min-height: 100vh;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      position: relative;
      z-index: 13;
      transition: all 0.2s ease-in-out;
    }

    .layout-sider-fix {
      position: fixed;
      top: 0;
      left: 0;
    }

    .ant-layout {
      overflow: hidden;
    }

    .layout-right-fix {
      overflow-x: hidden;
      padding-left: 200px;
      min-height: 100vh;
      transition: all 0.2s ease-in-out;
    }

    .layout-content {
      flex: auto;
      min-height: 100vh;
    }

    .layout-content-fix {
      padding-top: 108px;
    }

    .noMultiTabs {
      padding-top: 74px;
    }

    .layout-content-inverted {
      background: rgb(16, 16, 20);
    }

    .n-layout-header.n-layout-header--absolute-positioned {
      z-index: 11;
    }

    .n-layout-footer {
      background: none;
    }
  }

  .layout-content-main {
    margin: 0 10px 10px;
    position: relative;
  }

  .layout-content-main-fix {
    padding-top: 44px;
  }

  .main-view-fix {
    padding-top: 44px;
  }
</style>
