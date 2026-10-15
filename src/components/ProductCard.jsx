import { useState } from 'react'
import { useStore } from '../store.jsx'
import { formatPrice } from '../cart.js'
import Art from './Art.jsx'

export const fClass = (p) => `f-${p.faction.toLowerCase()}`

export function Badge({ product }) {
  if (product.stock <= 0) return <span className="badge t-sold-out">Sold out</span>
  if (product.stock <= 5) return <span className="badge t-sale">Only {product.stock} left</span>
  if (product.featured) return <span className="badge t-new">Featured</span>
  return null
}

export function AddButton({ product, className = 'btn' }) {
  const { add, items } = useStore()
  const [added, setAdded] = useState(false)
  const inCart = items.find((i) => i.id === product.id)?.quantity || 0
  const out = product.stock <= 0
  const maxed = !out && inCart >= Math.min(product.stock, 100)
  const onClick = () => {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  return (
    <button className={className} type="button" disabled={out || maxed} onClick={onClick}>
      {out ? 'Sold out' : maxed ? 'Max in cart' : added ? 'Added to cart' : 'Add to cart'}
    </button>
  )
}

export default function ProductCard({ product, onOpen }) {
  const out = product.stock <= 0
  return (
    <article className={`card ${fClass(product)}${out ? ' out' : ''}`}>
      <button className="media" type="button" onClick={() => onOpen(product)} aria-label={`View details for ${product.name}`}>
        <Badge product={product} />
        <Art product={product} />
      </button>
      <div className="body">
        <p className="meta">
          <span className="fac"><i className="dot" />{product.faction}</span>
          <span>{product.category}</span>
        </p>
        <h3>{product.name}</h3>
        <div className="row">
          <span className="price">{formatPrice(product.price)}</span>
          {!out && <span className="rating">{product.stock} in stock</span>}
        </div>
        <AddButton product={product} />
      </div>
    </article>
  )
}
