import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {forceCast} from '../../../misc/type-util';
import {CheckboxView} from '../view/checkbox';

/**
 * @hidden
 */
interface Config {
	value: Value<boolean>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class CheckboxController
	implements ValueController<boolean, CheckboxView>
{
	public readonly value: Value<boolean>;
	public readonly view: CheckboxView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new CheckboxView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		this.value.rawValue = inputElem.checked;
	}
}
