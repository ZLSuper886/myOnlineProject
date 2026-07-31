import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkItem } from '../types'

export const usePortfolioStore = defineStore('portfolio', () => {
  const works = ref<WorkItem[]>([
    { no: '01', title: '四川人口信息服务官网', subtitle: '2026 · 人口信息服务门户', year: 'Vue · Antd', peek: 'p1' },
    { no: '02', title: '数据模型平台', subtitle: '2025 · 可视化建模 · 流程图', year: 'Vue · JsPlumb', peek: 'p2' },
    { no: '03', title: '基础管控任务系统', subtitle: '2024 · 数据大屏 + 数据模型 · 公安业务', year: 'Vue · ECharts', peek: 'p3' },
    { no: '04', title: '四川E码微信小程序', subtitle: '2023 · 微信小程序', year: '小程序', peek: 'p4' },
    { no: '05', title: '智慧小区系统', subtitle: '2023 · 物业管理后台', year: 'Vue · Antd', peek: 'p5' },
    { no: '06', title: '园区物流管理系统', subtitle: '2022 · Web + 公众号 + 移动 H5', year: 'Vue · Egg', peek: 'p6' },
  ])
  const count = computed(() => works.value.length)
  return { works, count }
})
