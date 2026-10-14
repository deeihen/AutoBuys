<script setup>
defineProps({
  product: {
    type: Object,
    default: () => ({
      name: 'Transforming figure',
      faction: 'Autobot',
      category: 'Figure',
    }),
  },
  robot: Boolean,
})
const failed = ref(false)
</script>
<template>
  <img
    v-if="product.image_url && !failed"
    class="photo"
    :src="product.image_url"
    :alt="product.name"
    loading="lazy"
    @error="failed = true"
  />
  <div
    v-else
    role="img"
    :aria-label="product.name + ' — abstract illustration'"
    :class="'f-' + product.faction.toLowerCase()"
  >
    <template v-if="product.category === 'Figure'"
      ><svg
        :class="['fig', { robot }]"
        viewBox="0 0 400 320"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          class="p p-legL"
          x="150"
          y="192"
          width="44"
          height="96"
          style="--d: 0.05s"
        />
        <rect
          class="p p-legR"
          x="206"
          y="192"
          width="44"
          height="96"
          style="--d: 0.05s"
        />
        <rect
          class="p p-hips"
          x="150"
          y="158"
          width="100"
          height="30"
          style="--d: 0.1s"
        />
        <rect class="p p-torso" x="140" y="64" width="120" height="90" />
        <rect
          class="p p-armL"
          x="104"
          y="68"
          width="30"
          height="96"
          style="--d: 0.12s"
        />
        <rect
          class="p p-armR"
          x="266"
          y="68"
          width="30"
          height="96"
          style="--d: 0.12s"
        />
        <rect
          class="p p-head"
          x="178"
          y="20"
          width="44"
          height="38"
          style="--d: 0.18s"
        />
        <rect
          class="p p-eye"
          x="184"
          y="33"
          width="32"
          height="9"
          style="--d: 0.18s"
        />
        <circle class="p p-wheelL" cx="122" cy="70" r="18" style="--d: 0.2s" />
        <circle
          class="p p-wheelR"
          cx="278"
          cy="70"
          r="18"
          style="--d: 0.2s"
        /></svg
    ></template>
    <template v-else
      ><svg
        class="fig gear"
        viewBox="0 0 400 320"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M90 90 200 50 310 90 310 240 200 280 90 240Z" />
        <path class="edge" d="M90 90 200 130 310 90M200 130V280" />
        <path class="mark" d="M150 176l30 14-30 14M190 176l30 14-30 14" /></svg
    ></template>
  </div>
</template>
