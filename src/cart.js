// Pure cart helpers. No React here, so `npm test` can run them with plain Node.
export const FACTIONS = ['Autobot', 'Decepticon', 'Neutral']
export const CATEGORIES = ['Figure', 'Model Kit', 'Display Gear']

// Store only the fields the cart needs. Reject damaged or edited saved data.
export function cleanItem(product, quantity) {
  const price = Number(product?.price)
  const stock = Number(product?.stock)
  if (
    !product ||
    typeof product.id !== 'string' ||
    typeof product.name !== 'string' ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock <= 0 ||
    !FACTIONS.includes(product.faction) ||
    !CATEGORIES.includes(product.category) ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  )
    return null
  return {
    id: product.id,
    name: product.name,
    price,
    stock,
    faction: product.faction,
    category: product.category,
    image_url: typeof product.image_url === 'string' ? product.image_url : '',
    quantity: Math.min(quantity, stock, 100),
  }
}

// Re-check saved items against fresh product data (price, stock, removed items).
export const syncItems = (items, products) =>
  items
    .map((item) => cleanItem(products.find((p) => p.id === item.id), item.quantity))
    .filter(Boolean)

export const cartCount = (items) => items.reduce((sum, item) => sum + item.quantity, 0)

// Integer cents avoid 0.1 + 0.2 style rounding errors.
export const cartTotal = (items) =>
  items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100

const formatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
export const formatPrice = (value) => formatter.format(Number(value) || 0)
