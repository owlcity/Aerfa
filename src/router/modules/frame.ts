import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import {
  DesktopOutline,
  LogoYoutube,
  LogoTwitter,
  LogoDiscord,
  TimeOutline,
} from '@vicons/ionicons5';
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
        name: 'https://www.youtube.com/c/NFT%E9%98%BF%E5%B0%94%E6%B3%95',
        component: Layout,
        meta: {
          title: 'Youtube',
          icon: renderIcon(LogoYoutube),
          sort: 1,
        },
      },
      {
        path: '/frame',
        name: 'https://twitter.com/NFT_Aerfa',
        component: Layout,
        meta: {
          title: 'Twitter',
          icon: renderIcon(LogoTwitter),
          sort: 2,
        },
      },
      {
        path: '/frame',
        name: 'https://discord.gg/vK3btcQujm',
        component: Layout,
        meta: {
          title: 'Discord',
          icon: renderIcon(LogoDiscord),
          sort: 3,
        },
      },
      {
        path: '/frame',
        name: 'https://open.spotify.com/show/0zVg6ryGxBYj2QC21bi1qH',
        component: Layout,
        meta: {
          title: 'AMA',
          icon: renderIcon(TimeOutline),
          sort: 3,
        },
      },
    ],
  },
];

export default routes;
