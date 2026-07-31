<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue'
import MarqueeBar from '../components/MarqueeBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <ProgressBar />
  <TheHeader />
  <MarqueeBar />
  <main id="top">
    <slot />
  </main>
  <AppFooter />
</template>
