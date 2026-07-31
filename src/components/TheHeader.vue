<script setup lang="ts">
import { useUiStore } from '../stores/ui'
const ui = useUiStore()
</script>

<template>
  <header id="hdr">
    <div class="wrap nav">
      <a href="#top" class="brand">张林<b>.</b></a>
      <nav>
        <a href="#about">关于</a><a href="#works">作品</a><a href="#resume">经历</a><a href="#contact">联系</a>
      </nav>
      <button class="menu-btn" aria-label="菜单" @click="ui.toggleMenu()">≡</button>
    </div>
    <div class="mobile-nav" :class="{ open: ui.menuOpen }">
      <a href="#about" @click="ui.closeMenu()">关于</a><a href="#works" @click="ui.closeMenu()">作品</a><a href="#resume" @click="ui.closeMenu()">经历</a><a href="#contact" @click="ui.closeMenu()">联系</a>
    </div>
  </header>
</template>
