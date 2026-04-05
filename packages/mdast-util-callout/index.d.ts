import { Parent, PhrasingContent } from "mdast";
export { calloutFromMarkdown } from "./lib/index.js";

export interface CalloutTitle extends Parent {
	type: "calloutTitle";
	children: PhrasingContent[];
}

export interface CalloutContent extends Parent {
	type: "calloutContent";
}

export interface CalloutBase extends Parent {
	type: "callout";
	titled: boolean;
	calloutType: string;
	collapse?: "open" | "closed";
}

export interface TitledCallout extends CalloutBase {
	titled: true;
	children: [CalloutTitle] | [CalloutTitle, CalloutContent];
}

export interface UntitledCallout extends CalloutBase {
	titled: false;
	children: [] | [CalloutContent];
}

export type Callout = TitledCallout | UntitledCallout;

declare module "mdast" {
	interface RootContentMap {
		callout: Callout;
		calloutTitle: CalloutTitle;
		calloutContent: CalloutContent;
	}
}
