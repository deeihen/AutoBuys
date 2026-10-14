import { cleanItem } from '~/utils/cart'
export default defineNuxtPlugin((nuxtApp) => {
  const cart = useCartStore(nuxtApp.$pinia)
  // Restore after hydration so the server and first browser render match.
  nuxtApp.hook('app:mounted', () => {
    try {
      const saved = JSON.parse(localStorage.getItem('autobuys-cart') || '[]')
      if (Array.isArray(saved)) {
        const seen = new Set()
        cart.items = saved
          .map((item) => cleanItem(item, item?.quantity))
          .filter((item) => {
            if (!item || seen.has(item.id)) return false
            seen.add(item.id)
            return true
          })
      }
    } catch {
      cart.clear()
    }
    cart.$subscribe(
      (_mutation, state) => {
        try {
          localStorage.setItem('autobuys-cart', JSON.stringify(state.items))
        } catch {
          /* Cart still works when browser storage is unavailable. */
        }
      },
      { detached: true, flush: 'sync' }
    )
  })
})
