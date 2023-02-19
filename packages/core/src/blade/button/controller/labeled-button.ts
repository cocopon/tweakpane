import {parseRecord} from '../../../common/micro-parsers';
import {BladeControllerState} from '../../common/controller/blade';
import {LabelBladeController} from '../../label/controller/label';
import {ButtonController} from './button';

export class LabeledButtonController extends LabelBladeController<ButtonController> {
	public import(state: BladeControllerState): boolean {
		super.import(state);

		const result = parseRecord(state, (p) => ({
			title: p.required.string,
		}));
		if (!result) {
			return false;
		}

		this.valueController.props.set('title', result.title);
		return true;
	}

	public export(): BladeControllerState {
		return {
			...super.export(),
			title: this.valueController.props.get('title'),
		};
	}
}
