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

interface Config<
	In,
	Vc extends ValueController<In>,
	Va extends BindingValue<In>,
> extends LabeledValueConfig<In, Vc, Va> {
	tag?: string | undefined;
}

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
			(s) => super.importState(s),
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
			tag: this.tag,
		});
	}
}

export function isBindingController(
	bc: BladeController,
): bc is BindingController {
	return isValueBladeController(bc) && isBindingValue(bc.value);
}
