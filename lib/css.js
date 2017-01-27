/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
