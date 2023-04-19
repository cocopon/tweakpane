import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../../blade/common/controller/blade-state.js';
import {Blade} from '../../../blade/common/model/blade.js';
import {Controller} from '../../controller/controller.js';
import {ViewProps} from '../../model/view-props.js';
import {LabelProps, LabelView} from '../view/label.js';

/**
 * @hidden
 */
interface Config<C extends Controller> {
	blade: Blade;
	props: LabelProps;
	valueController: C;
}

/**
 * @hidden
 */
export class LabelController<C extends Controller>
	implements Controller<LabelView>, PropsPortable
{
	public readonly props: LabelProps;
	public readonly valueController: C;
	public readonly view: LabelView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config<C>) {
		this.props = config.props;
		this.valueController = config.valueController;
		this.viewProps = config.valueController.viewProps;
		this.view = new LabelView(doc, {
			props: config.props,
			viewProps: this.viewProps,
		});

		this.view.valueElement.appendChild(this.valueController.view.element);
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				label: p.optional.string,
			}),
			(result) => {
				this.props.set('label', result.label);
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		return exportBladeState(null, {
			label: this.props.get('label'),
		});
	}
}
