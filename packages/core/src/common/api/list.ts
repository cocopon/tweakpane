import {BindingApi} from '../../blade/binding/api/binding';
import {InputBindingApi} from '../../blade/binding/api/input-binding';
import {InputBindingController} from '../../blade/binding/controller/input-binding';
import {ListItem} from '../constraint/list';
import {ListController} from '../controller/list';

export class ListInputBindingApi<T>
	extends BindingApi<T, T, InputBindingController<T, ListController<T>>>
	implements InputBindingApi<T, T>
{
	get options(): ListItem<T>[] {
		return this.controller.valueController.props.get('options');
	}

	set options(options: ListItem<T>[]) {
		this.controller.valueController.props.set('options', options);
	}
}
