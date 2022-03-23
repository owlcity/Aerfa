<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="AMA 节目预告">
        <n-calendar
          v-model:value="value"
          #="{ year, month, date }"
          :is-date-disabled="isDateDisabled"
          @update:value="handleUpdateValue"
        >
          {{ year }}-{{ month }}-{{ date }}

          <div v-for="item in noticeList" :key="item.title">
            <div class="pt-5" v-if="`${year}-${month}-${date}` === item.date">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-tag type="info"> {{ item.title }} </n-tag>
                </template>
                {{ item.content }}
              </n-tooltip>
            </div>
          </div>
        </n-calendar>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { isYesterday, addDays } from 'date-fns';

  export default defineComponent({
    setup() {
      const message = useMessage();
      const noticeList = [
        {
          date: '2022-3-23',
          title: 'Terra 生态链龙头',
          content: 'Terra 生态链龙头🐲项目 - Anchor Protocol 20% 稳定币年化，这羊毛能薅吗？',
        },
        {
          date: '2022-3-22',
          title: '财神道Holder --专场',
          content: '财神道Holder --专场AMA',
        },
        {
          date: '2022-3-21',
          title: '音乐故事',
          content:
            '是否曾经fomo某个项目辗转难眠？是否错过某个项目拍断大腿？内心响起悲壮、激动的音乐？歌曲的旋律与歌词变成了心情抒发的管道？',
        },
        {
          date: '2022-3-19',
          title: '安全知识讲座',
          content: '安全知识讲座——保护你的资产，你所需要知道的方方面面',
        },
      ];
      return {
        value: ref(addDays(Date.now(), 1).valueOf()),
        noticeList,
        handleUpdateValue(
          _: number,
          { year, month, date }: { year: number; month: number; date: number }
        ) {
          message.success(`${year}-${month}-${date}`);
        },
        isDateDisabled(timestamp: number) {
          if (isYesterday(timestamp)) {
            return true;
          }
          return false;
        },
      };
    },
  });
</script>

<style lang="less" scoped></style>
