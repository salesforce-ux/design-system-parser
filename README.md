# Design System Parser

<img src="https://portioncontrol.herokuapp.com/pie.png?size=250x250&performance=30&readabilty=70" alt="performance=30, readability=70" width=125 height=125 />

## Installation

`npm install`

## Api

  * `comments :: () -> [Comment]`
  * `components :: () -> [Component]`
  * `component :: Id -> FullComponent`
  * `findVariant :: (Id, FullComponent) -> FullComponent`
  * `findModifier :: (Id, FullComponent) -> FullComponent`

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
  * Repo initializes by partitioning and normalizing comments. `utils` are comments with a restrict of `*` so we can't use them for hierarchy building.

  `fancy` comments are ones with with any special characters in their restriction. It separates any css selector syntax from `plain` classnames and element names (e.g. td[class=~"Im fancy"] vs td.plain > name). This is because we need to actually interpret `fancy` selectors, but the rest can be statically indexed. Speaking of which, it then sets up an INDEX of `{restrict: [comment]}` where any classname mentioned in the restrict is now a key in this INDEX pointing to the comment. This is so we can rapidly look up the comments via a selector later.

### Setting Restrictees

#### Components
We start by finding the first concrete variant. This is because there is no selector/restrict on an abstract component. Then we call `recurse` with a cache and the first variant.

`recurse` will first get the selector from the comment, then exit if it's missing or if we've already populated the restrictees for that comment in the cache. We then find all comments who's restrict rule matches our selector and recursively populate each of their restrictees before finally setting them to the restrictees attribute of our comment. The workhorse here is `Repo.findAllByRestrict`

`Repo.findAllByRestrict` starts by searching the INDEX, which is keyed by selector names mentioned in restrict rules. Then, it does a second pass on (the much smaller set) `fancy`. For `fancy`, we first make sure we're not comparing the comment to itself, then we find the restrict. With restrict in hand, we actually generate html according to the selector and apply the restrict to see if there's a match using cheerio. This is much like how validation works in ds-markup.


#### Utilities
Utilities work top-down looking for selectors, not restricts. The reason is restrict should always be `*` (or `.myscope > *`) for a utility. We use the same matching technique with `fancy`, but this time we flip the html generation around: the candidates generate html and the abstract utility's selector is used to match.


