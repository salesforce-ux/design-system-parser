// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license


const daggy = require('daggy')
const { Right, Left } = require('data.either')

const Tree = daggy.taggedSum({
  Empty: [],
  Leaf: ['x'],
  Node: ['x', 'children']
})

const { Node, Leaf, Empty } = Tree

Tree.prototype.map = function (f) {
  return this.cata({
    Empty: () => Empty,
    Leaf: x => Leaf(f(x)),
    Node: (x, xs) => Node(f(x), xs.map((x, i) => x.map(y => f(y, i))))
  })
}

// Foldable
Tree.prototype.reduce = function (f, acc) {
  return this.cata({
    Empty: () => acc,
    Leaf: x => f(acc, x),
    Node: (x, xs) => f(xs.reduce((ac, y) => y.reduce(f, ac), acc), x)
  })
}

Tree.prototype.toList = function (empty) {
  return this.reduce((acc, x) => acc.concat([x]), empty)
}

const fromEmpty = list =>
  list && list.count() ? Right(list) : Left()

const toTree = x =>
  fromEmpty(x.get('restrictees'))
  .fold(() => Leaf(x),
        xs => Node(x, xs.map(toTree)))

module.exports = { Tree, toTree }
