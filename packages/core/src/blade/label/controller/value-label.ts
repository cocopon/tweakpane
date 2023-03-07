import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {TpError} from '../../../common/tp-error';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {ValueBladeController} from '../../common/controller/value-blade';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

/**
 * @hidden
 */
interface Config<T, C extends ValueController<T>, Va extends Value<T>> {
	blade: Blade;
	props: LabelProps;
	value: Va;
	valueController: C;
}
/**
 * @hidden
 */
export type LabeledValueConfig<
	T,
	C extends ValueController<T>,
	Va extends Value<T>,
> = Config<T, C, Va>;

/**
 * @hidden
 */
export class LabeledValueController<
		T,
		C extends ValueController<T> = ValueController<T>,
		Va extends Value<T> = Value<T>,
	>
	extends BladeController<LabelView>
	implements ValueBladeController<T, LabelView, Va>
{
	public readonly props: LabelProps;
	public readonly value: Va;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<T, C, Va>) {
		if (config.value !== config.valueController.value) {
			throw TpError.shouldNeverHappen();
		}
		const viewProps = config.valueController.viewProps;
		super({
			...config,
			view: new LabelView(doc, {
				props: config.props,
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});

		this.props = config.props;
		this.value = config.value;
		this.valueController = config.valueController;

		this.view.valueElement.appendChild(this.valueController.view.element);
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
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

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			label: this.props.get('label'),
			value: this.value.rawValue,
		});
	}
}
