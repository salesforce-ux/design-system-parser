const toHtml = require('../html')

const {
  parseSelector
} = require('../css')

describe('html', () => {
  it('creates html based on a selector', () => {
    const chunks = parseSelector('table.slds-table > td.slds-cell-wrap')
    const [html] = chunks.map(toHtml)
    expect(html.replace(/\s{2,}/ig, ''))
      .toEqual('<table class="slds-table"><td class="slds-cell-wrap"></td></table>')
  })
})
