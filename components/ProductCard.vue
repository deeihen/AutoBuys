<script setup>
import { formatPrice } from '~/utils/money'
const props = defineProps({ product: { type: Object, required: true } })
const cart = useCartStore()
const added = ref(false)
let timer
function add() {
  cart.add(props.product)
  added.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    added.value = false
  }, 1400)
}
onBeforeUnmount(() => clearTimeout(timer))
const atLimit = computed(
  () =>
    (cart.items.find((item) => item.id === props.product.id)?.quantity || 0) >=
    props.product.stock
)
</script>
<template>
  <article
    :class="[
      'card',
      'f-' + product.faction.toLowerCase(),
      { out: !product.stock },
    ]"
  >
    <NuxtLink
      class="media"
      :to="'/product/' + product.id"
      :aria-label="'View details for ' + product.name"
    >
      <span v-if="!product.stock" class="badge t-sold-out">Sold out</span
      ><span v-else-if="product.featured" class="badge t-new">Featured</span>
      <ProductArt :product="product" />
    </NuxtLink>
    <div class="body">
      <p class="meta">
        <span class="fac"
          ><i class="dot" aria-hidden="true" />{{ product.faction }}</span
        ><span>{{ product.category }}</span>
      </p>
      <h3>
        <NuxtLink :to="'/product/' + product.id">{{ product.name }}</NuxtLink>
      </h3>
      <p class="sub">{{ product.description.split('. ')[0] }}</p>
      <div class="row">
        <span class="price">{{ formatPrice(product.price) }}</span>
      </div>
      <button class="btn" :disabled="atLimit" @click="add">
        {{
          !product.stock
            ? 'Sold out'
            : atLimit
              ? 'Stock limit reached'
              : added
                ? 'Added to cart'
                : 'Add to cart'
        }}
      </button>
      <span class="sr" role="status">{{
        added ? product.name + ' added to cart' : ''
      }}</span>
    </div>
  </article>
</template>
