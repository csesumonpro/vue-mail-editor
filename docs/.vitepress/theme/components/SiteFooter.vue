<script setup lang="ts">
import { withBase } from 'vitepress'
import { REPO, NPM } from '../links'
</script>

<template>
  <footer class="vee-footer">
    <div class="vee-container">
      <span>Vue Email Editor · Released under the MIT License.</span>
      <span style="display: flex; gap: 18px">
        <a :href="withBase('/guide/getting-started')">Docs</a>
        <a :href="REPO" target="_blank" rel="noopener">GitHub</a>
        <a :href="NPM" target="_blank" rel="noopener">npm</a>
      </span>
    </div>
  </footer>
</template>
