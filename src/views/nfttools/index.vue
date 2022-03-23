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
      image: 'https://pktoken.com/wp-content/uploads/2021/12/123-1.png',
      name: 'OpenSea',
      desc: 'NFT龙头交易平台',
      href: 'https://opensea.io/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/微信截图_20211224092227.png',
      name: 'NFTNerds',
      desc: 'Nft查询物品罕见度，rank值越低越好。',
      href: 'https://nftnerds.ai/trending',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/favicon-180.png',
      name: 'NFT查询平台',
      desc: 'NFT查询平台',
      href: 'https://mintyscore.com/home',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/123.jpg',
      name: 'TheNFTscore',
      desc: 'NFT热门数据查询',
      href: 'https://thenftscore.com/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/geniefavicon-e1638717303478.png',
      name: 'Genie',
      desc: 'NFT聚合交易平台',
      href: 'https://www.genie.xyz',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/favicon-1.ico',
      name: 'NFTGO数据聚合平台',
      desc: 'NFT市场指标巨鲸追踪，排名数据等聚合平台',
      href: 'https://nftgo.io/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/icon-2.png',
      name: 'tofunft',
      desc: 'NFT交易网站，反映迅速，支持中文。',
      href: 'https://tofunft.com/zh-CN',
    },
    {
      image: 'https://api.iowen.cn/favicon/www.prysm.xyz.png',
      name: 'Prysm',
      desc: '关注巨鲸钱包动向',
      href: 'https://www.prysm.xyz',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/ReOiSvV-_400x400.jpg',
      name: 'NFT Price Floor',
      desc: 'NFT数据聚合器跟踪价格、交易量等等。',
      href: 'https://nftpricefloor.com/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2021/12/favicon.ico',
      name: 'Rarity.tools',
      desc: '按稀有度对生成艺术和收藏 NFT进行排名。',
      href: 'https://rarity.tools/',
    },
    {
      image: 'https://api.iowen.cn/favicon/cryptoart.io.png',
      name: 'CryptoArt',
      desc: '查看艺术家及作品排名的网站',
      href: 'https://cryptoart.io/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/WechatIMG9.jpeg',
      name: 'Moby',
      desc: '查看实时的NFT在mint的情况',
      href: 'https://moby.gg/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/favicon.png',
      name: 'Whatsminting',
      desc: 'NFT实时mint的情况',
      href: 'https://whatsminting.live/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/logo-1.png',
      name: 'ICY',
      desc: '查看实时NFT的mint的情况和二级市场交易的数据',
      href: 'https://www.icy.tools',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/WechatIMG11.jpeg',
      name: 'Rarity Sniffer',
      desc: 'NFT排名稀有度查询',
      href: 'https://raritysniffer.com/',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/photo_2021-10-26_09-02-58.jpg',
      name: 'NFTSCAN.COM',
      desc: 'NFTSCAN is a professional NFT asset explorer.',
      href: 'https://nftscan.com',
    },
    {
      image: 'https://pktoken.com/wp-content/uploads/2022/01/WechatIMG10.jpeg',
      name: 'floored Ape',
      desc: 'NFT情况查询',
      href: 'https://flooredape.io/',
    },
  ];
</script>

<style lang="less" scoped></style>
