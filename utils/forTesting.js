function palindrome (s) {
  if (typeof s !== 'string') throw new Error('Not a string')
  return s
    .split('')
    .reverse()
    .join('')
}

function average (a) {
  if (!Array.isArray(a)) throw new Error('Not an array')
  if (a.length === 0) return 0
  const total = a.reduce((prev, curr) => prev + curr)
  return total / a.length
}

module.exports = { palindrome, average }
