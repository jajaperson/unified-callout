# mdast-util-callout

[mdast][] extensions to **parse** [Obsidian][]-style callouts.
Intended to be used with [micromark-extension-callout][].

Since [micromark-extension-callout][] is syntax-only,
you will need to use something like [unist-util-visit][],
to manually replace the outputted nodes in the syntax tree with ordinary markdown constructs.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-callout mdast-util-callout
```

In Deno with [`esm.sh`][esmsh]:

```js
import { calloutFromMarkdown } from "https://esm.sh/mdast-util-callout@1";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
	import { calloutFromMarkdown } from "https://esm.sh/mdast-util-callout12?bundle";
</script>
```

## API

This package exports the identifier [`calloutFromMarkdown`][api-frommarkdown].
There is no default export.

### `calloutFromMarkdown()`

Create an extension for
[`mdast-util-from-markdown`][mdast-util-from-markdown]
to parse callout syntax in markdown.

###### Returns

Extension for `mdast-util-from-markdown`
([`FromMarkdownExtension`][frommarkdownextension]).

[Obsidian]: https://obsidian.md
[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[micromark]: https://github.com/micromark/micromark
[mdast-util-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/mdast-util-callout
[esmsh]: https://esm.sh
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[micromark-extension]: https://github.com/micromark/micromark#syntaxextension
[mdast]: https://github.com/syntax-tree/mdast
[npm]: https://docs.npmjs.com/cli/install
[api-frommarkdown]: #calloutfrommarkdown
[frommarkdownextension]: https://github.com/syntax-tree/mdast-util-from-markdown#extension
[micromark-extension-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/micromark-extension-callout
[micromark-extension-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/micromark-extension-callout
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
