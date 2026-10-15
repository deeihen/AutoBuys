import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { supabase } from '../supabase.js'
import { cartCount, cartTotal, formatPrice } from '../cart.js'
import Art from './Art.jsx'

export default function CartDrawer() {
  const { items, setQuantity, clearCart, user, drawerOpen, closeDrawer, loadProducts } = useStore()
  const [view, setView] = useState('cart') // cart | checkout | done
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)
  const requestId = useRef(crypto.randomUUID())
  const closeBtn = useRef()

  useEffect(() => {
    if (!drawerOpen) return
    const lastFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    setTimeout(() => closeBtn.current?.focus(), 50)
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      lastFocus?.focus?.()
      setView((v) => (v === 'done' ? 'cart' : v))
    }
  }, [drawerOpen])

  useEffect(() => {
    if (user?.email) setForm((f) => (f.email ? f : { ...f, email: user.email }))
  }, [user])

  const total = cartTotal(items)
  const field = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) })

  async function placeOrder(e) {
    e.preventDefault()
    if (busy || !items.length) return
    setBusy(true)
    setError('')
    // One database transaction re-reads prices and stock, so the browser cannot set totals.
    const { data, error } = await supabase.rpc('place_order', {
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_address: form.address.trim(),
      request_id: requestId.current,
      cart_items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
    })
    setBusy(false)
    if (error) return setError(error.message || 'Order could not be saved. Your cart is unchanged.')
    setReceipt({ ...data, name: form.name.trim().split(' ')[0] })
    requestId.current = crypto.randomUUID()
    clearCart()
    setView('done')
    loadProducts()
  }

  const title = { cart: 'Your cart', checkout: 'Checkout', done: 'Order placed' }[view]

  return (
    <>
      <div className={`scrim${drawerOpen ? ' on' : ''}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? ' on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dTitle">
        <div className="d-head">
          <h2 id="dTitle">{title}</h2>
          <button ref={closeBtn} type="button" onClick={closeDrawer}>Close</button>
        </div>

        {view === 'cart' && (
          <>
            <div className="d-body">
              {!items.length ? (
                <div className="empty">
                  <p>Your cart is empty.</p>
                  <button className="btn" type="button" onClick={closeDrawer}>Keep shopping</button>
                </div>
              ) : (
                items.map((i) => (
                  <div key={i.id} className={`line f-${i.faction.toLowerCase()}`}>
                    <div className="thumb"><Art product={i} /></div>
                    <div>
                      <p className="ln">{i.name}</p>
                      <p className="ls">{formatPrice(i.price)} each</p>
                      <div className="qty">
                        <button type="button" onClick={() => setQuantity(i.id, i.quantity - 1)} aria-label={`Decrease quantity of ${i.name}`}>&minus;</button>
                        <span>{i.quantity}</span>
                        <button type="button" disabled={i.quantity >= Math.min(i.stock, 100)} onClick={() => setQuantity(i.id, i.quantity + 1)} aria-label={`Increase quantity of ${i.name}`}>+</button>
                      </div>
                    </div>
                    <div className="end">
                      <p className="lp">{formatPrice(i.price * i.quantity)}</p>
                      <button type="button" className="link" onClick={() => setQuantity(i.id, 0)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="d-foot">
                <Summary count={cartCount(items)} total={total} />
                <button className="btn block" type="button" onClick={() => setView('checkout')}>Check out</button>
              </div>
            )}
          </>
        )}

        {view === 'checkout' && (
          <>
            <div className="d-body">
              <form id="checkout" onSubmit={placeOrder}>
                <fieldset disabled={busy} className="plain">
                  <legend className="sr">Customer details</legend>
                  <div className="field"><label htmlFor="cName">Full name</label><input id="cName" autoComplete="name" required maxLength={120} {...field('name')} /></div>
                  <div className="field"><label htmlFor="cEmail">Email</label><input id="cEmail" type="email" autoComplete="email" required maxLength={254} {...field('email')} /></div>
                  <div className="field"><label htmlFor="cAddr">Full address</label><textarea id="cAddr" autoComplete="street-address" required maxLength={1000} rows={3} {...field('address')} /></div>
                </fieldset>
                <p className="note">
                  {user ? 'This order will be saved to your account.' : <>Checking out as a guest. <Link className="link" to="/login" onClick={closeDrawer}>Log in</Link> to keep order history.</>}
                  {' '}This is a demo store. No payment is taken and nothing is shipped.
                </p>
                {error && <p className="error" role="alert">{error}</p>}
              </form>
            </div>
            <div className="d-foot">
              <Summary count={cartCount(items)} total={total} />
              <button className="btn block" type="submit" form="checkout" disabled={busy || !items.length}>{busy ? 'Saving order…' : 'Place order'}</button>
              <button className="btn ghost block" type="button" onClick={() => setView('cart')}>Back to cart</button>
            </div>
          </>
        )}

        {view === 'done' && receipt && (
          <div className="d-body">
            <div className="done" role="status">
              <h3>Thanks, {receipt.name}.</h3>
              <p>Order <b>{String(receipt.id).slice(0, 8)}</b> is confirmed. Total {formatPrice(receipt.total)}.</p>
              <p className="note">Demo store: no payment was taken.</p>
              {user && <Link className="btn ghost" to="/orders" onClick={closeDrawer}>View your orders</Link>}
              <button className="btn" type="button" onClick={closeDrawer}>Continue shopping</button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

function Summary({ count, total }) {
  return (
    <dl className="sum">
      <div><dt>Items</dt><dd>{count}</dd></div>
      <div className="tot"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
    </dl>
  )
}
