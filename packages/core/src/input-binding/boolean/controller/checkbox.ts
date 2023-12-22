import {ValueController} from '../../../common/controller/value.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {forceCast} from '../../../misc/type-util.js';
import {CheckboxView} from '../view/checkbox.js';

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
		this.onLabelMouseDown_ = this.onLabelMouseDown_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new CheckboxView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
		this.view.labelElement.addEventListener(
			'mousedown',
			this.onLabelMouseDown_,
		);
	}

	private onInputChange_(ev: Event): void {
		const inputElem: HTMLInputElement = forceCast(ev.currentTarget);
		this.value.rawValue = inputElem.checked;
		ev.preventDefault();
		ev.stopPropagation();
	}

	private onLabelMouseDown_(ev: MouseEvent): void {
		// Prevent unwanted text selection
		// https://github.com/cocopon/tweakpane/issues/545
		ev.preventDefault();
	}
}
