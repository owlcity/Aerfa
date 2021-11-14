<template>
  <n-layout class="layout" :position="fixeBody">
    <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
      <div class="flex">
        <Logo />
        <PageHeader @update:collapsed="updateCollapsed" :inverted="inverted" />
      </div>
    </n-layout-header>
    <n-layout
      has-sider
      :inverted="inverted"
      :position="fixeBody"
      class="layout-content"
      :class="{
        'layout-content-fix': fixedHeader === 'absolute',
        'layout-content-inverted': getDarkTheme,
        noMultiTabs: !isMultiTabs,
        'page-full-screen': isFullscreen && !getDarkTheme,
      }"
    >
      <!-- :position="fixeLeftSider" -->
      <n-layout-sider
        v-if="isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')"
        show-trigger="bar"
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :native-scrollbar="false"
        :collapsed="collapsed"
        collapse-mode="width"
        :collapsed-width="64"
        :width="leftMenuWidth"
        :inverted="inverted"
        class="layout-sider"
      >
        <AsideMenu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
      </n-layout-sider>

      <n-layout embedded class="layout-content-son">
        <TabsView
          v-if="isMultiTabs"
          v-model:collapsed="collapsed"
          @page-full-screen="togglePageFullScreen"
        />
        <div class="layout-content-main">
          <div class="main-view" ref="adminBodyRef">
            <MainView />
          </div>
        </div>
        <n-back-top :right="100" />
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, onMounted, watch, provide } from 'vue';
  import { Logo } from './components/Logo';
  import { TabsView } from './components/TagsView';
  import { MainView } from './components/Main';
  import { AsideMenu } from './components/Menu';
  import { PageHeader } from './components/Header';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting';
  import { useRoute } from 'vue-router';
  import { useProjectSettingStore } from '@/store/modules/projectSetting';
  import { useFullscreen } from '@vueuse/core';

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
  const adminBodyRef = ref<HTMLElement | null>(null);

  const { isFullscreen, toggle } = useFullscreen(adminBodyRef);

  provide('isPageFullScreen', isFullscreen);
  provide('collapsed', collapsed);

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
    console.log(fixed);
    return fixed ? 'absolute' : 'static';
  });

  //固定侧边栏
  const fixeLeftSider = computed(() => {
    const { fixed } = unref(getMenuSetting);
    return fixed ? 'absolute' : 'static';
  });

  //切换内容页全屏
  function togglePageFullScreen() {
    toggle();
  }

  //菜单折叠
  function updateCollapsed() {
    collapsed.value = !collapsed.value;
  }

  const isMixMenuNoneSub = computed(() => {
    const mixMenu = settingStore.menuSetting.mixMenu;
    const currentRoute = useRoute();
    if (unref(navMode) != 'horizontal-mix') return true;
    if (unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot) {
      return false;
    }
    return true;
  });

  const isMultiTabs = computed(() => {
    return unref(getMultiTabsSetting).show;
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

  const getMenuLocation = computed(() => {
    return 'left';
  });

  //看自身需求是否保留吧，这个用处不是很大
  const watchWidth = () => {
    const { isFullscreen: isFullscreen } = useFullscreen();
    if (isFullscreen.value) return;
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
      min-height: calc(100vh - 64px);
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
    .layout-right-fix {
      overflow-x: hidden;
      padding-left: 200px;
      min-height: calc(100vh - 64px);
      transition: all 0.2s ease-in-out;
    }

    .layout-content {
      flex: auto;
      min-height: calc(100vh - 64px);
      &-son {
        :deep(.n-layout-scroll-container) {
          overflow: hidden;
        }
      }
    }

    .layout-content-fix {
      top: 64px;
    }

    .noMultiTabs {
      padding-top: 0px;
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
    padding: 0 10px 10px 10px;
    height: calc(100vh - 64px - 44px);
    position: relative;
    overflow-y: auto;
  }

  .layout-content-main-fix {
    padding-top: 44px;
  }

  .main-view-fix {
    padding-top: 44px;
  }

  //内容全屏
  .page-full-screen {
    .main-view {
      background: #f0f2f5;
    }
  }

  .dark {
    .page-full-screen {
      .main-view {
        background: #000;
      }
    }
  }
</style>
