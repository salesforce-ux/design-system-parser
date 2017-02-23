// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

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
