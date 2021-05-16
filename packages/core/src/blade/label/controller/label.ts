import {Controller} from '../../../common/controller/controller';
import {View} from '../../../common/view/view';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

interface Config<C extends Controller<View>> {
	blade: Blade;
	props: LabelProps;
	valueController: C;
}

export class LabelController<
	C extends Controller<View>,
> extends BladeController<LabelView> {
	public readonly props: LabelProps;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<C>) {
		const viewProps = config.valueController.viewProps;
		super({
			...config,
			view: new LabelView(doc, {
				props: config.props,
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});

		this.props = config.props;
		this.valueController = config.valueController;

		this.view.valueElement.appendChild(this.valueController.view.element);
	}
}
