import {Controller} from '../../../common/controller/controller';
import {BladeController} from '../../common/controller/blade';
import {
	BladeState,
	exportBladeState,
	importBladeState,
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
export class LabelBladeController<
	C extends Controller,
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

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				label: p.required.string,
			}),
			(result) => {
				this.props.set('label', result.label);
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			label: this.props.get('label'),
		});
	}
}
