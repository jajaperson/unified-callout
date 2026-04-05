# unified callout

This monorepo contains two packages for handling callout syntax in the [unified][] ecosystem.

1. [mdast-util-callout][]
2. [micromark-extension-callout][]

Note these are both syntax only.
To actually do anything, you will need to replace callouts with appropriate markdown constructs
using something like [unist-util-visit][].

[mdast-util-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/mdast-util-callout
[micromark-extension-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/micromark-extension-callout
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
[unified]: https://unifiedjs.com
