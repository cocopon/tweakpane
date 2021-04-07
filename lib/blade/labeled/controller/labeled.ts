import {Controller} from '../../../common/controller/controller';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabeledProps, LabeledView} from '../view/labeled';

interface Config<C> {
	blade: Blade;
	props: LabeledProps;
	valueController: C;
}

export class LabeledController<C extends Controller> extends BladeController<
	LabeledView
> {
	public readonly props: LabeledProps;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<C>) {
		const viewProps = config.valueController.viewProps;
		super({
			...config,
			view: new LabeledView(doc, {
				props: config.props,
				viewProps: viewProps,
			}),
			viewProps: viewProps,
		});

		this.props = config.props;
		this.valueController = config.valueController;

		this.view.valueElement.appendChild(this.valueController.view.element);
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
