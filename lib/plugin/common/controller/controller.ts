import {View} from '../view/view';

/**
 * A controller that has a view to control.
 */
export interface Controller {
	/**
	 * The view to control.
	 */
	readonly view: View;

	onDispose?(): void;
}
