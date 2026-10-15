import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store.jsx'
import { CATEGORIES, FACTIONS } from '../cart.js'
import { Fig } from '../components/Art.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductDialog from '../components/ProductDialog.jsx'

const SORTS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.i - b.i,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  stock: (a, b) => b.stock - a.stock,
}
const Chip = ({ value, current, set, dot, children }) => (
<button type="button" className="chip" aria-pressed={current === value} onClick={() => set(value)}>
{dot && <i className="dot" style={{ '--fc': `var(--${dot})` }} />}
{children}
</button>
)

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

export default function Home() {
  const { products, productsState, productsError, loadProducts } = useStore()
  const [faction, setFaction] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [open, setOpen] = useState(null)
  const [robot, setRobot] = useState(false)
  const shopRef = useRef()

  useEffect(() => {
    const t = setTimeout(() => setRobot(true), 900)
    return () => clearTimeout(t)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .map((p, i) => ({ ...p, i }))
      .filter((p) => (faction === 'all' || p.faction === faction) && (category === 'all' || p.category === category) && (!q || p.name.toLowerCase().includes(q)))
      .sort(SORTS[sort])
  }, [products, faction, category, query, sort])

  const count = (key, val) => products.filter((p) => p[key] === val).length
  const reset = () => { setFaction('all'); setCategory('all'); setQuery('') }
  const jump = (f, c) => {
    setFaction(f)
    setCategory(c)
    shopRef.current.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Vehicles on the shelf. Robots on demand.</h1>
            <p className="lead">Transformers figures, model kits and display gear for collectors and first-time fans.</p>
            <div className="actions">
              <a className="btn" href="#shop">Shop figures</a>
              <a className="btn ghost" href="#factions">Browse by faction</a>
            </div>
          </div>
          <div className="bay">
            <div role="img" aria-label="Abstract illustration of a vehicle unfolding into a robot">
              <Fig robot={robot} accent="#C73A30" />
            </div>
            <div className="bay-bar">
              <p className="mode">Mode<b>{robot ? 'Robot' : 'Vehicle'}</b></p>
              <button className="btn" type="button" onClick={() => setRobot(!robot)}>Transform</button>
            </div>
          </div>
        </div>
      </section>

      <section id="factions" className="wrap" aria-label="Browse by faction">
        <div className="tiles">
          <button className="tile t-a" type="button" onClick={() => jump('Autobot', 'all')}><h3>Autobots</h3><p>{plural(count('faction', 'Autobot'), 'product')}</p></button>
          <button className="tile t-d" type="button" onClick={() => jump('Decepticon', 'all')}><h3>Decepticons</h3><p>{plural(count('faction', 'Decepticon'), 'product')}</p></button>
          <button className="tile t-g" type="button" onClick={() => jump('all', 'Display Gear')}><h3>Display gear</h3><p>{plural(count('category', 'Display Gear'), 'product')}</p></button>
        </div>
        <div className="perks">
          <p><b>Guest checkout</b>No account needed to place an order.</p>
          <p><b>Live stock</b>Counts update after every order.</p>
          <p><b>Order history</b>Log in to see your past orders.</p>
        </div>
      </section>

      <section id="shop" ref={shopRef} className="wrap shop">
        <div className="shop-head">
          <h2>Shop</h2>
          <p>Hover a figure to transform it. On touch, tap it.</p>
        </div>
        <div className="toolbar">
          <div className="search">
            <label className="sr" htmlFor="q">Search products</label>
            <input id="q" type="search" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="sort">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
              <option value="stock">Most in stock</option>
            </select>
          </div>
        </div>
        <div className="filter-row" role="group" aria-label="Filter by faction">
          <span>Faction</span>
          <Chip value="all" current={faction} set={setFaction}>All</Chip>
          {FACTIONS.map((f) => <Chip key={f} value={f} current={faction} set={setFaction} dot={f.toLowerCase()}>{f}</Chip>)}
        </div>
        <div className="filter-row" role="group" aria-label="Filter by category">
          <span>Category</span>
          <Chip value="all" current={category} set={setCategory}>All</Chip>
          {CATEGORIES.map((c) => <Chip key={c} value={c} current={category} set={setCategory}>{c}</Chip>)}
        </div>

        {productsState === 'loading' && <p className="note" role="status">Loading products…</p>}
        {productsState === 'error' && (
          <div className="empty" role="alert">
            <p>Could not load products. Check your connection and Supabase keys.</p>
            {productsError && <p className="note"><code>{productsError}</code></p>}
            <button className="btn" type="button" onClick={loadProducts}>Try again</button>
          </div>
        )}
        {productsState === 'ready' && (
          <>
            <p className="note" aria-live="polite" style={{ marginTop: '.8rem' }}>{plural(visible.length, 'product')}</p>
            <div className="grid">
              {visible.length ? (
                visible.map((p) => <ProductCard key={p.id} product={p} onOpen={setOpen} />)
              ) : (
                <div className="empty">
                  <p>No products match those filters.</p>
                  <button className="btn" type="button" onClick={reset}>Clear filters</button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <ProductDialog product={open && products.find((p) => p.id === open.id)} onClose={() => setOpen(null)} />
    </>
  )
}
