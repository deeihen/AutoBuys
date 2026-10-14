<script setup>
import { formatPrice } from '~/utils/money'
const user = useSupabaseUser()
const client = useSupabaseClient()
// Auth changes clear/refetch history, including when another user signs in.
const {
  data: orders,
  pending,
  error,
  refresh,
} = await useAsyncData(
  'orders',
  async () => {
    if (!user.value) return []
    const { data: auth, error: authError } = await client.auth.getUser()
    if (authError) throw authError
    if (!auth.user) return []
    const { data, error } = await client
      .from('orders')
      .select('*, order_items(*, products(name))')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  { default: () => [], watch: [user] }
)
const date = (value) =>
  new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Manila',
  }).format(new Date(value))
useHead({ title: 'Your orders | AutoBuys' })
</script>
<template>
  <section class="wrap page">
    <h1>Your orders</h1>
    <div v-if="!user" class="empty">
      <p>Log in to view your order history.</p>
      <NuxtLink class="btn" to="/login">Log in</NuxtLink>
      <p class="note">
        Guest orders are confirmed at checkout and do not appear in account
        history.
      </p>
    </div>
    <p v-else-if="pending" class="status" role="status">Loading orders…</p>
    <div v-else-if="error" class="empty" role="alert">
      <p>Could not load orders.</p>
      <button class="btn" @click="refresh">Try again</button>
    </div>
    <div v-else-if="!orders.length" class="empty">
      <p>No orders yet.</p>
      <NuxtLink class="btn" to="/shop">Start shopping</NuxtLink>
    </div>
    <article
      v-for="order in user && !pending && !error ? orders : []"
      :key="order.id"
      class="order"
    >
      <h2>Order {{ order.id.slice(0, 8) }}</h2>
      <p>{{ date(order.created_at) }} · {{ formatPrice(order.total) }}</p>
      <ul>
        <li v-for="item in order.order_items" :key="item.id">
          {{ item.products?.name || 'Product no longer listed' }} ×
          {{ item.quantity }} —
          {{ formatPrice(item.unit_price * item.quantity) }}
        </li>
      </ul>
      <p class="note">Mock order. No payment or shipping.</p>
    </article>
  </section>
</template>
