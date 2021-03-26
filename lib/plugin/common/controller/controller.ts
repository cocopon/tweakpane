import {ViewProps} from '../model/view-props';
import {View} from '../view/view';

/**
 * A controller that has a view to control.
 */
export interface Controller {
	readonly viewProps: ViewProps;

	/**
	 * The view to control.
	 */
	readonly view: View;

	onDispose?(): void;
}
