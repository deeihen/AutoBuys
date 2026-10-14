import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '../stores/cart.js'

test('cart actions keep totals and header count in sync', () => {
  setActivePinia(createPinia())
  const cart = useCartStore()
  const product = {
    id: 'prime',
    name: 'Prime',
    price: 3499,
    stock: 2,
    faction: 'Autobot',
    category: 'Figure',
  }
  cart.add(product)
  cart.add(product)
  cart.add(product)
  assert.equal(cart.count, 2)
  assert.equal(cart.total, 6998)
  cart.updateQuantity(product.id, 1)
  assert.equal(cart.total, 3499)
  cart.updateQuantity(product.id, 0)
  assert.equal(cart.count, 0)
  cart.add(product)
  cart.remove(product.id)
  assert.equal(cart.total, 0)
  cart.add(product)
  cart.clear()
  assert.deepEqual(cart.items, [])
})
