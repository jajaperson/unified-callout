/**
 * @import {Extension, TokenizeContext, Tokenizer, State, Code, Exiter, Construct} from "micromark-util-types"
 */

import { ok as assert } from "devlop";
import { codes, constants } from "micromark-util-symbol";
import { markdownLineEnding, markdownSpace } from "micromark-util-character";
import { factorySpace } from "micromark-factory-space";

/**
 * @type {Construct}
 */
const callout = {
	name: "callout",
	tokenize: tokenizeCalloutStart,
	continuation: { tokenize: tokenizeCalloutContinuation },
	exit: exitCallout,
	// precedes blockquote
	add: "before",
};

/**
 * Create a syntax extension for `micromark` to enable Obsidian-style callouts.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to enable
 *   Obsidian-style callout syntax.
 */
export function calloutExt() {
	return {
		document: {
			[codes.greaterThan]: callout,
		},
	};
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCalloutStart(effects, ok, nok) {
	const self = this;
	let emptyCalloutType = true;

	return start;

	/**
	 * Start of callout.
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *     ^
	 * ```
	 *
	 * @type {State}
	 */
	function start(code) {
		assert(code === codes.greaterThan, "expected `>`");

		const state = self.containerState;
		assert(state, "expected containerState to be defined");

		// Do not use blockquote's "open", use customized "calloutOpen".
		// Otherwise, blockquotes will be affected.
		if (!state.calloutOpen) {
			effects.enter("callout", { _container: true });
			state.calloutOpen = true;
		}

		effects.enter("calloutPrefix");
		effects.enter("calloutGreaterThanMark");
		effects.consume(code);
		effects.exit("calloutGreaterThanMark");
		return after;
	}

	/**
	 * Optional space before type
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *      ^
	 * ```
	 *
	 * @type {State}
	 */
	function after(code) {
		if (markdownSpace(code)) {
			effects.enter("calloutPrefixWhitespace");
			effects.consume(code);
			effects.exit("calloutPrefixWhitespace");
			return typeMarkerLeft;
		}
		return typeMarkerLeft(code);
	}

	/**
	 * Type marker
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *       ^
	 * ```
	 *
	 * @type {State}
	 */
	function typeMarkerLeft(code) {
		if (code !== codes.leftSquareBracket) return nok(code);

		effects.enter("calloutType");
		effects.enter("calloutTypeMarkerLeft");
		effects.consume(code);
		effects.exit("calloutTypeMarkerLeft");

		return exclaminationMark;
	}

	/**
	 * After `[`, at `!`
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *        ^
	 * ```
	 *
	 * @type {State}
	 */
	function exclaminationMark(code) {
		if (code !== codes.exclamationMark) return nok(code);

		effects.enter("calloutExclamationMark");
		effects.consume(code);
		effects.exit("calloutExclamationMark");

		effects.enter("calloutTypeString");
		effects.enter("chunkString").contentType = "string";
		return type;
	}

	/**
	 * In type
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *         ^
	 * ```
	 *
	 * @type {State}
	 */
	function type(code) {
		if (code === null || markdownLineEnding(code)) return nok(code);
		if (code === codes.rightSquareBracket) {
			if (emptyCalloutType) return nok(code);
			effects.exit("chunkString");
			effects.exit("calloutTypeString");

			effects.enter("calloutTypeMarkerRight");
			effects.consume(code);
			effects.exit("calloutTypeMarkerRight");

			effects.exit("calloutType");

			return potentialCollapseMarker;
		}

		// In Obsidian, anything except `]` is fair game
		effects.consume(code);
		emptyCalloutType = false;
		return type;
	}

	/**
	 * Optional collapse marker: Either a `+` or `-`.
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *           ^
	 * ```
	 *
	 * @type {State}
	 */
	function potentialCollapseMarker(code) {
		if (code === codes.plusSign) {
			effects.enter("calloutCollapseMarkerPlus");
			effects.consume(code);
			effects.exit("calloutCollapseMarkerPlus");

			effects.exit("calloutPrefix");

			return afterPrefix;
		}
		if (code === codes.dash) {
			effects.enter("calloutCollapseMarkerMinus");
			effects.consume(code);
			effects.exit("calloutCollapseMarkerMinus");

			effects.exit("calloutPrefix");

			return afterPrefix;
		}

		effects.exit("calloutPrefix");

		return afterPrefix(code);
	}

	/**
	 * After the callout prefix. Either the line ends here, or there is
	 * whitespace followed by an optional title.
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *            ^
	 * ```
	 *
	 * @type {State}
	 */
	function afterPrefix(code) {
		if (markdownLineEnding(code) || code === null) {
			return ok(code);
		}
		if (markdownSpace(code)) {
			effects.enter("calloutPrefixWhitespace");
			effects.consume(code);
			return afterPrefixWhitespace;
		}
		return nok(code);
	}

	/**
	 * After whitespace before optional title. There may be more whitespace.
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *             ^
	 * ```
	 *
	 * @type {State}
	 */
	function afterPrefixWhitespace(code) {
		if (markdownLineEnding(code) || code === null) {
			effects.exit("calloutPrefixWhitespace");
			return ok(code);
		}
		if (markdownSpace(code)) {
			effects.consume(code);
			return afterPrefixWhitespace;
		}

		effects.exit("calloutPrefixWhitespace");

		effects.enter("calloutTitle");
		effects.enter("chunkText", { contentType: "text" });

		return insideTitle(code);
	}

	/**
	 * Inside the title
	 *
	 * ```markdown
	 * > | > [!a]+ c
	 *             ^
	 * ```
	 *
	 * @type {State}
	 */
	function insideTitle(code) {
		if (markdownLineEnding(code) || code === null) {
			effects.exit("chunkText");
			effects.exit("calloutTitle");
			return ok(code);
		}

		effects.consume(code);
		return insideTitle;
	}
}

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeCalloutContinuation(effects, ok, nok) {
	const self = this;
	return contStart;

	/** @type {State} */
	function contStart(code) {
		assert(self.containerState, "expected containerState to be defined");
		if (!self.containerState.calloutContentStarted) {
			effects.enter("calloutContent");
		}

		assert(self.parser.constructs.disable.null);
		if (markdownSpace(code)) {
			return factorySpace(
				effects,
				contBefore,
				"linePrefix",
				self.parser.constructs.disable.null.includes("codeIndented") ? undefined : 4,
			)(code);
		}
		return contBefore(code);
	}

	/** @type {State} */
	function contBefore(code) {
		if (code === codes.greaterThan) {
			effects.enter("calloutPrefix");
			effects.enter("calloutGreaterThanMark");
			effects.consume(code);
			effects.exit("calloutGreaterThanMark");
			return contAfter;
		}

		return nok(code);
	}

	/** @type {State} */
	function contAfter(code) {
		assert(self.containerState, "expected containerState to be defined");
		self.containerState.calloutContentStarted = true;
		if (markdownSpace(code)) {
			effects.enter("calloutPrefixWhitespace");
			effects.consume(code);
			effects.exit("calloutPrefixWhitespace");

			effects.exit("calloutPrefix");
			return ok;
		}

		effects.exit("calloutPrefix");
		return ok(code);
	}
}

/**
 * @this {TokenizeContext}
 * @type {Exiter}
 */
function exitCallout(effects) {
	assert(this.containerState, "expected containerState to be defined");
	if (this.containerState.calloutContentStarted) {
		effects.exit("calloutContent");
	}
	effects.exit("callout");
}
