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
    !['Autobot', 'Decepticon', 'Neutral'].includes(product.faction) ||
    !['Figure', 'Model Kit', 'Display Gear'].includes(product.category) ||
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
export const cartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
export const cartTotal = (items) =>
  items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0
  ) / 100
