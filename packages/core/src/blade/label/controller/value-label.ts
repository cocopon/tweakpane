import {ValueController} from '../../../common/controller/value';
import {View} from '../../../common/view/view';
import {ValueBladeController} from '../../common/controller/value-blade';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

interface Config<T, C extends ValueController<T, View>> {
	blade: Blade;
	props: LabelProps;
	valueController: C;
}

export class LabeledValueController<
	T,
	C extends ValueController<T, View>,
> extends ValueBladeController<T, LabelView> {
	public readonly props: LabelProps;
	public readonly valueController: C;

	constructor(doc: Document, config: Config<T, C>) {
		const viewProps = config.valueController.viewProps;
		super({
			...config,
			value: config.valueController.value,
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
