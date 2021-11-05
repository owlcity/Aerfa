<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="引导页"> 用于给用户展示一些新的功能，和功能操作步骤</n-card>
    </div>
    <n-card :bordered="false" class="mt-3 proCard">
      <n-button type="primary" @click="handleStart">点这里体验一发</n-button>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
  import intro from 'intro.js';
  import 'intro.js/introjs.css';

  function handleStart() {
    intro()
      .setOptions({
        nextLabel: '下一步 &rarr;',
        prevLabel: '&larr; 上一步',
        skipLabel: '退出',
        steps: [
          {
            title: '感谢',
            intro: '哇哦，我终于等到您了~',
          },
          {
            title: '折叠左侧菜单',
            element: document.querySelector('.collapsed-trigger')!,
            intro: '点击这里可以切换左侧菜单折叠效果',
          },
          {
            title: '项目配置',
            element: document.querySelector('.setting-trigger')!,
            intro: '整个项目配置全在这里了，少侠要怎么玩，看您爱好了哈~',
          },
        ],
      })
      .start();
  }
</script>

<style lang="less">
  // 适当 css 美化一下
  body .introjs-button,
  body .introjs-nextbutton {
    background: #2d8cf0;
    color: #fff;
    border: none;
    box-shadow: none;
    text-shadow: none;

    &:hover {
      color: #fff;
      background: #2d8cf0;
      border: none;
    }

    &:focus {
      color: #fff;
      background: #2d8cf0;
      border: none;
      box-shadow: none;
    }
  }

  body .introjs-tooltip-title,
  body .introjs-skipbutton {
    font-size: 16px;
  }
</style>
