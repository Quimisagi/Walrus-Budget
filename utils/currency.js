export const showCurrency = (currency) => {
  if (currency === 'USD') {
    return '$'
  }
  if (currency === 'YEN') {
    return '¥'
  }
  if (currency === 'EUR') {
    return '€'
  }
  else return '$'
}

