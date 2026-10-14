<script setup>
import { formatPrice } from '~/utils/money'
const route = useRoute()
const client = useSupabaseClient()
const cart = useCartStore()
const robot = ref(true)
const added = ref(false)
const {
  data: product,
  pending,
  error,
  refresh,
} = await useAsyncData(
  () => 'product-' + route.params.id,
  async () => {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', route.params.id)
      .maybeSingle()
    if (error) throw error
    return data
  }
)
const atLimit = computed(
  () =>
    !product.value ||
    (cart.items.find((item) => item.id === product.value.id)?.quantity || 0) >=
      product.value.stock
)
function add() {
  cart.add(product.value)
  added.value = true
}
useHead(() => ({ title: (product.value?.name || 'Product') + ' | AutoBuys' }))
</script>
<template>
  <section class="wrap page">
    <p v-if="pending" class="status" role="status">Loading product…</p>
    <div v-else-if="error" class="empty" role="alert">
      <p>Could not load this product.</p>
      <button class="btn" @click="refresh">Try again</button>
    </div>
    <div v-else-if="!product" class="empty">
      <h1>Product not found</h1>
      <NuxtLink class="btn" to="/shop">Back to shop</NuxtLink>
    </div>
    <div v-else :class="['pdp', 'f-' + product.faction.toLowerCase()]">
      <div class="pdp-media">
        <ProductArt :product="product" :robot="robot" /><button
          v-if="product.category === 'Figure' && !product.image_url"
          class="btn"
          :aria-pressed="robot"
          @click="robot = !robot"
        >
          Transform
        </button>
      </div>
      <div class="pdp-info">
        <p class="meta">
          <span class="fac"
            ><i class="dot" aria-hidden="true" />{{ product.faction }}</span
          >{{ product.category }}
        </p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <p>{{ product.description }}</p>
        <dl>
          <dt>Stock</dt>
          <dd>{{ product.stock }} available</dd>
          <dt>Checkout</dt>
          <dd>Mock order, no payment</dd>
        </dl>
        <button class="btn block" :disabled="atLimit" @click="add">
          {{
            !product.stock
              ? 'Sold out'
              : atLimit
                ? 'Stock limit reached'
                : 'Add to cart'
          }}
        </button>
        <p v-if="added" role="status">
          Added to cart. <NuxtLink class="link" to="/cart">View cart</NuxtLink>
        </p>
        <NuxtLink class="link" to="/shop">Back to shop</NuxtLink>
      </div>
    </div>
  </section>
</template>
