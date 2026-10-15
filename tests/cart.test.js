import test from 'node:test'
import assert from 'node:assert/strict'
import { cleanItem, cartCount, cartTotal, syncItems, formatPrice } from '../src/cart.js'

const product = { id: 'prime', name: 'Prime', price: 10.1, stock: 3, faction: 'Autobot', category: 'Figure' }

test('quantities respect stock; damaged saved data is ignored', () => {
  assert.equal(cleanItem(product, 9).quantity, 3)
  assert.equal(cleanItem(product, -1), null)
  assert.equal(cleanItem(product, 1.5), null)
  assert.equal(cleanItem({ ...product, stock: 0 }, 1), null)
  assert.equal(cleanItem({ ...product, price: 'not a price' }, 1), null)
  assert.equal(cleanItem(null, 1), null)
  assert.equal(cleanItem({ ...product, stock: 200 }, 150).quantity, 100)
})

test('count and totals use integer cents; prices are formatted in PHP', () => {
  const items = [cleanItem(product, 3), cleanItem({ ...product, id: 'stand', price: 0.2 }, 2)]
  assert.equal(cartCount(items), 5)
  assert.equal(cartTotal(items), 30.7)
  assert.equal(cartCount([]), 0)
  assert.equal(cartTotal([]), 0)
  assert.match(formatPrice(3499), /3,499\.00/)
})

test('saved cart follows fresh product data', () => {
  const saved = [cleanItem(product, 3), { id: 'gone', quantity: 1 }]
  const fresh = [{ ...product, price: 12, stock: 2 }]
  assert.deepEqual(syncItems(saved, fresh).map((i) => [i.id, i.price, i.quantity]), [['prime', 12, 2]])
})

