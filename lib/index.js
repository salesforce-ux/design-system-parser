// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const parseComments = require('./comments')

const createComment = require('./comment')
const createRepository = require('./repository')

module.exports = (s, options = {}) => {
  const comments = parseComments(s)
  const repository = createRepository(comments, options)
  const {
    components,
    component,
    utilities,
    utility,
    moduleComponents,
    moduleComponent,
    findVariant,
    findModifier
  } = createComment(repository, options)
  return {
    comments,
    components,
    utility,
    utilities,
    moduleComponents,
    moduleComponent,
    component,
    findVariant,
    findModifier,
    repository
  }
}
