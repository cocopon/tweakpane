import {Controller} from '../../../common/controller/controller';
import {ViewProps} from '../../../common/model/view-props';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../common/controller/blade-state';
import {Blade} from '../../common/model/blade';
import {LabelProps, LabelView} from '../view/label';

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
