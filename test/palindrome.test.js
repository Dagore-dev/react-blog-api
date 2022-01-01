const { palindrome } = require('../utils/forTesting')

describe('palindrome', () => {
  test('with a simple string', () => {
    const result = palindrome('David')
    expect(result).toBe('divaD')
  })

  test('with an empty string', () => {
    const result = palindrome('')
    expect(result).toBe('')
  })

  test('with no parameters', () => {
    expect(() => palindrome()).toThrow()
  })
})
