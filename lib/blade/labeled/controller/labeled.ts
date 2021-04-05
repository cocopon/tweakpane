import {Controller} from '../../../common/controller/controller';
import {ViewProps} from '../../../common/model/view-props';
import {
	BladeController,
	setUpBladeController,
} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabeledProps, LabeledView} from '../view/labeled';

interface Config<C> {
	blade: Blade;
	props: LabeledProps;
	valueController: C;
}

export class LabeledController<C extends Controller>
	implements BladeController {
	public readonly blade: Blade;
	public readonly props: LabeledProps;
	public readonly valueController: C;
	public readonly view: LabeledView;

	constructor(doc: Document, config: Config<C>) {
		this.blade = config.blade;
		this.props = config.props;
		this.valueController = config.valueController;

		this.view = new LabeledView(doc, {
			props: this.props,
			viewProps: this.viewProps,
		});
		this.view.valueElement.appendChild(this.valueController.view.element);

		setUpBladeController(this);
	}

	get viewProps(): ViewProps {
		return this.valueController.viewProps;
	}

	public onDispose() {
		const vc = this.valueController;
		if (vc.onDispose) {
			vc.onDispose();
		}
		if (vc.view.onDispose) {
			vc.view.onDispose();
		}
	}
}
