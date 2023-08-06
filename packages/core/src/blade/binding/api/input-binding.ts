import {InputBindingController} from '../controller/input-binding.js';
import {BindingApi} from './binding.js';

/**
 * The API for input binding between the parameter and the pane.
 * @template In The internal type.
 * @template Ex The external type.
 */
export type InputBindingApi<In = unknown, Ex = unknown> = BindingApi<
	In,
	Ex,
	InputBindingController<In>
>;
