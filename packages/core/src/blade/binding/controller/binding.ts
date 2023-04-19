import {
	BindingValue,
	isBindingValue,
} from '../../../common/binding/value/binding.js';
import {ValueController} from '../../../common/controller/value.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state.js';
import {isValueBladeController} from '../../common/controller/value-blade.js';
import {
	LabeledValueBladeConfig,
	LabeledValueBladeController,
} from '../../label/controller/value.js';

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
> extends LabeledValueBladeConfig<In, Vc, Va> {
	tag?: string | undefined;
}

/**
 * @hidden
 */
export class BindingController<
	In = unknown,
	Vc extends ValueController<In> = ValueController<In>,
	Va extends BindingValue<In> = BindingValue<In>,
> extends LabeledValueBladeController<In, Vc, Va> {
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
		return exportBladeState(() => excludeValue(super.exportState()), {
			binding: {
				key: this.value.binding.target.key,
				value: this.value.binding.target.read(),
			},
			tag: this.tag,
		});
	}
}

export function isBindingController(
	bc: BladeController,
): bc is BindingController {
	return isValueBladeController(bc) && isBindingValue(bc.value);
}
