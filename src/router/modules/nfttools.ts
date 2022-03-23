import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ToolOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/nfttools',
    name: 'nfttools',
    component: Layout,
    meta: {
      sort: 5,
      isRoot: true,
      activeMenu: 'nfttools_index',
      alwaysShow: true,
      icon: renderIcon(ToolOutlined),
    },
    children: [
      {
        path: 'index',
        name: `nfttools_index`,
        meta: {
          title: 'NFT工具',
          activeMenu: 'nfttools_index',
        },
        component: () => import('@/views/nfttools/index.vue'),
      },
    ],
  },
];

export default routes;
