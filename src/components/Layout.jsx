import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { supabase } from '../supabase.js'
import { cartCount } from '../cart.js'
import CartDrawer from './CartDrawer.jsx'

export default function Layout() {
  const { items, user, openDrawer, toast, hideToast } = useStore()
  const count = cartCount(items)

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap bar">
          <Link className="logo" to="/" aria-label="AutoBuys home">
            <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M0 0h20l8 8v20H8l-8-8z" fill="currentColor" /><path d="M8 11l6 5-6 5M15 11l6 5-6 5" stroke="var(--bg)" strokeWidth="2.4" fill="none" /></svg>
            AutoBuys
          </Link>
          <nav className="main-nav" aria-label="Main">
            <a href="/#shop">Shop</a>
            <a href="/#factions">Factions</a>
            {user ? (
              <>
                <NavLink to="/orders">Orders</NavLink>
                <button className="nav-btn" type="button" onClick={() => supabase.auth.signOut()}>Log out</button>
              </>
            ) : (
              <NavLink to="/login">Log in</NavLink>
            )}
          </nav>
          <button className="cart-btn" type="button" onClick={openDrawer} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
            Cart {count > 0 && <b>{count}</b>}
          </button>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer id="help">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <h3>AutoBuys</h3>
              <p>Transformers figures, model kits and display gear for collectors and first-time fans.</p>
            </div>
            <div>
              <h3>Shop</h3>
              <ul><li><a href="/#shop">All products</a></li><li><a href="/#factions">Factions</a></li></ul>
            </div>
            <div>
              <h3>Account</h3>
              <ul>
                {user ? <li><Link to="/orders">Your orders</Link></li> : <><li><Link to="/login">Log in</Link></li><li><Link to="/register">Create an account</Link></li></>}
              </ul>
            </div>
            <div>
              <h3>About this store</h3>
              <p>A school demo project. Checkout saves a mock order. No payment is taken and nothing is shipped.</p>
            </div>
          </div>
          <p className="legal">AutoBuys is not affiliated with or endorsed by Hasbro. Transformers and related names are trademarks of their respective owners.</p>
        </div>
      </footer>

      <CartDrawer />

      <div className={`toast${toast ? ' on' : ''}`} role="status">
        <span>{toast}</span>
        <button type="button" onClick={() => { hideToast(); openDrawer() }}>View cart</button>
      </div>
    </>
  )
}
