export { calloutExt } from "./lib/index.js";

/**
 * Augment.
 */
declare module "micromark-util-types" {
	/**
	 * Token types.
	 */
	interface TokenTypeMap {
		callout: "callout";
		calloutPrefix: "calloutPrefix";
		calloutPrefixWhitespace: "calloutPrefixWhitespace";
		calloutGreaterThanMark: "calloutGreaterThanMark";
		calloutType: "calloutType";
		calloutTypeMarkerLeft: "calloutTypeMarkerLeft";
		calloutExclamationMark: "calloutExclamationMark";
		calloutTypeString: "calloutTypeString";
		calloutTypeMarkerRight: "calloutTypeMarkerRight";
		calloutCollapseMarkerPlus: "calloutCollapseMarkerPlus";
		calloutCollapseMarkerMinus: "calloutCollapseMarkerMinus";
		calloutTitle: "calloutTitle";
		calloutTitleChunk: "calloutTitleChunk";
		calloutContent: "calloutContent";
	}

	interface ContainerState {
		calloutOpen?: boolean;
		calloutContentStarted?: boolean;
	}
}
