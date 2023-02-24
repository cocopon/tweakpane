import {
	BindingValue,
	isBindingValue,
} from '../../../common/binding/value/binding';
import {ValueController} from '../../../common/controller/value';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {isValueBladeController} from '../../common/controller/value-blade';
import {
	LabeledValueConfig,
	LabeledValueController,
} from '../../label/controller/value-label';

function excludeValue(state: BladeState): Omit<BladeState, 'value'> {
	const result = {
		...state,
	};
	delete result.value;
	return result;
}

/**
 * @hidden
 */
interface Config<
	In,
	Vc extends ValueController<In>,
	Va extends BindingValue<In>,
> extends LabeledValueConfig<In, Vc, Va> {
	tag?: string | undefined;
}

/**
 * @hidden
 */
export class BindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
	Va extends BindingValue<In> = BindingValue<In>,
> extends LabeledValueController<In, Vc, Va> {
	public tag: string | undefined;

	constructor(doc: Document, config: Config<In, Vc, Va>) {
		super(doc, config);

		this.tag = config.tag;
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			// Exclude `value` from super.import()
			// value should be imported with binding
			(_s) => super.importState(excludeValue(state)),
			(p) => ({
				tag: p.optional.string,
			}),
			(result) => {
				this.tag = result.tag;
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			key: this.value.binding.target.key,
			tag: this.tag,
			value: this.value.binding.target.read(),
		});
	}
}

export function isBindingController(
	bc: BladeController,
): bc is BindingController {
	return isValueBladeController(bc) && isBindingValue(bc.value);
}
