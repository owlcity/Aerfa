<template>
  <div>
    <n-card
      :segmented="{ content: 'hard' }"
      content-style="padding: 10px;"
      :bordered="false"
      size="small"
      title="NFT工具"
    >
      <div class="flex flex-wrap project-card">
        <n-card
          v-for="item in nftList"
          :key="item.name"
          size="small"
          :bordered="false"
          class="cursor-pointer card-item project-card-item ms:w-1/2 md:w-1/3"
          hoverable
        >
          <a :href="item.href" target="_blank">
            <div class="flex">
              <span> <img class="rounded-full h-20 w-20" :src="item.image" alt="" /> </span>
              <div class="flex flex-col justify-center ml-4">
                <span class="text-lg">{{ item.name }}</span>
                <div class="flex h-10 mt-2 text-gray-400"> {{ item.desc }} </div>
              </div>
            </div>
          </a>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  const nftList = [
    {
      image: 'https://api.iowen.cn/favicon/pro.nansen.ai.png',
      name: 'Nansen',
      desc: '看聪明钱买卖哪个项目',
      href: 'http://pro.nansen.ai/multichain/eth',
    },
    {
      image: 'https://api.iowen.cn/favicon/cryptorank.io.png',
      name: 'Cryptorank',
      desc: '数据分析工具，可看最新IDO/IEO项目数据。',
      href: 'https://cryptorank.io',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/favicon-1.png',
      name: 'WhaleStatsETH巨鲸前1000名地址分析',
      desc: '前1000名ETH分析以太坊上的钱包',
      href: 'https://www.whalestats.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/logo-gemit.png',
      name: 'GEMIT',
      desc: '錢包監視，聰明錢',
      href: 'https://www.v2.tools.gemit.app',
    },
    {
      image: 'https://api.iowen.cn/favicon/www.dovemetrics.com.png',
      name: '鸽子指标',
      desc: '投资查询',
      href: 'https://www.dovemetrics.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/Moonarch.png',
      name: 'Moonarch',
      desc: '監視地址，監視鯨魚',
      href: 'https://moonarch.app',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/glyph-128w.png',
      name: 'Dune',
      desc: '深度数据分析工具',
      href: 'https://dune.xyz',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/index_logo_pc_en.png',
      name: 'whotwi',
      desc: 'kol推特跟踪',
      href: 'https://en.whotwi.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/gla.png',
      name: 'Glassnode',
      desc: '链上数据分析工具',
      href: 'https://glassnode.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/16f60100b815c341_160_160.png',
      name: 'KingData',
      desc: 'Dapp、defi数据，还有地址追踪功能，ui挺漂亮。界面清新简洁。',
      href: 'https://kingdata.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/logo-1.jpg',
      name: 'DefiLlama',
      desc: 'DEFI各种数据查询',
      href: 'https://defillama.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/DappRadar.jpg',
      name: 'DappRadar',
      desc: '链数据查询网站',
      href: 'https://dappradar.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/apple-touch-icon-4.png',
      name: 'Footprint',
      desc: '多维度可视化数据分析平台',
      href: 'https://www.footprint.network/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/logo-2.jpg',
      name: 'Token Terminal',
      desc: '去中心化应用程序 (dapps) 财务数据的平台',
      href: 'https://www.tokenterminal.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/favicon.png',
      name: 'L2beat',
      desc: 'L2BEAT是以太坊第二层 (L2) 扩展的分析和研究网站',
      href: 'https://l2beat.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/02/MyMetadata_logo512.png',
      name: 'My MetaData',
      desc: 'GameFi全场景数据分析平台',
      href: 'https://www.mymetadata.io',
    },
  ];
</script>

<style lang="less" scoped></style>
