/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

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
  Element(Map(Object.assign({tag: 'unmatchable', attributes: List()}, props)))

const makeElements = (acc, chunks) =>
  chunks.reduce((ac, c) =>
    c.get('separator')
    ? newEl({children: ac})
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
