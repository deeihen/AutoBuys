import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase.js'
import { cleanItem, syncItems } from './cart.js'

const Store = createContext(null)
export const useStore = () => useContext(Store)

const CART_KEY = 'autobuys-cart'

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(saved) ? saved.map((i) => cleanItem(i, i?.quantity)).filter(Boolean) : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [productsState, setProductsState] = useState('loading') // loading | ready | error
  const [productsError, setProductsError] = useState('')
  const [items, setItems] = useState(loadCart)
  const [user, setUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef()

  const loadProducts = useCallback(async () => {
    setProductsState('loading')
    const { data, error } = await supabase.from('products').select('*').order('created_at').order('id')
    if (error) {
      console.error('Loading products failed:', error)
      setProductsError(error.message || String(error))
      return setProductsState('error')
    }
    setProducts(data)
    setItems((current) => syncItems(current, data))
    setProductsState('ready')
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      /* Cart still works when browser storage is unavailable. */
    }
  }, [items])

  const showToast = (message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3500)
  }

  const add = (product) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id)
      const item = cleanItem(product, (existing?.quantity || 0) + 1)
      if (!item) return current
      return existing ? current.map((i) => (i.id === item.id ? item : i)) : [...current, item]
    })
    showToast(`${product.name} added`)
  }

  const setQuantity = (id, quantity) =>
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.id !== id)
        : current.map((i) => (i.id === id ? cleanItem(i, quantity) || i : i))
    )

  const value = {
    products, productsState, productsError, loadProducts,
    items, add, setQuantity, clearCart: () => setItems([]),
    user,
    drawerOpen, openDrawer: () => setDrawerOpen(true), closeDrawer: () => setDrawerOpen(false),
    toast, hideToast: () => setToast(''),
  }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
