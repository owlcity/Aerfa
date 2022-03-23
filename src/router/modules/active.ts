import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ClockCircleOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/active',
    name: 'active',
    component: Layout,
    meta: {
      sort: 3,
      isRoot: true,
      activeMenu: 'active_index',
      alwaysShow: true,
      icon: renderIcon(ClockCircleOutlined),
    },
    children: [
      {
        path: 'index',
        name: `active_index`,
        meta: {
          title: '节目预告',
          activeMenu: 'active_index',
        },
        component: () => import('@/views/active/index.vue'),
      },
    ],
  },
];

export default routes;
