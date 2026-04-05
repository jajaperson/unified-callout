import { fromMarkdown } from "mdast-util-from-markdown";
import { calloutExt } from "micromark-extension-callout";
import { calloutFromMarkdown } from "../index.js";
import { inputs } from "../../../fixture/index.js";

export const inputDir = new URL("../../../fixture/", import.meta.url);
export const outputDir = new URL("fixture/", import.meta.url);

/**
 * @type {Array<{description: string, input: string, output: string, process: (inp: Buffer) => string}>}
 */
export const fixtures = Object.entries(inputs)
	.map(([name, description]) => ({
		description,
		input: `${name}.md`,
		output: `${name}.json`,
		process(md) {
			const ast = fromMarkdown(md, {
				extensions: [calloutExt()],
				mdastExtensions: [calloutFromMarkdown()],
			});
			return JSON.stringify(ast, null, "\t");
		},
	}))
	.concat({
		description: "Should allow extra spaces where valid when `indentedCode` is disabled",
		input: "extraSpaces.md",
		output: "extraSpacesNoCode.json",
		process(md) {
			const ast = fromMarkdown(md, {
				extensions: [{ disable: { null: ["codeIndented"] } }, calloutExt()],
				mdastExtensions: [calloutFromMarkdown()],
			});
			return JSON.stringify(ast, null, "\t");
		},
	});
