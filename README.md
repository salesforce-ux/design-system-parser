# Design System Parser

<img src="https://portioncontrol.herokuapp.com/pie.png?size=250x250&performance=30&readabilty=70" alt="performance=30, readability=70" width=125 height=125 />

## Installation

`npm install`

## Api

  * `components :: () -> [Component]`

## Things to know
  * Comment is a parsed annotation
  * Component is a Comment w/ an id
    One of `Base | Variant | Modifier`
  * FullComponent is a Component with `restrictees`
  * Repo is our "database" of comments. We put finds there.
  * Comment is our model for Comp/Variant/Modifier

## How it works

  * The entry point is index.js
  * We parse sass comments and match on `@` symbols
  * The post-parsed comments are given to `Repo`.
  * Repo initializes by partitioning 'special' css selectors from 'normal' ones. That is to say, it separates any css selector syntax from plain classnames and element names (e.g. td[class=~"Im special"] vs td.normal > name). This is because we need to actually interpret 'special' selectors, but the rest can be statically indexed. Next, it sets up an INDEX of `{restrict: [comment]}` where any classname mentioned in the restrict is now a key in this INDEX pointing to the comment. This is so we can rapidly look up the comments via a selector later.

### Setting Restrictees
We start by finding the first concrete variant. This is because there is no selector/restrict on an abstract component. Then we call `recurse` with a cache and the first variant.

Recurse will first get the selector from the comment, then exit if it's missing or if we've already populated the restrictees for that comment in the cache. We then find all comments who's restrict rule matches our selector and recursively populate each of their restrictees before finally setting them to the restrictees attribute of our comment.

`Repo.findAllByRestrict` works by searching the INDEX, which is keyed by selector names mentioned in restrict rules. Then, it does a second pass on (the much smaller set) 'special'. For 'special', we first make sure we're not comparing the comment to itself, then we find the restrict. If no restrict, it simply does not match since we are finding by restrict. With restrict in hand, we actually generate html according to the selector and apply the restrict to see if there's a match.


