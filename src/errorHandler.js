export function getErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return 'Une erreur est survenue'

  // Vérification directe
  if (typeof data === 'string') return data
  if (data.detail)  return data.detail
  if (data.message) return data.message
  if (data.status)  return data.status

  // ✅ Cas { errors: { status: "msg" } } ou { errors: { champ: ["msg"] } }
  if (data.errors) {
    if (typeof data.errors === 'string') return data.errors
    if (data.errors.status)  return data.errors.status
    if (data.errors.detail)  return data.errors.detail
    if (data.errors.message) return data.errors.message

    // Aplatir les erreurs imbriquées dans errors
    const messages = flattenErrors(data.errors)
    if (messages.length) return messages.join(' | ')
  }

  // Fonction récursive qui aplatit les erreurs imbriquées
  function flattenErrors(obj, prefix = '') {
    const messages = []
    for (const [field, value] of Object.entries(obj)) {
      const fieldName = prefix ? `${prefix}.${field}` : field
      if (Array.isArray(value)) {
        messages.push(`${fieldName} : ${value.join(', ')}`)
      } else if (typeof value === 'object' && value !== null) {
        messages.push(...flattenErrors(value, fieldName))
      } else {
        messages.push(`${fieldName} : ${value}`)
      }
    }
    return messages
  }

  const messages = flattenErrors(data)
  return messages.join(' | ') || 'Une erreur est survenue'
}