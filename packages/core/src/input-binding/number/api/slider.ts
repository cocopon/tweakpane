import {BindingApi} from '../../../blade/binding/api/binding';
import {InputBindingApi} from '../../../blade/binding/api/input-binding';
import {InputBindingController} from '../../../blade/binding/controller/input-binding';
import {SliderTextController} from '../../../common/number/controller/slider-text';

export class SliderInputBindingApi
	extends BindingApi<
		number,
		number,
		InputBindingController<number, SliderTextController>
	>
	implements InputBindingApi<number, number>
{
	get max(): number {
		return this.controller.valueController.sliderController.props.get('max');
	}

	set max(max: number) {
		this.controller.valueController.sliderController.props.set('max', max);
	}

	get min(): number {
		return this.controller.valueController.sliderController.props.get('min');
	}

	set min(max: number) {
		this.controller.valueController.sliderController.props.set('min', max);
	}
}
