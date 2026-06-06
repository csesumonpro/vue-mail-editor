<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Landing from './components/Landing.vue'
import Features from './components/Features.vue'
import Showcase from './components/Showcase.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <!-- Marketing pages render bespoke content into the page body, keeping the
         default VitePress nav (search, dark toggle, Docs menu, social links). -->
    <template #page-top>
      <Landing v-if="frontmatter.landing === 'home'" />
      <Features v-else-if="frontmatter.landing === 'features'" />
      <Showcase v-else-if="frontmatter.landing === 'showcase'" />
    </template>
  </Layout>
</template>
