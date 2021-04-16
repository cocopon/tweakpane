import {ViewProps} from '../model/view-props';

/**
 * A controller that has a view to control.
 */
export interface Controller {
	readonly viewProps: ViewProps;

	// TODO: Remove in the next major version
	/** @deprecated Use ViewProps.value('disposed').emitter instead. */
	onDispose?(): void;
}
