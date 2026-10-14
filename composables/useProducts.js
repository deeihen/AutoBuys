export function useProducts() {
  const client = useSupabaseClient()
  return useAsyncData(
    'products',
    async () => {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at')
        .order('id')
      if (error) throw error
      return data
    },
    { default: () => [] }
  )
}
