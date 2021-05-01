import {ViewProps} from '../model/view-props';

/**
 * A controller that has a view to control.
 */
export interface Controller {
	readonly viewProps: ViewProps;
}
