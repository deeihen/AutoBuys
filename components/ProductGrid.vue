<script setup>
defineProps({
  products: { type: Array, default: () => [] },
  pending: Boolean,
  error: { default: null },
})
defineEmits(['retry'])
</script>
<template>
  <div :aria-busy="pending">
    <p v-if="pending" class="status" role="status">Loading products…</p>
    <div v-else-if="error" class="empty" role="alert">
      <p>Could not load products. Check your connection and Supabase setup.</p>
      <button class="btn" @click="$emit('retry')">Try again</button>
    </div>
    <div v-else class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
      <div v-if="!products.length" class="empty">
        <p>No products match those filters.</p>
        <slot />
      </div>
    </div>
  </div>
</template>
