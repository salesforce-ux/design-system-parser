/*
Copyright (c) 2017, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const _ = require('lodash')
const Immutable = require('immutable')

/**
 *
 */
const allMatches = (s, pattern) => {
  let matches = Immutable.List()
  let match
  while ((match = pattern.exec(s)) !== null) {
    matches = matches.push(match)
  }
  return matches
}

/**
 *
 */
const remove = pattern => s => s.replace(pattern, '')

/**
 *
 */
const reduceComment = (comment, line) => {
  let match = line.match(/^@([^\s]+)(?:\s(.+))?/)
  if (!match) {
    return comment.update('description', description =>
      description.push(line)
    )
  } else {
    return comment.setIn(['annotations', match[1]],
      _.isUndefined(match[2]) ? true : match[2]
    )
  }
}

module.exports = styles => {
  let pattern = /\/\*\*([\s\S]*?)\*\//g
  let baseComment = Immutable.Map({
    description: Immutable.List(),
    annotations: Immutable.Map()
  })
  return allMatches(styles, pattern)
    .map(comment => comment[1].split('\n'))
    .map(comment => _(comment)
      .map(remove(/\s*?\*\s?/))
      .value()
    )
    .map(comment => comment
      .reduce(reduceComment, baseComment)
      .update(comment => comment
        .update('description', description =>
          description.join('\n').trim()
        )
      )
    )
}
