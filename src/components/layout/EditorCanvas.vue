<script setup lang="ts">
// Phase 0: static canvas placeholder. Real Body/Row/Column/Content renderers
// arrive in Phase 2. The fixed email body sits centered on a checkerboard backdrop.
const contentWidth = 600
</script>

<template>
  <main class="canvas-backdrop scroll-thin min-w-0 flex-1 overflow-y-auto">
    <div class="flex min-h-full justify-center p-8">
      <div
        class="min-h-[600px] w-full rounded-sm bg-white shadow-xl ring-1 ring-black/5"
        :style="{ maxWidth: contentWidth + 'px' }"
      >
        <div
          class="flex h-full min-h-[600px] flex-col items-center justify-center gap-2 p-10 text-center text-slate-400"
        >
          <p class="text-sm font-medium">Your email body</p>
          <p class="text-xs">
            Drag content from the left, or click here to edit body settings.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
