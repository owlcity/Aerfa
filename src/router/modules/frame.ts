import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DesktopOutline, LogoYoutube, LogoTwitter, LogoDiscord } from '@vicons/ionicons5';
// import { DesktopOutline, LogoYoutube, TwitterSquareFilled, UserAddOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/frame',
    name: 'https://fortunedao.io',
    component: Layout,
    meta: {
      title: 'Aerfa 频道',
      icon: renderIcon(DesktopOutline),
      sort: 12,
    },
    children: [
      {
        path: '/frame',
        name: 'https://fortunedao.io',
        component: Layout,
        meta: {
          title: 'Youtube',
          icon: renderIcon(LogoYoutube),
          sort: 1,
        },
      },
      {
        path: '/frame',
        name: 'https://fortunedao.io',
        component: Layout,
        meta: {
          title: 'Twitter',
          icon: renderIcon(LogoTwitter),
          sort: 2,
        },
      },
      {
        path: '/frame',
        name: 'https://fortunedao.io',
        component: Layout,
        meta: {
          title: 'Discord',
          icon: renderIcon(LogoDiscord),
          sort: 3,
        },
      },
    ],
  },
];

export default routes;
