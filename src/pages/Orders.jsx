import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { supabase } from '../supabase.js'
import { formatPrice } from '../cart.js'

const date = (value) => new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeZone: 'Asia/Manila' }).format(new Date(value))

export default function Orders() {
  const { user } = useStore()
  const [orders, setOrders] = useState([])
  const [state, setState] = useState('loading')

  const load = useCallback(async () => {
    if (!user) return
    setState('loading')
    // RLS already limits rows to the owner; the filter keeps the query explicit.
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) return setState('error')
    setOrders(data)
    setState('ready')
  }, [user])

  useEffect(() => {
    setOrders([]) // never show the previous user's orders after an account switch
    load()
  }, [load])

  return (
    <section className="wrap page">
      <h1>Your orders</h1>
      {!user ? (
        <div className="empty">
          <p>Log in to view your order history.</p>
          <Link className="btn" to="/login">Log in</Link>
          <p className="note">Guest orders are confirmed at checkout and do not appear in account history.</p>
        </div>
      ) : state === 'loading' ? (
        <p className="note" role="status">Loading orders…</p>
      ) : state === 'error' ? (
        <div className="empty" role="alert">
          <p>Could not load orders.</p>
          <button className="btn" type="button" onClick={load}>Try again</button>
        </div>
      ) : !orders.length ? (
        <div className="empty">
          <p>No orders yet.</p>
          <Link className="btn" to="/#shop">Start shopping</Link>
        </div>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="order">
            <h2>Order {order.id.slice(0, 8)}</h2>
            <p className="note">{date(order.created_at)} · {formatPrice(order.total)}</p>
            <ul>
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.products?.name || 'Product no longer listed'} × {item.quantity} — {formatPrice(item.unit_price * item.quantity)}
                </li>
              ))}
            </ul>
          </article>
        ))
      )}
    </section>
  )
}
