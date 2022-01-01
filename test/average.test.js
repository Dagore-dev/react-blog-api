const { average } = require('../utils/forTesting')

describe('average', () => {
  test('of an array with one item return the value of the item', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculated correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })

  test('of not an array', () => {
    expect(() => average()).toThrow()// toThrow no funciona si no pasamos un callback al método expect.
  })
})
