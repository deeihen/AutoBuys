<script setup>
import { formatPrice } from '~/utils/money'
const cart = useCartStore()
useHead({ title: 'Your cart | AutoBuys' })
</script>
<template>
  <section class="wrap page">
    <h1>Your cart</h1>
    <div v-if="!cart.count" class="empty">
      <p>Your cart is empty.</p>
      <NuxtLink class="btn" to="/shop">Keep shopping</NuxtLink>
    </div>
    <div v-else class="cart-layout">
      <div>
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
      </div>
      <aside class="cart-summary" aria-label="Order summary">
        <dl class="sum">
          <div>
            <dt>Subtotal</dt>
            <dd>{{ formatPrice(cart.total) }}</dd>
          </div>
          <div class="tot">
            <dt>Total</dt>
            <dd>{{ formatPrice(cart.total) }}</dd>
          </div>
        </dl>
        <p class="note">Demo store. No payment or shipping.</p>
        <NuxtLink class="btn block" to="/checkout">Check out</NuxtLink>
      </aside>
    </div>
  </section>
</template>
