<script setup lang="ts">
// Loaded ONLY on the client, in an async chunk (see LiveDemo.vue). Imports the
// BUILT library so its Tailwind-compiled CSS comes along.
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'

const design = ref()
</script>

<template>
  <EmailEditor v-model="design" />
</template>
