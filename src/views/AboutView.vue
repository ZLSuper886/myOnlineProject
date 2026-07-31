<script setup lang="ts">
import { usePortfolioStore } from '../stores/portfolio'
const portfolio = usePortfolioStore()
</script>

<template>
  <section class="about" style="max-width:880px;margin:0 auto;padding:96px 20px">
    <h1>关于本站点</h1>
    <p>这是一个使用 <b>Vue 3 + Vite + TypeScript + Pinia + Vue Router</b> 构建的作品集，目录结构按企业级规范组织。</p>
    <p>作品数据由 Pinia 统一管理，当前共收录 <b>{{ portfolio.count }}</b> 个精选项目。</p>
    <p style="margin-top:24px"><router-link to="/">← 返回首页</router-link></p>
  </section>
</template>
