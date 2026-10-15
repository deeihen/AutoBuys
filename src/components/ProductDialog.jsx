import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../cart.js'
import Art from './Art.jsx'
import { AddButton, fClass } from './ProductCard.jsx'

// Native <dialog> gives focus trapping and Escape-to-close for free.
export default function ProductDialog({ product, onClose }) {
  const ref = useRef()
  const [robot, setRobot] = useState(false)

  useEffect(() => {
    if (!product) return
    ref.current.showModal()
    setRobot(false)
    const t = setTimeout(() => setRobot(true), 350)
    return () => clearTimeout(t)
  }, [product])

  const canTransform = product?.category === 'Figure' && !product?.image_url

  return (
    <dialog ref={ref} aria-label="Product details" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}>
      {product && (
        <>
          <button className="x" type="button" onClick={() => ref.current.close()}>Close</button>
          <div className={`pdp ${fClass(product)}`}>
            <div className="pdp-media">
              <Art product={product} robot={robot} />
              {canTransform && <button className="btn" type="button" onClick={() => setRobot(!robot)}>Transform</button>}
            </div>
            <div className="pdp-info">
              <p className="meta">
                <span className="fac"><i className="dot" />{product.faction}</span>
                <span>{product.category}</span>
              </p>
              <h2>{product.name}</h2>
              <p className="price">{formatPrice(product.price)}</p>
              <p>{product.description}</p>
              <dl>
                <dt>Stock</dt><dd>{product.stock > 0 ? `${product.stock} available` : 'Sold out'}</dd>
                <dt>Checkout</dt><dd>Mock order, no payment taken</dd>
              </dl>
              <AddButton product={product} className="btn block" />
            </div>
          </div>
        </>
      )}
    </dialog>
  )
}
