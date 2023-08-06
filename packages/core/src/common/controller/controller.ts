import {ViewProps} from '../model/view-props.js';
import {View} from '../view/view.js';

/**
 * A controller that has a view to control.
 */
export interface Controller<V extends View = View> {
	readonly view: V;
	readonly viewProps: ViewProps;
}
