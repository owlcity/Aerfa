import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProjectOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/report',
    name: 'report',
    component: Layout,
    meta: {
      sort: 4,
      isRoot: true,
      activeMenu: 'report_index',
      alwaysShow: true,
      icon: renderIcon(ProjectOutlined),
    },
    children: [
      {
        path: 'index',
        name: `report_index`,
        meta: {
          title: '研究报告',
          activeMenu: 'report_index',
        },
        component: () => import('@/views/report/index.vue'),
      },
    ],
  },
];

export default routes;
