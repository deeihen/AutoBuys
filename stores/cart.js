import { defineStore } from 'pinia'
import { cleanItem, cartCount, cartTotal } from '../utils/cart.js'
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: {
    count: (state) => cartCount(state.items),
    total: (state) => cartTotal(state.items),
  },
  actions: {
    add(product) {
      const existing = this.items.find((item) => item.id === product.id)
      const item = cleanItem(product, (existing?.quantity || 0) + 1)
      if (!item) return
      if (existing) Object.assign(existing, item)
      else this.items.push(item)
    },
    remove(id) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    updateQuantity(id, quantity) {
      if (quantity <= 0) return this.remove(id)
      const item = this.items.find((item) => item.id === id)
      if (item && Number.isInteger(quantity))
        item.quantity = Math.min(quantity, item.stock, 100)
    },
    clear() {
      this.items = []
    },
  },
})
