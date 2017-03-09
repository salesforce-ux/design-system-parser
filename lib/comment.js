// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const { Right, Left, fromNullable } = require('data.either')
const { List, Map } = require('immutable-ext')

const { toTree } = require('./tree')
const { find } = require('./utils')

module.exports = repo => {
  // exitIfInCache :: Map -> Key -> Either Value Key
  const exitIfInCache = cache => x =>
    cache.get(x) ? Left(cache.get(x)) : Right(x)

  // getSelector :: Comment -> String
  const getSelector = c =>
    c.getIn(['annotations', 'selector'])

  // recurse :: Map -> Comment -> Comment
  const recurse = (cache, comment) =>
    fromNullable(getSelector(comment))
    .chain(exitIfInCache(cache))
    .map(selector =>
      repo.findAllByRestrict(selector)
      .map(setId)
      .map(restrictee => recurse(cache.set(selector, restrictee), restrictee)))
    .map(restrictees => comment.set('restrictees', restrictees))
    .fold(cachedComment => cachedComment,
          commentWithRestrictees => commentWithRestrictees)

  // decorateWithRestrictees :: Component -> Component
  const decorateWithRestrictees = comp =>
    repo.findFirstVariant(getSelector(comp))
    .map(setId)
    .fold(l => comp.set('restrictees', List()),
          v => comp.set('restrictees', List.of(recurse(Map(), v))))

  // setId :: Comment -> Comment
  const setId = comment =>
    fromNullable(comment.getIn(['annotations', 'name']))
    .fold(() => comment.set('id', comment.getIn(['annotations', 'selector'])),
          name => comment.set('id', name))

  // component :: String -> Either null Component
  const component = name =>
    repo
    .findComponent(name)
    .map(setId)
    .map(decorateWithRestrictees)

  // utility :: String -> Either null Utility
  const utility = name =>
    repo
    .findUtility(name)
    .map(setId)
    .map(util =>
      util.set('restrictees', repo.findAllBySelector(getSelector(util)).map(setId)))

  // components :: () -> List Component
  const components = () =>
    repo.components().map(setId)

  // utilities :: () -> List Component
  const utilities = () =>
    repo.utilities().map(setId)

  // findModifier :: Component -> Selector -> Either Null Modifier
  const findModifier = (component, id) =>
    find(repo.modifiers(toTree(component).toList(List())), x => x.get('id') === id)

  // findModifier :: Component -> String -> Either Null Variant
  const findVariant = (component, id) =>
    find(component.get('variants'), x => x.getIn(['annotations', 'name']) === id)

  return { components, utilities, utility, component, findModifier, findVariant }
}
