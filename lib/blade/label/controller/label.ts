import {Controller} from '../../../common/controller/controller';
import {bindDisposed} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

export interface LabelableController extends Controller {
	view: View;
}

interface Config<C extends LabelableController> {
	blade: Blade;
	props: LabelProps;
	valueController: C;
}

export class LabelController<
	C extends LabelableController
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

		// TODO: Remove in the next major version
		bindDisposed(this.viewProps, () => {
			const vc = this.valueController;
			if (vc.onDispose) {
				console.warn(
					"Controller.onDispose is deprecated. Use ViewProps.value('disposed').emitter instead.",
				);
				vc.onDispose();
			}
			if (vc.view.onDispose) {
				console.warn(
					"View.onDispose is deprecated. Use ViewProps.value('disposed').emitter instead.",
				);
				vc.view.onDispose();
			}
		});
	}
}
