import {ViewProps} from '../model/view-props';
import {View} from '../view/view';

/**
 * A controller that has a view to control.
 */
export interface Controller<V extends View> {
	readonly view: V;
	readonly viewProps: ViewProps;
}
