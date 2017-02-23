// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const cheerio = require('cheerio')
const Either = require('data.either')
const Immutable = require('immutable')

// isomorphism
const cssParse = require('css-what')
const cssStringify = require('./vendor/css-what-stringify')

const toHtml = require('./html')

const matchSelector = Either.try(($, sel) => !!$(sel).length)

const types = Immutable.Set.of(
  'child',
  'parent',
  'sibling',
  'descendant',
  'adjacent',
  'universal'
)

const chunkSelector = selector =>
  selector.reduce((selector, token) => {
    if (types.has(token.get('type'))) {
      return selector
        .push(Immutable.List.of(token.set('separator', true)))
        .push(Immutable.List())
    }
    return selector.update(selector.count() - 1, group =>
      group.push(token)
    )
  }, Immutable.fromJS([[]]))

const chunkSelectorList = selectorList =>
   Either
    .try(cssParse)(selectorList)
    .map(Immutable.fromJS)
    .map(selectorList =>
      selectorList.map(chunkSelector)
    )

// String -> [[Map]]
const parseSelector = selectorList =>
  chunkSelectorList(selectorList).getOrElse([])

// Map -> String
const stringifySelector = chunk =>
  cssStringify(Immutable.List.of(chunk).toJS())

// $: <unmatchable class="slds-fixed-layout" />
// selector: .slds-fixed-layout
// selector: .slds-table > [class=*] ~ tr td.edittable a
const findSelectorChunkInDOM = ($, selector) =>
  parseSelector(selector).find(chunk =>
    chunk.some(c =>
      matchSelector($, stringifySelector(c))
        .fold(e => console.log('BOMBED OUT', selector, e),
              x => x)))

const doesMatch = (selector1, selector2) =>
  selectorToHtmls(selector1)
  .some(html =>
    findSelectorChunkInDOM(cheerio.load(html), selector2))

// String -> [Html]
const selectorToHtmls = selector =>
  parseSelector(selector).map(toHtml)

module.exports = {
  parseSelector,
  stringifySelector,
  doesMatch,
  selectorToHtmls
}
