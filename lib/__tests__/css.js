const {
  parseSelector,
  doesMatch
} = require('../css')

describe('css', () => {
  describe('#doesMatch', () => {
    it('matches two equal selectors', () => {
      expect(doesMatch('.slds-table', '.slds-table')).toBe(true)
    })
    it('doesnt match two different selectors', () => {
      expect(doesMatch('.slds-table', '.slds-button')).toBe(false)
    })
    it('matches fancy star selectors', () => {
      expect(doesMatch('.slds-table--fixed', '[class*=slds-table]')).toBe(true)
    })
  })
  describe('#parseSelector', () => {
    it('creates two selectors', () => {
      expect(parseSelector('.slds-table, .slds-table--fixed').count()).toBe(2)
    })
    it('chunks the selector with the tag', () => {
      const s = parseSelector('table.slds-table > .slds-col--padded').first()
      expect(s.count()).toEqual(3)
    })
  })
})
