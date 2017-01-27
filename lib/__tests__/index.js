const fs = require('fs')
const glob = require('glob')
const path = require('path')

const parser = require('../../')

const scss = glob
  .sync(path.resolve(__dirname, '../__fixtures__/ui/components/**/*.scss'))
  .map(scssPath =>
    fs.readFileSync(scssPath, 'utf8')
  )
  .join('\n')

const { components, component } = parser(scss)

describe('parser', () => {
  describe('components', () => {
    it('returns a list of components', () => {
      const result = components().map(x => x.getIn(['annotations', 'name']))
      expect(result.toJS()).toEqual(['button', 'card', 'data-tables'])
    })
  })

  describe('component', () => {
    describe('data tables', () => {
      let table
      beforeEach(() => {
        table = component('data-tables').getOrElse(null)
      })
      it('finds the right component', () => {
        expect(table.getIn(['annotations', 'name'])).toEqual('data-tables')
      })
      it('takes a component name and returns a full component with variants', () => {
        expect(table.get('variants').count()).toEqual(2)
        const variant = table.get('variants').first()
        expect(variant.getIn(['annotations', 'name'])).toEqual('advanced')
      })
      it('adds the restrictee hierarchy tree', () => {
        expect(table.get('restrictees').count()).toEqual(1)
        expect(table.get('restrictees').first().get('restrictees').count()).toEqual(10)
        const restrictee = table.get('restrictees').first()
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual('.slds-table')
      })
    })
    describe('button', () => {
      let button
      beforeEach(() => {
        button = component('button').getOrElse(null)
      })
      it('finds the right component', () => {
        expect(button.getIn(['annotations', 'name'])).toEqual('button')
      })
      it('has a unique identifier', () => {
        expect(button.get('id')).toEqual('button')
      })
      it('only has 1 variant', () => {
        expect(button.get('variants').count()).toEqual(1)
      })
      it('the variant has an id', () => {
        expect(button.get('variants').first().get('id')).toEqual('reset')
      })
      it('adds the restrictees', () => {
        expect(button.get('restrictees').count()).toEqual(1)
        const restrictee = button.get('restrictees').first()
        expect(restrictee.get('restrictees').count()).toEqual(8)
        expect(restrictee.getIn(['annotations', 'selector'])).toEqual('.slds-button')
      })
    })
  })
})
