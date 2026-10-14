<script setup>
import { formatPrice } from '~/utils/money'
const cart = useCartStore()
const client = useSupabaseClient()
const user = useSupabaseUser()
const form = reactive({ name: '', email: '', address: '' })
watch(
  user,
  (value) => {
    if (value?.email && !form.email) form.email = value.email
  },
  { immediate: true }
)
const busy = ref(false)
const errorMessage = ref('')
const confirmation = ref(null)
const requestId = ref('')
onMounted(() => {
  requestId.value = crypto.randomUUID()
})
async function submit() {
  if (busy.value || !cart.count) return
  busy.value = true
  errorMessage.value = ''
  try {
    // One database transaction uses current prices and attaches auth.uid() if signed in.
    const { data, error } = await client.rpc('place_order', {
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_address: form.address.trim(),
      request_id: requestId.value,
      cart_items: cart.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    })
    if (error) throw error
    confirmation.value = data
    cart.clear()
    await refreshNuxtData('products')
  } catch (error) {
    errorMessage.value =
      error.message || 'Order could not be saved. Your cart is unchanged.'
  } finally {
    busy.value = false
  }
}
useHead({ title: 'Checkout | AutoBuys' })
</script>
<template>
  <section class="wrap page form-panel">
    <h1>Checkout</h1>
    <div v-if="confirmation" class="done" role="status">
      <h2>Thanks, {{ form.name }}.</h2>
      <p>
        Order <b>{{ confirmation.id }}</b> is confirmed.
      </p>
      <p>Total: {{ formatPrice(confirmation.total) }}</p>
      <p class="note">
        Demo store: no payment was taken. No email is sent and nothing is
        shipped.
      </p>
      <NuxtLink v-if="user" class="btn" to="/orders">View your orders</NuxtLink
      ><NuxtLink class="btn ghost" to="/shop">Continue shopping</NuxtLink>
    </div>
    <div v-else-if="!cart.count" class="empty">
      <p>Your cart is empty.</p>
      <NuxtLink class="btn" to="/shop">Keep shopping</NuxtLink>
    </div>
    <form v-else class="page-panel" @submit.prevent="submit">
      <fieldset :disabled="busy" style="border: 0; padding: 0; margin: 0">
        <legend class="sr">Customer details</legend>
        <div class="field">
          <label for="name">Full name</label
          ><input
            id="name"
            v-model="form.name"
            autocomplete="name"
            required
            maxlength="120"
          />
        </div>
        <div class="field">
          <label for="email">Email</label
          ><input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            maxlength="254"
          />
        </div>
        <div class="field">
          <label for="address">Full address</label
          ><textarea
            id="address"
            v-model="form.address"
            autocomplete="street-address"
            required
            maxlength="1000"
            rows="3"
          />
        </div>
      </fieldset>
      <p class="note">
        Guest checkout allowed. Sign in before ordering to keep order history.
        No payment is taken.
      </p>
      <dl class="sum" style="margin: 1rem 0">
        <div class="tot">
          <dt>Total</dt>
          <dd>{{ formatPrice(cart.total) }}</dd>
        </div>
      </dl>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <button class="btn block" :disabled="busy">
        {{ busy ? 'Saving order…' : 'Place mock order' }}
      </button>
      <NuxtLink class="link" to="/cart">Back to cart</NuxtLink>
    </form>
  </section>
</template>
