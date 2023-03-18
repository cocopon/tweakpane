import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {LabelBladeController} from '../../label/controller/label';
import {ButtonController} from './button';

export class ButtonBladeController extends LabelBladeController<ButtonController> {
	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				title: p.required.string,
			}),
			(result) => {
				this.valueController.props.set('title', result.title);
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			title: this.valueController.props.get('title'),
		});
	}
}
