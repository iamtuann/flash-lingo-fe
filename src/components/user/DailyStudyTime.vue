<template>
  <BarChart
    :data="data"
    :categories="['time']"
    :index="'date'"
    :rounded-corners="4"
    :showXAxis="false"
    :showYAxis="false"
    :showLegend="false"
    :showGridLine="false"
  />
</template>

<script setup lang="ts">
import { useStudyStore } from '@/stores';
import { BarChart } from "@/components/ui/chart-bar"
import { ref } from 'vue';
import type { StudyTime } from '@/types';
import { formatDate } from '@/utils';

const studyStore = useStudyStore();
type chartData = {
  time: string | number,
  date: string
}
const data = ref<chartData[]>([])

getData()

function generateData(start: Date, end: Date, studyTime: StudyTime[]) {
  let i = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const isoStringDate = formatDate('yyyy-MM-dd', d)
    const statDate = formatDate('dd/MM', d)
    let newData: chartData
    if (isoStringDate == studyTime[i].statDate) {
      newData = {
        date: statDate,
        time: studyTime[i].totalDurationSeconds
      }
      i++;
    } else {
      newData = {
        date: statDate,
        time: 0
      }
    }
    data.value.push(newData)
  }
}

async function getData() {
  try {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    const res = await studyStore.getDailyStudyTime(startDate, endDate);
    generateData(startDate, endDate, res)
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>

</style>