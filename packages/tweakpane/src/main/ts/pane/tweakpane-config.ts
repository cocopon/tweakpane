export interface TweakpaneConfig {
	/**
	 * The custom container element of the pane.
	 */
	container?: HTMLElement;
	/**
	 * The default expansion of the pane.
	 */
	expanded?: boolean;
	/**
	 * The pane title that can expand/collapse the entire pane.
	 */
	title?: string;

	/**
	 * @hidden
	 */
	document?: Document;
}
