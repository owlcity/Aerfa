import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DiamondOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/mandate',
    name: 'https://fortunedao.io',
    component: Layout,
    meta: {
      title: '财神道',
      icon: renderIcon(DiamondOutline),
      sort: 1,
    },
  },
];

export default routes;
