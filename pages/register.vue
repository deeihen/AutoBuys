<script setup>
const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')
async function submit() {
  if (busy.value) return
  busy.value = true
  message.value = errorMessage.value = ''
  try {
    const { data, error } = await client.auth.signUp({
      email: email.value.trim(),
      password: password.value,
      options: { emailRedirectTo: window.location.origin + '/login' },
    })
    if (error) throw error
    if (data.session) await navigateTo('/orders')
    else
      message.value = 'Check your email to confirm your account, then log in.'
  } catch (error) {
    errorMessage.value = error.message || 'Could not connect. Try again.'
  } finally {
    busy.value = false
  }
}
useHead({ title: 'Register | AutoBuys' })
</script>
<template>
  <section class="wrap page form-panel">
    <h1>Create account</h1>
    <form class="page-panel" @submit.prevent="submit">
      <div class="field">
        <label for="email">Email</label
        ><input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :disabled="busy"
        />
      </div>
      <div class="field">
        <label for="password">Password</label
        ><input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          minlength="6"
          required
          :disabled="busy"
        />
      </div>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <p v-if="message" role="status">{{ message }}</p>
      <button class="btn block" :disabled="busy">
        {{ busy ? 'Please wait…' : 'Register' }}
      </button>
      <p style="margin-top: 1rem">
        <NuxtLink class="link" to="/login"
          >Already have an account? Log in</NuxtLink
        >
      </p>
    </form>
  </section>
</template>
