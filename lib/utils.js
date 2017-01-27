const { fromNullable } = require('data.either')
const Immutable = require('immutable')

const uniqBy = (xs, keyFn) =>
  xs.reduceRight((acc, m) =>
    fromNullable(keyFn(m))
    .fold(() => acc.update('result', r => r.push(m)),
          group =>
          acc.get('groups').has(group)
          ? acc
          : acc
            .update('groups', g => g.update(group, () => true))
            .update('result', r => r.push(m)))
  , Immutable.Map({groups: Immutable.Map(), result: Immutable.List()}))
  .get('result')

// find :: List a -> (a -> bool) -> Either Null a
const find = (xs, f) => fromNullable(xs.find(f))

module.exports = {
  uniqBy,
  find
}
