<script setup lang="ts">
import { useReveal } from '../composables/useReveal'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import WorksSection from '../components/sections/WorksSection.vue'
import ResumeSection from '../components/sections/ResumeSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import AIChatWidget from '../components/AIChatWidget.vue'

// 在 HomeView 中调用，确保 .reveal 元素已存在于 DOM
useReveal()
</script>

<template>
  <HeroSection />
  <AboutSection />
  <WorksSection />
  <ResumeSection />
  <ContactSection />
  <AIChatWidget />
</template>
