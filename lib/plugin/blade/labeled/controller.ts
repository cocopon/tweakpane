import {Controller} from '../../common/controller/controller';
import {ViewProps} from '../../common/view/view';
import {
	BladeController,
	setUpBladeController,
} from '../common/controller/blade';
import {Blade} from '../common/model/blade';
import {LabeledView} from './view';

interface Config<C> {
	blade: Blade;
	label?: string;
	valueController: C;
}

export class LabeledController<C extends Controller>
	implements BladeController {
	public readonly blade: Blade;
	public readonly valueController: C;
	public readonly view: LabeledView;

	constructor(doc: Document, config: Config<C>) {
		this.blade = config.blade;
		this.valueController = config.valueController;

		this.view = new LabeledView(doc, {
			label: config.label,
			viewProps: this.viewProps,
		});
		this.view.valueElement.appendChild(this.valueController.view.element);

		setUpBladeController(this);
	}

	get viewProps(): ViewProps {
		return this.valueController.viewProps;
	}
}
