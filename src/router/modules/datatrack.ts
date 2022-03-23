import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BarChartOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/datatrack',
    name: 'datatrack',
    component: Layout,
    meta: {
      sort: 6,
      isRoot: true,
      activeMenu: 'datatrack_index',
      alwaysShow: true,
      icon: renderIcon(BarChartOutlined),
    },
    children: [
      {
        path: 'index',
        name: `datatrack_index`,
        meta: {
          title: '数据追踪',
          activeMenu: 'datatrack_index',
        },
        component: () => import('@/views/datatrack/index.vue'),
      },
    ],
  },
];

export default routes;
