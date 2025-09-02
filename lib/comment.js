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
  const getSelector = c => c.getIn(['annotations', 'selector'])

  // recurse :: Map -> Comment -> Comment
  const recurse = (cache, comment) =>
    fromNullable(getSelector(comment))
      .chain(exitIfInCache(cache))
      .map(selector =>
        repo
          .findAllByRestrict(selector)
          .map(setId)
          .map(restrictee =>
            recurse(cache.set(selector, restrictee), restrictee)
          )
      )
      .map(restrictees => comment.set('restrictees', restrictees))
      .fold(
        cachedComment => cachedComment,
        commentWithRestrictees => commentWithRestrictees
      )

  // decorateWithRestrictees :: Component -> Component
  const decorateWithRestrictees = comp =>
    repo
      .findFirstVariants(getSelector(comp))
      .map(vs => vs.map(setId))
      .fold(
        l => comp.set('restrictees', List()),
        vs => comp.set('restrictees', vs.map(v => recurse(Map(), v)))
      )

  // setId :: Comment -> Comment
  const setId = comment =>
    fromNullable(comment.getIn(['annotations', 'name'])).fold(
      () => comment.set('id', comment.getIn(['annotations', 'selector'])),
      name => comment.set('id', name)
    )

  // component :: String -> Either null Component
  const component = name =>
    repo
      .findComponent(name)
      .map(setId)
      .map(decorateWithRestrictees)

  // moduleComponent :: String -> Either null moduleComponent
  const moduleComponent = name =>
    repo
      .findModuleComponent(name)
      .map(setId)
      .map(decorateWithRestrictees)

  // utility :: String -> Either null Utility
  const utility = name => {
    return repo
      .findUtility(name)
      .map(setId)
      .map(util => {
        const selector = getSelector(util)
        let restrictees = repo.findAllBySelector(selector).map(setId)

        // If includeRestrictedModifiers option is enabled, also include modifiers
        // that are restricted to elements matching the utility's selector
        if (repo.options && repo.options.includeRestrictedModifiers) {
          const restrictedModifiers = repo.findAllByRestrict(selector)
            .filter(modifier => modifier.getIn(['annotations', 'modifier']))
            .map(setId)
          restrictees = restrictees.concat(restrictedModifiers)

          // Also look for modifiers restricted to the base class of the utility
          // For example, if utility selector is [class*='slds-box'], also look for
          // modifiers restricted to .slds-box
          const baseClassMatch = selector.match(/\[class\*='([^']+)'\]/)
          if (baseClassMatch) {
            const baseClass = baseClassMatch[1]

            // Use the repository's comments directly to filter modifiers
            const allModifiers = repo.modifiers(repo.comments)
            const baseClassRestrictedModifiers = allModifiers
              .filter(modifier => modifier.getIn(['annotations', 'restrict']) === '.' + baseClass)
              .map(setId)
            restrictees = restrictees.concat(baseClassRestrictedModifiers)
          }
        }

        return util.set('restrictees', restrictees)
      })
  }

  // components :: () -> List Components
  const components = () => repo.components().map(setId)

  // moduleComponents :: () -> List moduleComponents
  const moduleComponents = () => repo.moduleComponents().map(setId)

  // utilities :: () -> List Utilities
  const utilities = () => repo.utilities().map(setId)

  // findModifier :: Component -> Selector -> Either Null Modifier
  const findModifier = (component, id) =>
    find(
      repo.modifiers(toTree(component).toList(List())),
      x => x.get('id') === id
    )

  // findModifier :: Component -> String -> Either Null Variant
  const findVariant = (component, id) =>
    find(
      repo.variants(toTree(component).toList(List())),
      x => x.get('id') === id
    )

  return {
    components,
    moduleComponents,
    utilities,
    utility,
    component,
    moduleComponent,
    findModifier,
    findVariant
  }
}
