import {ViewProps} from '../../../common/model/view-props';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state';
import {Blade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelProps, LabelView} from '../../label/view/label';
import {ButtonProps} from '../view/button';
import {ButtonController} from './button';

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
