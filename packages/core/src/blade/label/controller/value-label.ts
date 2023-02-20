import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {TpError} from '../../../common/tp-error';
import {
	BladeControllerState,
	importBladeControllerState,
} from '../../common/controller/blade';
import {ValueBladeController} from '../../common/controller/value-blade';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

interface Config<T, C extends ValueController<T>, Va extends Value<T>> {
	blade: Blade;
	props: LabelProps;
	value: Va;
	valueController: C;
}

export class LabeledValueController<
	T,
	C extends ValueController<T> = ValueController<T>,
	Va extends Value<T> = Value<T>,
> extends ValueBladeController<T, LabelView, Va> {
	public readonly props: LabelProps;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<T, C, Va>) {
		if (config.value !== config.valueController.value) {
			throw TpError.shouldNeverHappen();
		}
		const viewProps = config.valueController.viewProps;
		super({
			...config,
			value: config.value,
			view: new LabelView(doc, {
				props: config.props,
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});

		this.props = config.props;
		this.valueController = config.valueController;

		this.view.valueElement.appendChild(this.valueController.view.element);
	}

	override import(state: BladeControllerState): boolean {
		return importBladeControllerState(
			state,
			(s) => super.import(s),
			(p) => ({
				label: p.required.string,
				value: p.optional.raw,
			}),
			(result) => {
				this.props.set('label', result.label);
				if (result.value) {
					this.value.rawValue = result.value as T;
				}
				return true;
			},
		);
	}

	override export(): BladeControllerState {
		return {
			...super.export(),
			label: this.props.get('label'),
			value: this.value.rawValue,
		};
	}
}
