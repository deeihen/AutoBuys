<script setup>
const route = useRoute()
const { data: products, pending, error, refresh } = await useProducts()
const faction = ref('All')
const category = ref('All')
const search = ref('')
const sort = ref('featured')
const categories = ['All', 'Figure', 'Model Kit', 'Display Gear']
watch(
  () => route.query,
  (query) => {
    faction.value = ['Autobot', 'Decepticon', 'Neutral'].includes(query.faction)
      ? query.faction
      : 'All'
    category.value = categories.includes(query.category)
      ? query.category
      : 'All'
  },
  { immediate: true }
)
const visible = computed(() => {
  const query = search.value.trim().toLowerCase()
  return products.value
    .filter(
      (product) =>
        (faction.value === 'All' || product.faction === faction.value) &&
        (category.value === 'All' || product.category === category.value) &&
        (product.name + ' ' + product.description).toLowerCase().includes(query)
    )
    .sort((a, b) =>
      sort.value === 'low'
        ? a.price - b.price
        : sort.value === 'high'
          ? b.price - a.price
          : Number(b.featured) - Number(a.featured)
    )
})
function reset() {
  faction.value = category.value = 'All'
  search.value = ''
  sort.value = 'featured'
}
useHead({ title: 'Shop | AutoBuys' })
</script>
<template>
  <section class="wrap page">
    <div class="shop-head">
      <h1>Shop</h1>
      <p>{{ visible.length }} products</p>
    </div>
    <div class="toolbar">
      <div class="search">
        <label class="sr" for="search">Search products</label
        ><input
          id="search"
          v-model="search"
          type="search"
          placeholder="Search figures, kits and gear…"
        />
      </div>
      <label class="sort" for="sort"
        >Sort
        <select id="sort" v-model="sort">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select></label
      >
    </div>
    <FactionFilter v-model="faction" />
    <div class="filter-row" role="group" aria-label="Category filter">
      <span>Category</span
      ><button
        v-for="option in categories"
        :key="option"
        class="chip"
        :aria-pressed="category === option"
        @click="category = option"
      >
        {{ option }}
      </button>
    </div>
    <ProductGrid
      :products="visible"
      :pending="pending"
      :error="error"
      @retry="refresh"
      ><button class="btn" @click="reset">Clear filters</button></ProductGrid
    >
  </section>
</template>
