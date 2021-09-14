import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FormatPainterOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/setup',
    name: 'Setup',
    component: Layout,
    meta: {
      title: '引导页',
      icon: renderIcon(FormatPainterOutlined),
      sort: 10,
    },
    children: [
      {
        path: 'index',
        name: 'setup-index',
        meta: {
          title: '引导页',
        },
        component: () => import('@/views/setup/index.vue'),
      },
    ],
  },
];

export default routes;
