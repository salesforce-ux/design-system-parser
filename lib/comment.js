/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
    .map(comp =>
      comp.set('variants', repo.findVariants(comp)))

  // utility :: String -> Either null Utility
  const utility = name =>
    repo
    .findUtility(name)
    .map(setId)
    .map(util =>
      util.set('restrictees', repo.findAllBySelector(getSelector(util))))

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
