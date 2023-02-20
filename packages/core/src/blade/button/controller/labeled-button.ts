import {
	BladeControllerState,
	importBladeControllerState,
} from '../../common/controller/blade';
import {LabelBladeController} from '../../label/controller/label';
import {ButtonController} from './button';

export class LabeledButtonController extends LabelBladeController<ButtonController> {
	override import(state: BladeControllerState): boolean {
		return importBladeControllerState(
			state,
			(s) => super.import(s),
			(p) => ({
				title: p.required.string,
			}),
			(result) => {
				this.valueController.props.set('title', result.title);
				return true;
			},
		);
	}

	override export(): BladeControllerState {
		return {
			...super.export(),
			title: this.valueController.props.get('title'),
		};
	}
}
