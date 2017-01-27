/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const { Right, Left, fromNullable } = require('data.either')
const { List, Map, OrderedSet } = require('immutable-ext')

const { toTree } = require('./tree')
const { find } = require('./utils')
const Css = require('./css')

module.exports = comments => {
  // getSelector :: Comment -> String
  const getSelector = c =>
    c.getIn(['annotations', 'selector'])

  // components :: () -> List Component
  const components = () =>
    comments.filter(x => x.getIn(['annotations', 'base']))

  // modifiers :: List Comment -> List Modifier
  const modifiers = xs =>
    xs.filter(x => x.getIn(['annotations', 'modifier']))

  // variants :: List Comment -> List Variant
  const variants = xs =>
    xs.filter(x => x.getIn(['annotations', 'variant']))

  // exitIfSameComment :: (Selector, Comment) -> Either Null Comment
  const exitIfSameComment = (selector, comment) =>
    getSelector(comment) === selector
    ? Left()
    : Right(comment)

  const partition = (xs, f) =>
    xs.reduce((acc, x) =>
      acc.update(f(x) ? 0 : 1, v => v.push(x))
    , List.of(List(), List())).toArray()

  const [special, normal] = partition(comments, c => /[*|+|~|[\]]/.test(c.getIn(['annotations', 'restrict'])))

  const getRestrictKeys = restrict =>
    String(restrict).match(/(\.?[a-zA-Z0-9_-]+)/g)

  const makeIndex = (index, comment) =>
    getRestrictKeys(comment.getIn(['annotations', 'restrict']))
    .reduce((idx, restrictChunk) =>
      idx.update(restrictChunk, set => set ? set.add(comment) : OrderedSet.of(comment)), index)

  const INDEX = normal.reduce(makeIndex, Map())

  // findAllByRestrict :: Selector -> List Comment
  const findAllByRestrict = selector =>
    fromNullable(INDEX.get(selector))
    .fold(() =>
            special
            .filter(comment =>
              exitIfSameComment(selector, comment)
              .chain(comment => fromNullable(comment.getIn(['annotations', 'restrict'])))
              .fold(() => false,
                    restrict => Css.doesMatch(selector, restrict))),
          xs => xs.toList())

  // findFirstVariant :: String -> Either Null Variant
  const findFirstVariant = selector =>
    find(variants(comments), v => getSelector(v) === selector)

  // findVariants :: Component -> List Variant
  const findVariants = comp =>
    variants(toTree(comp).toList(List()))

  // findComponent :: String -> Either Null Component
  const findComponent = name =>
    find(components(), x => x.getIn(['annotations', 'name']) === name)

  // findModifier :: String -> Either Null Modifier
  const findModifier = selector =>
    find(modifiers(comments), m => getSelector(m) === selector)

  return {
    components,
    modifiers,
    findModifier,
    findComponent,
    findFirstVariant,
    findAllByRestrict,
    findVariants
  }
}
