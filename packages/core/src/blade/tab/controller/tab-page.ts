import {bindValueMap} from '../../../common/model/reactive.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {PlainView} from '../../../common/view/plain.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
} from '../../common/controller/blade-state.js';
import {ContainerBladeController} from '../../common/controller/container-blade.js';
import {RackController} from '../../common/controller/rack.js';
import {Blade} from '../../common/model/blade.js';
import {TabItemProps} from '../view/tab-item.js';
import {TabPageView} from '../view/tab-page.js';
import {TabItemController} from './tab-item.js';

/**
 * @hidden
 */
export type TabPagePropsObject = {
	selected: boolean;
};

/**
 * @hidden
 */
export type TabPageProps = ValueMap<TabPagePropsObject>;

/**
 * @hidden
 */
interface Config {
	blade: Blade;
	itemProps: TabItemProps;
	props: TabPageProps;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class TabPageController extends ContainerBladeController<PlainView> {
	public readonly props: TabPageProps;
	private readonly ic_: TabItemController;

	constructor(doc: Document, config: Config) {
		const view = new TabPageView(doc, {
			viewProps: config.viewProps,
		});
		super({
			...config,
			rackController: new RackController({
				blade: config.blade,
				element: view.containerElement,
				viewProps: config.viewProps,
			}),
			view: view,
		});

		this.onItemClick_ = this.onItemClick_.bind(this);

		this.ic_ = new TabItemController(doc, {
			props: config.itemProps,
			viewProps: ViewProps.create(),
		});
		this.ic_.emitter.on('click', this.onItemClick_);

		this.props = config.props;
		bindValueMap(this.props, 'selected', (selected) => {
			this.itemController.props.set('selected', selected);
			this.viewProps.set('hidden', !selected);
		});
	}

	get itemController(): TabItemController {
		return this.ic_;
	}

	override importState(state: BladeState): boolean {
		return importBladeState(
			state,
			(s) => super.importState(s),
			(p) => ({
				selected: p.required.boolean,
				title: p.required.string,
			}),
			(result) => {
				this.ic_.props.set('selected', result.selected);
				this.ic_.props.set('title', result.title);
				return true;
			},
		);
	}

	override exportState(): BladeState {
		return exportBladeState(() => super.exportState(), {
			selected: this.ic_.props.get('selected'),
			title: this.ic_.props.get('title'),
		});
	}

	private onItemClick_(): void {
		this.props.set('selected', true);
	}
}
