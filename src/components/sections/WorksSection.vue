<script setup lang="ts">
import { usePortfolioStore } from '../../stores/portfolio'
const portfolio = usePortfolioStore()
</script>

<template>
  <section id="works">
    <div class="wrap">
      <div class="eyebrow reveal"><span class="dot"></span><span class="mono">02 — 精选作品</span></div>
      <h2 class="reveal" data-d="1">悬停，<em>看一眼</em>。</h2>
      <div class="works-list">
        <a v-for="w in portfolio.works" :key="w.no" href="#" class="wrow reveal">
          <span class="no">{{ w.no }}</span>
          <div class="tt"><h3>{{ w.title }}</h3><span>{{ w.subtitle }}</span></div>
          <span class="yr">{{ w.year }}</span>
          <div :class="'peek ' + w.peek"></div>
        </a>
      </div>
    </div>
  </section>
</template>
