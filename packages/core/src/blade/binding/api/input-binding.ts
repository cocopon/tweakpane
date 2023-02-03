import {InputBindingController} from '../controller/input-binding';
import {BindingApi} from './binding';

/**
 * The API for input binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export type InputBindingApi<In, Ex> = BindingApi<
	In,
	Ex,
	InputBindingController<In>
>;
