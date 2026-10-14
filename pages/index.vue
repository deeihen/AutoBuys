<script setup>
const { data: products, pending, error, refresh } = await useProducts()
const robot = ref(false)
let timer
onMounted(() => {
  timer = setTimeout(() => {
    robot.value = true
  }, 900)
})
onBeforeUnmount(() => clearTimeout(timer))
const featured = computed(() =>
  products.value.filter((product) => product.featured)
)
const factionCount = (faction) =>
  products.value.filter((product) => product.faction === faction).length
useHead({
  title: 'AutoBuys | Transformers figures, model kits and display gear',
})
</script>
<template>
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <h1>Vehicles on the shelf. Robots on demand.</h1>
        <p class="lead">
          Transformers figures, model kits and display gear for collectors and
          first-time fans. Mock checkout. No payment is taken.
        </p>
        <div class="actions">
          <NuxtLink class="btn" to="/shop?category=Figure"
            >Shop figures</NuxtLink
          ><a class="btn ghost" href="#factions">Browse by faction</a>
        </div>
      </div>
      <div class="bay">
        <ProductArt :robot="robot" />
        <div class="bay-bar">
          <p class="mode">
            Mode<b>{{ robot ? 'Robot' : 'Vehicle' }}</b>
          </p>
          <button class="btn" :aria-pressed="robot" @click="robot = !robot">
            Transform
          </button>
        </div>
      </div>
    </div>
  </section>
  <section id="factions" class="wrap" aria-label="Browse by faction">
    <div class="tiles">
      <NuxtLink class="tile t-a" to="/shop?faction=Autobot"
        ><h3>Autobots</h3>
        <p>{{ factionCount('Autobot') }} products</p></NuxtLink
      >
      <NuxtLink class="tile t-d" to="/shop?faction=Decepticon"
        ><h3>Decepticons</h3>
        <p>{{ factionCount('Decepticon') }} products</p></NuxtLink
      >
      <NuxtLink class="tile t-g" to="/shop?category=Display%20Gear"
        ><h3>Display gear</h3>
        <p>
          {{
            products.filter((p) => p.category === 'Display Gear').length
          }}
          products
        </p></NuxtLink
      >
    </div>
    <div class="perks">
      <p><b>Philippine peso prices</b>Build your collection in PHP.</p>
      <p><b>Guest checkout</b>No account required.</p>
      <p><b>School demo</b>No payment or shipping.</p>
    </div>
  </section>
  <section class="wrap shop">
    <div class="shop-head">
      <h2>Featured products</h2>
      <p>Hover a figure to transform it.</p>
    </div>
    <ProductGrid
      :products="featured"
      :pending="pending"
      :error="error"
      @retry="refresh"
    /><NuxtLink class="btn" style="margin-top: 1.5rem" to="/shop"
      >Shop all products</NuxtLink
    >
  </section>
</template>
