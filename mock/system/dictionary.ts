import { resultSuccess } from '../_util';

const dictionaryList = [
  {
    id: '@integer(10,9999)',
    label: '预约事项',
    key: 'makeMatter',
    children: [
      {
        id: '@integer(10,9999)',
        label: '初次预约',
        key: 'theMake',
      },
      {
        id: '@integer(10,9999)',
        label: '多次预约',
        key: 'towMake',
      },
    ],
  },
  {
    id: '@integer(10,9999)',
    label: '注册来源',
    key: 'registeredSource',
  },
];

const dictionaryItems = () => {
  return [
    {
      key: 'registeredSource',
      values: [
        {
          value: 'baidu',
          name: '百度',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
        {
          value: 'weibo',
          name: '微博',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
        {
          value: 'weixin',
          name: '微信',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
      ],
    },
    {
      key: 'theMake',
      parentKey: 'makeMatter',
      values: [
        {
          value: 'examine',
          name: '检查',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
        {
          value: 'tooth',
          name: '拔牙',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
      ],
    },
    {
      key: 'towMake',
      parentKey: 'makeMatter',
      values: [
        {
          value: 'take',
          name: '拆线',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
        {
          value: 'periodontal',
          name: '牙周',
          'order|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          create_date: `@date('yyyy-MM-dd hh:mm:ss')`,
        },
      ],
    },
  ];
};

const dictionaryInfo = (_, key: string) => {
  const list: any[] = [];
  dictionaryItems().forEach((item: any) => {
    if (item.key === key || item.parentKey === key) {
      list.push(item as any);
    }
  });
  const valuesList: any[] = [];
  list.forEach((item: any) => {
    item.values.map((values) => {
      valuesList.push(values);
    });
  });
  return valuesList;
};

export default [
  //字典列表
  {
    url: '/api/dictionary/list',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(dictionaryList);
    },
  },
  //字典详情
  {
    url: '/api/dictionary/info',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, key } = query;
      const list = dictionaryInfo(Number(pageSize), key);
      return resultSuccess({
        page: Number(page),
        pageSize: Number(pageSize),
        pageCount: list.length > Number(pageSize) ? Math.ceil(list.length / Number(pageSize)) : 1,
        list,
      });
    },
  },
];
