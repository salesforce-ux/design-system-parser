/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
