<script setup>
const cart = useCartStore()
const user = useSupabaseUser()
const client = useSupabaseClient()
const authError = ref('')
const theme = ref('system')
onMounted(() => {
  try {
    theme.value = localStorage.getItem('autobuys-theme') || 'system'
  } catch {}
  applyTheme()
})
function applyTheme() {
  if (theme.value === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme.value
}
function toggleTheme() {
  const modes = ['system', 'light', 'dark']
  theme.value = modes[(modes.indexOf(theme.value) + 1) % modes.length]
  applyTheme()
  try {
    localStorage.setItem('autobuys-theme', theme.value)
  } catch {}
}
async function signOut() {
  const { error } = await client.auth.signOut()
  authError.value = error ? error.message : ''
  if (!error) await navigateTo('/')
}
</script>
<template>
  <header class="site-header">
    <div class="wrap bar">
      <NuxtLink class="logo" to="/" aria-label="AutoBuys home">
        <svg viewBox="0 0 28 28" aria-hidden="true">
          <path d="M0 0h20l8 8v20H8l-8-8z" fill="currentColor" />
          <path
            d="M8 11l6 5-6 5M15 11l6 5-6 5"
            stroke="var(--bg)"
            stroke-width="2.4"
            fill="none"
          /></svg
        >AutoBuys
      </NuxtLink>
      <nav class="main-nav" aria-label="Main">
        <NuxtLink to="/shop">Shop</NuxtLink
        ><NuxtLink to="/#factions">Factions</NuxtLink>
        <NuxtLink v-if="user" to="/orders">Orders</NuxtLink
        ><NuxtLink v-else to="/login">Log in</NuxtLink>
        <button v-if="user" class="link" @click="signOut">Log out</button>
      </nav>
      <button
        class="theme-button"
        :aria-label="'Change theme, current: ' + theme"
        @click="toggleTheme"
      >
        {{ theme }} theme
      </button>
      <NuxtLink
        class="cart-btn"
        to="/cart"
        :aria-label="'Open cart, ' + cart.count + ' items'"
        >Cart
        <b v-if="cart.count" aria-live="polite">{{ cart.count }}</b></NuxtLink
      >
    </div>
    <nav class="wrap mobile-nav" aria-label="Mobile navigation">
      <NuxtLink to="/shop">Shop</NuxtLink
      ><NuxtLink to="/#factions">Factions</NuxtLink>
      <NuxtLink v-if="user" to="/orders">Orders</NuxtLink
      ><NuxtLink v-else to="/login">Log in</NuxtLink>
      <button v-if="user" class="link" @click="signOut">Log out</button>
    </nav>
    <p v-if="authError" class="wrap error" role="alert">{{ authError }}</p>
  </header>
</template>
