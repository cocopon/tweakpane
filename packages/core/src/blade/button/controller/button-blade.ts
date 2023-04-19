import {LabelController} from '../../../common/label/controller/label.js';
import {LabelProps, LabelView} from '../../../common/label/view/label.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {BladeController} from '../../common/controller/blade.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state.js';
import {Blade} from '../../common/model/blade.js';
import {ButtonProps} from '../view/button.js';
import {ButtonController} from './button.js';

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	buttonProps: ButtonProps;
	labelProps: LabelProps;
	viewProps: ViewProps;
}

export class ButtonBladeController extends BladeController<LabelView> {
	public readonly buttonController: ButtonController;
	public readonly labelController: LabelController<ButtonController>;

	constructor(doc: Document, config: Config) {
		const bc = new ButtonController(doc, {
			props: config.buttonProps,
			viewProps: config.viewProps,
		});
		const lc = new LabelController(doc, {
			blade: config.blade,
			props: config.labelProps,
			valueController: bc,
		});
		super({
			blade: config.blade,
			view: lc.view,
			viewProps: config.viewProps,
		});

		this.buttonController = bc;
		this.labelController = lc;
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) =>
				super.importState(s) &&
				this.buttonController.importProps(s) &&
				this.labelController.importProps(s),
			() => ({}),
			() => true,
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			...this.buttonController.exportProps(),
			...this.labelController.exportProps(),
		});
	}
}
