<template>
  <div>
    <n-card
      :segmented="{ content: 'hard' }"
      content-style="padding: 10px;"
      :bordered="false"
      size="small"
      title="Aerfa 社区研究报告"
    >
      <div class="flex flex-wrap mt-3 project-card">
        <n-card
          v-for="(item, index) in nftList"
          :key="item.title"
          size="small"
          :bordered="false"
          class="cursor-pointer card-item project-card-item ms:w-1/2 md:w-1/3"
          hoverable
        >
          <a :href="item.href" @click="onNegativeClick">
            <div class="flex">
              <img class="rounded h-20 w-16" :src="item.image" alt="" />
              <div class="flex flex-col justify-center ml-4">
                <n-gradient-text v-if="index === 0" type="danger">
                  {{ item.title }}
                </n-gradient-text>
                <n-gradient-text v-else type="info">
                  {{ item.title }}
                </n-gradient-text>
                <div class="flex h-10 mt-1 text-gray-400 line-clamp-2 overflow-hidden">
                  {{ item.desc }} {{ item.intr }}
                </div>
              </div>
            </div>
            <div class="flex mt-4 justify-between text-gray-400">
              <span>分析师: {{ item.author }}</span>
              <span>发布时间: {{ item.time }}</span>
            </div>
          </a>
        </n-card>
      </div>
      <div class="m-10 text-center cursor-pointer" @click="onNegativeClick">
        <n-gradient-text :size="24" type="warning"> 查看更多 </n-gradient-text>
      </div>
    </n-card>

    <n-modal
      v-model:show="showModal"
      :mask-closable="true"
      preset="dialog"
      title="提示"
      content="加入社区后查看报告详情"
      positive-text="确认"
      negative-text="取消"
      @positive-click="onPositiveClick"
      @negative-click="onNegativeClick"
    >
      <div class="mt-5 text-xl">
        <n-gradient-text type="success"> 加入社区后查看报告详情 </n-gradient-text></div
      >
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
  const nftList = [
    {
      id: 1,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/aerfa.jpg',
      title: 'NFT阿尔法深度报告系列一',
      author: 'NFT阿尔法团队',
      time: '2022/03/08',
      desc: '谁是下一个Azuki:从2E-10E的飞跃之路',
      intr: 'NFT阿尔法社区致力于成为中文区最大的NFT发行社区。NFT阿尔法社区及其附属的DC群组、 You Tube频道和 Twitter账号所触达的中文区NFT用户已达数万人',
      href: 'javascript:;',
    },
    {
      id: 2,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'Dour Darcel ',
      author: 'Softlipa',
      time: '2022/03/17',
      desc: 'Dour Darcels是一个来自Darcel Disappoints世界的10,000个情绪化的伙伴们的集合。',
      intr: 'MINT总量：10000MING价格：0.1ETH发售方式：白名单+公售MINT时间：3月4日凌晨合约：721ADour Darcels是一个来自Darcel Disappoints世界的10,000个情绪化的伙伴们的集合。',
      href: 'javascript:;',
    },
    {
      id: 3,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'LLAMAVERSE',
      author: 'JR TAN',
      time: '2022/03/15',
      desc: 'LLAMAVERSE最初是免费的DISCORD开始，后续从LLAMAPASS将其改成LLAMAVERSE',
      intr: '心为NFT持有者提供机会和价值分享，确保每个持有者能在项目获利',
      href: 'javascript:;',
    },
    {
      id: 4,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'YOLO FOX ',
      author: 'FantasyWei',
      time: '2022/03/15',
      desc: '项目由metalistlab推出，项目以卡通狐狸2d形象为主',
      intr: '风格符合NFT阿尔法对优质类pfp头像的判断标准，可以类比Doodles，Dippies。',
      href: 'javascript:;',
    },
    {
      id: 5,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'Mini Royale: Nations',
      author: 'Caroline',
      time: '2022/03/14',
      desc: 'Mini Royale是第一款在 Solana 区块链上推出的现场多人对战Gamefi',
      intr: '需第三方客户端或安装APP。核心射击机制建立在以土地控制为导向的社交策略机制之上，比较强调战队、联盟和社交机制。并且游戏经济系统会奖励社交行为。游戏中有PVP和PVE模式',
      href: 'javascript:;',
    },
    {
      id: 6,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'BoxcatPlane',
      author: 'Wade#7096 ',
      time: '2022/03/14',
      desc: '該項目為實名中國藝術家”官純”所參與的NFT項目，畫風為可愛+卡通+2D',
      intr: '目前尚未釋出路線圖/願景等相關內容，不過按照過往官純的作品與官推發布內容推測',
      href: 'javascript:;',
    },
    {
      id: 7,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'KPK Project',
      author: 'Wade#Softlipa ',
      time: '2022/03/14',
      desc: 'Klones又是Clone的谐音，有克隆人的意思+卡通+2D',
      intr: '目前尚未釋出路線圖/和其他有很多不同主体作为trait的项目不同，Klone目前看来是用了同一个主体，也符合了黑手党克隆人的故事背景',
      href: 'javascript:;',
    },
    {
      id: 8,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'ILLUVIUM',
      author: 'NickPan ',
      time: '2022/03/13',
      desc: 'Illuvium做為標榜為AAA級的P2E遊戲',
      intr: '目前尚未釋出路線圖/玩法結合了寶可夢、自走棋、魔物獵人等遊戲的概念。藉由在遊戲過程中與Illuvials戰鬥',
      href: 'javascript:;',
    },
    {
      id: 9,
      image: 'https://aerfa-1253147691.cos.ap-shanghai.myqcloud.com/aerfa/report.jpg',
      title: 'CyberBrokers',
      author: 'Penny777',
      time: '2022/03/10',
      desc: 'Josie是CyberBrokers的核心，她早在2017年开始就接触到了以太坊',
      intr: '创作了自己的第一幅Crypto艺术作品《创世纪》，并且这幅作品在2021年铸造成了NFT在佳士得进行了拍卖，最终成交价格40万美元',
      href: 'javascript:;',
    },
  ];
  const message = useMessage();
  const showModal = ref(false);

  function onNegativeClick() {
    // message.success('Cancel');
    showModal.value = true;
  }
  function onPositiveClick() {
    message.success('Cancel');
    showModal.value = false;
  }
</script>

<style lang="less" scoped></style>
