<script setup>
defineProps({ modelValue: { type: String, default: 'All' } })
defineEmits(['update:modelValue'])
const factions = ['All', 'Autobot', 'Decepticon', 'Neutral']
</script>
<template>
  <div class="filter-row" role="group" aria-label="Faction filter">
    <span>Faction</span>
    <button
      v-for="faction in factions"
      :key="faction"
      class="chip"
      :aria-pressed="modelValue === faction"
      @click="$emit('update:modelValue', faction)"
    >
      <i
        v-if="faction !== 'All'"
        class="dot"
        :style="{ '--fc': 'var(--' + faction.toLowerCase() + ')' }"
        aria-hidden="true"
      />{{ faction }}
    </button>
  </div>
</template>
