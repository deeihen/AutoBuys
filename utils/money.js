const formatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})
export const formatPrice = (value) => formatter.format(Number(value) || 0)
