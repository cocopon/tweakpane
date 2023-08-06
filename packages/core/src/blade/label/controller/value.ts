import {ValueController} from '../../../common/controller/value.js';
import {LabelController} from '../../../common/label/controller/label.js';
import {LabelProps, LabelView} from '../../../common/label/view/label.js';
import {Value} from '../../../common/model/value.js';
import {TpError} from '../../../common/tp-error.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../common/controller/blade-state.js';
import {Blade} from '../../common/model/blade.js';

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
export type LabeledValueBladeConfig<
	T,
	C extends ValueController<T>,
	Va extends Value<T>,
> = Config<T, C, Va>;

/**
 * @hidden
 */
export class LabeledValueBladeController<
		T,
		C extends ValueController<T> & Partial<PropsPortable> = ValueController<T>,
		Va extends Value<T> = Value<T>,
	>
	extends BladeController<LabelView>
	implements ValueController<T, LabelView, Va>
{
	public readonly value: Va;
	public readonly labelController: LabelController<C>;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<T, C, Va>) {
		if (config.value !== config.valueController.value) {
			throw TpError.shouldNeverHappen();
		}
		const viewProps = config.valueController.viewProps;
		const lc = new LabelController(doc, {
			blade: config.blade,
			props: config.props,
			valueController: config.valueController,
		});

		super({
			...config,
			view: new LabelView(doc, {
				props: config.props,
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});

		this.labelController = lc;
		this.value = config.value;
		this.valueController = config.valueController;

		this.view.valueElement.appendChild(this.valueController.view.element);
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) =>
				super.importState(s) &&
				this.labelController.importProps(s) &&
				(this.valueController.importProps?.(state) ?? true),
			(p) => ({
				value: p.optional.raw,
			}),
			(result) => {
				if (result.value) {
					this.value.rawValue = result.value as T;
				}
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			value: this.value.rawValue,
			...this.labelController.exportProps(),
			...(this.valueController.exportProps?.() ?? {}),
		});
	}
}
