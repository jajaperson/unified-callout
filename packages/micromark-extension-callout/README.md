# micromark-extension-callout

Syntax-only [micromark][] extension for parsing [Obsidian][]-style callouts.

Note this extension does not extend the html compiler.
Instead, this is intended to be used together with [mdast-util-callout][] to output syntax trees,
which can then be replaced with the appropriate construct using [unist-util-visit][]

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-callout
```

In Deno with [`esm.sh`][esmsh]:

```js
import { callout } from "https://esm.sh/micromark-extension-callout@1";
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
	import { callout } from "https://esm.sh/micromark-extension-callout@1?bundle";
</script>
```

## API

This package exports the identifier [`callout`][api-callout].
There is no default export.

The export map supports the [`development` condition][development].
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `callout()`

Create an extension for `micromark` to parse callout syntax.

###### Returns

Extension for `micromark` that can be passed in `extensions`,
to enable callouts ([`Extension`][micromark-extension]).

## Security

This package is safe.

[micromark]: https://github.com/micromark/micromark
[mdast-util-callout]: https://github.com/jajaperson/unified-callout/tree/main/packages/mdast-util-callout
[esmsh]: https://esm.sh
[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[micromark-extension]: https://github.com/micromark/micromark#syntaxextension
[development]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions
[api-callout]: #calloutoptions
[npm]: https://docs.npmjs.com/cli/install
[Obsidian]: https://obsidian.md
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
