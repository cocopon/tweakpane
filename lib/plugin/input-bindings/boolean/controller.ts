import {forceCast} from '../../../misc/type-util';
import {ValueController} from '../../common/controller/value';
import {Value} from '../../common/model/value';
import {ViewModel} from '../../common/model/view-model';
import {CheckboxView} from './view';

/**
 * @hidden
 */
export interface Config {
	value: Value<boolean>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class CheckboxController implements ValueController<boolean> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<boolean>;
	public readonly view: CheckboxView;

	constructor(document: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new CheckboxView(document, {
			model: this.viewModel,
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		this.value.rawValue = inputElem.checked;
		this.view.update();
	}
}
