// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const { Right, Left, fromNullable } = require('data.either')
const { List, Map, OrderedSet } = require('immutable-ext')

const { toTree } = require('./tree')
const { find } = require('./utils')
const Css = require('./css')

module.exports = comments => {
  // getSelector :: Comment -> String
  const getSelector = c =>
    c.getIn(['annotations', 'selector'])

  // isComponent :: Comment -> Bool
  const isComponent = comment =>
    comment.getIn(['annotations', 'base']) || comment.getIn(['annotations', 'component'])

  // topLevel :: Comment -> Bool
  const topLevel = c =>
    ['component', 'base', 'utility'].some(x => c.getIn(['annotations', x]))

  // components :: () -> List Component
  const components = () =>
    comments.filter(isComponent)

  // utilities :: () -> List Utility
  const utilities = () =>
    comments.filter(x => x.getIn(['annotations', 'utility']))

  // modifiers :: List Comment -> List Modifier
  const modifiers = xs =>
    xs.filter(x => x.getIn(['annotations', 'modifier']))

  // variants :: List Comment -> List Variant
  const variants = xs =>
    xs.filter(x => x.getIn(['annotations', 'variant']))

  // partition :: [a] -> (a -> Bool) -> [[a], [a]]
  const partition = (xs, f) =>
    xs.reduce((acc, x) =>
      acc.update(f(x) ? 0 : 1, v => v.push(x))
    , List.of(List(), List())).toArray()

  // getRestrictKeys :: String -> [Selector]
  const getRestrictKeys_ = restrict =>
    restrict.match(/(\.[a-zA-Z0-9_-]+)/g)

  const getRestrictKeys = restrict =>
    List(restrict.split(','))
    .map(x => x.trim())
    .map(x => List(x.match(/(\.[a-zA-Z0-9_-]+)/g)))
    .map(xs => xs.first())

  // makeIndex :: ((Map Restrict (Set Comment)), Comment) -> Map Restrict (Set Comment)
  const makeIndex = (index, comment) =>
    getRestrictKeys(comment.getIn(['annotations', 'restrict'], ''))
    .reduce((idx, restrictChunk) =>
      idx.update(restrictChunk, set =>
        set ? set.add(comment) : OrderedSet.of(comment)), index)

  // normalize :: Comment -> Bool
  const normalize = c =>
    c.updateIn(['annotations', 'restrict'], r => r || '*')

  // selectorMatchesRestrict :: (String, Selector, Comment) -> Bool
  const selectorMatches = (key, selector, comment) =>
    fromNullable(comment.getIn(['annotations', key]))
    .fold(() => false,
          selector2 => Css.doesMatch(selector2, selector)) // selector may be fancy

  // IDEA: optimize by grouping fancy by restrict
  // IDEA: optimize by expanding fancy selectors to be normal
  // findAllByRestrict :: Selector -> List Comment
  const findAllByRestrict = selector =>
    fromNullable(INDEX.get(selector))
    .map(xs => xs.toList())
    .getOrElse(List())
    .concat(fancy.filter(comment => selectorMatches('restrict', selector, comment)))

  // findAllBySelector :: Selector -> List Comment
  const findAllBySelector = selector =>
    utils.filter(comment => selectorMatches('selector', selector, comment))

  // findFirstVariant :: String -> Either Null Variant
  const findFirstVariant = selector =>
    find(variants(comments), v => getSelector(v) === selector)

  // findVariants :: Component -> List Variant
  const findVariants = comp =>
    variants(toTree(comp).toList(List()))

  // findComponent :: String -> Either Null Component
  const findComponent = name =>
    find(components(), x => x.getIn(['annotations', 'name']) === name)

  // findUtility :: String -> Either Null Utility
  const findUtility = name =>
    find(utilities(), x => x.getIn(['annotations', 'name']) === name)

  // findModifier :: String -> Either Null Modifier
  const findModifier = selector =>
    find(modifiers(comments), m => getSelector(m) === selector)

  const initialize = () => {
    const normalized = comments.filter(x => !topLevel(x)).map(normalize)

    const [fancy_, plain] = partition(normalized, c => /[*|+|~|[\]|:]/.test(c.getIn(['annotations', 'restrict'])))

    const [utils, fancy] = partition(fancy_, comment =>
        comment
        .getIn(['annotations', 'restrict'], '')
        .match(/\*/g))

    return {plain, fancy, utils}
  }

  const {plain, fancy, utils} = initialize()

  const INDEX = plain.reduce(makeIndex, Map())

  return {
    components,
    utilities,
    modifiers,
    variants,
    findModifier,
    findComponent,
    findUtility,
    findFirstVariant,
    findAllByRestrict,
    findAllBySelector,
    findVariants
  }
}
