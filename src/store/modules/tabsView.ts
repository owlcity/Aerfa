import { defineStore } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';
import { PageEnum } from '@/enums/pageEnum';

// 不需要出现在标签页中的路由
const whiteList = ['Redirect', 'login'];

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string;
  name: string;
};

export type ITabsViewState = {
  tabsList: RouteItem[]; // 标签页
};

//首页路由
function homeRoute(list: any[]) {
  return list.filter((item) => item.fullPath === PageEnum.BASE_HOME_REDIRECT);
}

//排除首页路由
function excludeHomeRoute(list: any[]) {
  return list.filter((item) => item.fullPath != PageEnum.BASE_HOME_REDIRECT);
}

export const useTabsViewStore = defineStore({
  id: 'app-tabs-view',
  state: (): ITabsViewState => ({
    tabsList: [],
  }),
  getters: {},
  actions: {
    initTabs(routes) {
      // 初始化标签页
      this.tabsList = routes;
    },
    addTabs(route): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    closeLeftTabs(route) {
      // 关闭左侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      const newTabsList = excludeHomeRoute(this.tabsList);
      newTabsList.splice(0, index - 1);
      this.tabsList = [...homeRoute(this.tabsList), ...newTabsList];
    },
    closeRightTabs(route) {
      // 关闭右侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      const newTabsList = excludeHomeRoute(this.tabsList);
      newTabsList.splice(index);
      this.tabsList = [...homeRoute(this.tabsList), ...newTabsList];
    },
    closeOtherTabs(route) {
      // 关闭其他
      this.tabsList = this.tabsList.filter((item) =>
        [route.fullPath, PageEnum.BASE_HOME_REDIRECT].includes(item.fullPath)
      );
    },
    closeCurrentTab(route) {
      // 关闭当前页
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.tabsList.splice(index, 1);
    },
    closeAllTabs() {
      // 关闭全部 保留首页
      this.tabsList = homeRoute(this.tabsList);
      //localStorage.removeItem(TABS_ROUTES);
    },
  },
});
