<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
      class="layout-header-left"
    >
      <div v-if="navMode === 'horizontal'" class="logo">
        <img alt="" src="~@/assets/images/logo.png" />
        <h2 v-show="!collapsed" class="title">NaiveUiAdmin</h2>
      </div>
      <AsideMenu
        v-model:collapsed="collapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      />
    </div>
    <!--左侧菜单-->
    <div v-else class="layout-header-left">
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min collapsed-trigger"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon v-if="collapsed" size="18">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon v-else size="18">
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div
        v-if="headerSetting.isReload"
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        @click="reloadPage"
      >
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb v-if="crumbsSetting.show">
        <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
          <n-breadcrumb-item>
            <n-dropdown
              v-if="routeItem.children.length"
              :options="routeItem.children"
              @select="dropdownSelect"
            >
              <span class="link-text">
                <component
                  :is="routeItem.meta.icon"
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span v-else class="link-text">
              <component
                :is="routeItem.meta.icon"
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
              />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div
        v-for="item in iconList"
        :key="item.icon.name"
        class="layout-header-trigger layout-header-trigger-min"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>
      <!--消息-->
      <div class="layout-header-trigger layout-header-trigger-min notifier-plus">
        <NotifierProPlus />
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown :options="avatarOptions" trigger="hover" @select="avatarSelect">
          <div class="avatar">
            <n-avatar round :src="schoolboy" />
          </div>
        </n-dropdown>
      </div>
      <!--设置-->
      <div
        class="layout-header-trigger layout-header-trigger-min setting-trigger"
        @click="openSetting"
      >
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <ProjectSetting ref="drawerSetting" />

  <!-- 搜索 -->
  <AppSearch ref="appSearchRef" />

  <!--修改密码-->
  <AmendPwd ref="amendPwdRef" />
</template>

<script lang="ts" setup>
  import { computed, markRaw, nextTick, ref, unref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useDialog, useMessage } from 'naive-ui';
  import { TABS_ROUTES } from '@/store/mutation-types';
  import { useUserStore } from '@/store/modules/user';
  import { useLockscreenStore } from '@/store/modules/lockscreen';
  import { AsideMenu } from '@/layout/components/Menu';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { AppSearch } from '@/components/Application/index';
  import { renderIcon } from '@/utils';
  import ProjectSetting from './ProjectSetting.vue';
  import NotifierProPlus from './NotifierProPlus.vue';
  import AmendPwd from './AmendPwd.vue';
  import {
    FullscreenExitOutlined,
    FullscreenOutlined,
    GithubOutlined,
    LockOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined,
    SearchOutlined,
    SettingOutlined,
    UserSwitchOutlined,
  } from '@vicons/antd';
  import { LockClosedOutline } from '@vicons/ionicons5';
  import { PageEnum } from '@/enums/pageEnum';
  import schoolboy from '@/assets/images/schoolboy.png';
  import { RedirectName } from '@/router/constant';

  const userStore = useUserStore();
  const useLockscreen = useLockscreenStore();
  const message = useMessage();
  const dialog = useDialog();
  const appSearchRef = ref();
  const isRefresh = ref(false);
  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getCrumbsSetting } =
    useProjectSetting();

  const props = defineProps({
    collapsed: {
      type: Boolean,
    },
    inverted: {
      type: Boolean,
    },
  });

  const BASE_LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

  const drawerSetting = ref();

  const amendPwdRef = ref();

  // const username = userStore?.info ? ref(userStore?.info.username) : '';

  const fullscreenIcon = markRaw(FullscreenOutlined);

  const navMode = getNavMode;

  const headerSetting = getHeaderSetting;

  const crumbsSetting = getCrumbsSetting;

  const getInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? props.inverted : !props.inverted;
  });

  const mixMenu = computed(() => {
    return unref(getMenuSetting).mixMenu;
  });

  const getMenuLocation = computed(() => {
    return 'header';
  });

  const router = useRouter();
  const route = useRoute();

  const generator: any = (routerMap) => {
    return routerMap.map((item) => {
      const currentMenu = {
        ...item,
        label: item.meta.title,
        key: item.name,
        disabled: item.path === '/',
      };
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentMenu.children = generator(item.children, currentMenu);
      }
      return currentMenu;
    });
  };

  watch(
    () => route.fullPath,
    (to) => {
      isRefresh.value = to.indexOf('/redirect/') != -1;
    },
    { immediate: true }
  );

  const breadcrumbList = computed(() => {
    if (!isRefresh.value) return generator(route.matched);
  });

  const dropdownSelect = (key) => {
    router.push({ name: key });
  };

  // 刷新页面
  const reloadPage = () => {
    router.push({
      path: '/redirect' + unref(route).fullPath,
    });
  };

  // 退出登录
  const doLogout = () => {
    dialog.info({
      title: '提示',
      content: '您确定要退出登录吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout().then(() => {
          message.success('成功退出登录');
          // 移除标签页
          localStorage.removeItem(TABS_ROUTES);
          router.replace({
            name: BASE_LOGIN_NAME,
            query: {
              redirect: route.fullPath,
            },
          });
        });
      },
      onNegativeClick: () => {},
    });
  };

  // 切换全屏图标
  const toggleFullscreenIcon = () =>
    (fullscreenIcon.value =
      document.fullscreenElement !== null ? FullscreenExitOutlined : FullscreenOutlined);

  // 监听全屏切换事件
  document.addEventListener('fullscreenchange', toggleFullscreenIcon);

  // 全屏切换
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 图标列表
  const iconList = [
    {
      icon: SearchOutlined,
      tips: '搜索',
      eventObject: {
        click: () => openAppSearch(),
      },
    },
    {
      icon: GithubOutlined,
      tips: 'github',
      eventObject: {
        click: () => window.open('https://github.com/jekip/naive-ui-admin'),
      },
    },
    {
      icon: LockOutlined,
      tips: '锁屏',
      eventObject: {
        click: () => useLockscreen.setLock(true),
      },
    },
  ];
  const avatarOptions = [
    {
      label: '个人设置',
      key: 1,
      icon: renderIcon(UserSwitchOutlined),
    },
    {
      label: '修改密码',
      key: 3,
      icon: renderIcon(LockClosedOutline),
    },
    {
      label: '退出登录',
      key: 2,
      icon: renderIcon(LogoutOutlined),
    },
  ];

  //头像下拉菜单
  const avatarSelect = (key) => {
    switch (key) {
      case 1:
        router.push({ name: 'Setting' });
        break;
      case 2:
        doLogout();
        break;
      case 3:
        amendPwdRef.value.showModal();
        break;
    }
  };

  function openSetting() {
    const { openDrawer } = drawerSetting.value;
    openDrawer();
  }

  function openAppSearch() {
    appSearchRef.value && appSearchRef.value.show();
  }
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: @header-height;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 10px;

        img {
          width: auto;
          height: 32px;
          margin-right: 10px;
        }

        .title {
          margin-bottom: 0;
        }
      }

      ::v-deep(.ant-breadcrumb span:last-child .link-text) {
        color: #515a6e;
      }

      .n-breadcrumb {
        display: inline-block;
      }

      &-menu {
        color: var(--text-color);
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
        height: 64px;
      }

      > * {
        cursor: pointer;
      }
    }

    &-trigger {
      display: inline-block;
      width: 64px;
      height: 64px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .anticon {
        font-size: 16px;
        color: #515a6e;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .layout-header-light {
    background: #fff;
    color: #515a6e;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }

  .notifier-plus {
    display: flex;
    align-items: center;
  }
</style>
