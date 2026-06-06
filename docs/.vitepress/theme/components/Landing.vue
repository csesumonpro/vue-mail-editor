<script setup lang="ts">
import Hero from './Hero.vue'
import LiveDemo from './LiveDemo.vue'
import FeatureGrid from './FeatureGrid.vue'
import BlockShowcase from './BlockShowcase.vue'
import Quickstart from './Quickstart.vue'
import Highlights from './Highlights.vue'
import ApiGlance from './ApiGlance.vue'
import FinalCta from './FinalCta.vue'
import SiteFooter from './SiteFooter.vue'
</script>

<template>
  <div class="vee-page">
    <Hero />

    <section class="vee-section">
      <div class="vee-container">
        <div class="vee-center" style="margin-bottom: 36px">
          <span class="vee-eyebrow">Live demo</span>
          <h2 class="vee-h2">This is the real editor, running right here</h2>
          <p class="vee-sub">
            Drag a block from the rail, click to edit, tweak it in the inspector. No video, no
            mockup — the actual component embedded in this page.
          </p>
        </div>
        <LiveDemo />
      </div>
    </section>

    <FeatureGrid />
    <BlockShowcase />
    <Quickstart />
    <Highlights />
    <ApiGlance />
    <FinalCta />
    <SiteFooter />
  </div>
</template>
