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
		return this.controller_.valueController.sliderController.props.get(
			'maxValue',
		);
	}

	set max(max: number) {
		this.controller_.valueController.sliderController.props.set(
			'maxValue',
			max,
		);
	}

	get min(): number {
		return this.controller_.valueController.sliderController.props.get(
			'minValue',
		);
	}

	set min(max: number) {
		this.controller_.valueController.sliderController.props.set(
			'minValue',
			max,
		);
	}
}
