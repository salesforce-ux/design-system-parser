// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const { Map, List } = require('immutable')

const attribute = x =>
  `${x.get('name')}="${x.get('value')}"`

const Element = c =>
  ({
    set: (x, y) => Element(c.set(x, y)),
    update: (x, f) => Element(c.update(x, f)),
    inspect: () => `Element(${c})`,
    toString: () =>
      `
      <${c.get('tag')} ${c.get('attributes').map(attribute).join('')}>
        ${c.get('children', '').toString()}
      </${c.get('tag')}>
    `
  })

const newEl = props =>
  Element(Map(Object.assign({ tag: 'unmatchable', attributes: List() }, props)))

const makeElements = (acc, chunks) =>
  chunks.reduce((ac, c) =>
    c.get('separator')
      ? newEl({ children: ac })
      : c.get('type') === 'tag'
        ? ac.set('tag', c.get('name'))
        : c.get('type') === 'attribute'
          ? ac.update('attributes', atts => atts.push(c))
          : ac
  , acc)

const toHtml = chunks =>
  chunks
    .reduceRight(makeElements, newEl({}))
    .toString()

module.exports = toHtml
