<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getScrollProgress } from '../utils/scroll'

const width = ref('0%')
const onScroll = () => { width.value = getScrollProgress() + '%' }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="progress" id="progress" :style="{ width }"></div>
</template>
