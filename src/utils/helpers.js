export const formatDateTime = () => {
  const d = new Date()
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const getTotalQty = (batches) =>
  (batches || []).reduce((sum, b) => sum + Number(b.qty || 0), 0)

export const getActiveBatches = (batches) =>
  [...(batches || [])]
    .filter(b => Number(b.qty) > 0)
    .sort((a, b) => new Date(String(a.expiry || '').replace(/-/g, '/')) - new Date(String(b.expiry || '').replace(/-/g, '/')))

export const getDefaultDate = () => {
  const d = new Date()
  return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0')
}

export const getDefaultMonth = () => {
  const d = new Date()
  return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0')
}
