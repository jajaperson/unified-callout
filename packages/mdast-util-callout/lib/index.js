/** @import {Extension as FromMarkdownExtension, CompileContext, Handle as FromMarkdownHandle} from "mdast-util-from-markdown" */
import { ok as assert } from "devlop";

/**
 * Create an extension for `mdast-util-from-markdown` to enable Obsidian-style callouts.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown`.
 */
export function calloutFromMarkdown() {
	return {
		enter: {
			callout(token) {
				this.enter(
					{
						type: "callout",
						calloutType: "note",
						titled: false,
						children: [],
					},
					token,
				);
			},
			calloutTypeString() {
				this.buffer();
			},
			calloutCollapseMarkerPlus() {
				const node = this.stack[this.stack.length - 1];
				assert(node.type === "callout", "expected callout on top of stack");
				node.collapse = "open";
			},
			calloutCollapseMarkerMinus() {
				const node = this.stack[this.stack.length - 1];
				assert(node.type === "callout", "expected callout on top of stack");
				node.collapse = "closed";
			},
			calloutTitle(token) {
				const node = this.stack[this.stack.length - 1];
				assert(node.type === "callout", "expected callout on top of stack");
				node.titled = true;
				this.enter({ type: "calloutTitle", children: [] }, token);
			},
			calloutContent(token) {
				this.enter({ type: "calloutContent", children: [] }, token);
			},
		},
		exit: {
			callout(token) {
				this.exit(token);
			},
			calloutTitle(token) {
				this.exit(token);
			},
			calloutTypeString() {
				const calloutType = this.resume();
				const node = this.stack[this.stack.length - 1];
				assert(node.type === "callout", "expected callout on top of stack");
				node.calloutType = calloutType;
			},
			calloutContent(token) {
				this.exit(token);
			},
		},
	};
}
