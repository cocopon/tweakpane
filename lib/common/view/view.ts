/**
 * A view interface.
 */
export interface View {
	/**
	 * A root element of the view.
	 */
	readonly element: HTMLElement;

	// TODO: Remove in the next major version
	/** @deprecated Use ViewProps.value('disposed').emitter instead. */
	onDispose?(): void;
}
