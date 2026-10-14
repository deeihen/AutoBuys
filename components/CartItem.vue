<script setup>
import { formatPrice } from '~/utils/money'
defineProps({ item: { type: Object, required: true } })
const cart = useCartStore()
</script>
<template>
  <article :class="['line', 'f-' + item.faction.toLowerCase()]">
    <NuxtLink
      class="thumb"
      :to="'/product/' + item.id"
      :aria-label="'View ' + item.name"
      ><ProductArt :product="item" :robot="true"
    /></NuxtLink>
    <div>
      <p class="ln">{{ item.name }}</p>
      <p class="ls">{{ formatPrice(item.price) }} each</p>
      <div class="qty">
        <button
          :aria-label="'Decrease quantity of ' + item.name"
          @click="cart.updateQuantity(item.id, item.quantity - 1)"
        >
          −</button
        ><span aria-live="polite">{{ item.quantity }}</span
        ><button
          :disabled="item.quantity >= item.stock"
          :aria-label="'Increase quantity of ' + item.name"
          @click="cart.updateQuantity(item.id, item.quantity + 1)"
        >
          +
        </button>
      </div>
    </div>
    <div class="end">
      <p class="lp">{{ formatPrice(item.price * item.quantity) }}</p>
      <button
        class="link"
        :aria-label="'Remove ' + item.name"
        @click="cart.remove(item.id)"
      >
        Remove
      </button>
    </div>
  </article>
</template>
