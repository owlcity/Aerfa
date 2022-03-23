import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProjectOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/datatrack',
    name: 'datatrack',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: 'datatrack_index',
      alwaysShow: true,
      icon: renderIcon(ProjectOutlined),
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
